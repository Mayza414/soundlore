<?php

namespace App\Console\Commands;

use App\Models\Song;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FetchYoutubeVideos extends Command
{
    protected $signature = 'songs:fetch-youtube-videos
                            {--tipo=clipe : "clipe" para vídeo oficial, "ao-vivo" para performances/shows}
                            {--force : Refaz a busca mesmo para músicas que já têm youtube_video_id}
                            {--artist= : Filtra por nome do artista (busca parcial)}
                            {--song= : Filtra por título da música (busca parcial)}';

    protected $description = 'Busca automaticamente o vídeo do YouTube (clipe oficial ou ao vivo) para as músicas cadastradas, evitando lyric video, cover, reaction, embed bloqueado, etc.';

    private const PALAVRAS_LIXO = [
        'lyric', 'lyrics', 'audio', 'cover', 'reaction',
        'karaoke', 'letra', 'legendado', 'reação',
    ];

    public function handle(): int
    {
        $apiKey = env('YOUTUBE_API_KEY');

        if (empty($apiKey)) {
            $this->error('YOUTUBE_API_KEY não está configurada no .env. Adicione a chave antes de rodar este comando.');
            $this->line('Gere uma em: https://console.cloud.google.com/apis/credentials (ative a "YouTube Data API v3" no projeto).');
            return self::FAILURE;
        }

        $tipo = $this->option('tipo');

        if (! in_array($tipo, ['clipe', 'ao-vivo'], true)) {
            $this->error('--tipo precisa ser "clipe" ou "ao-vivo".');
            return self::FAILURE;
        }

        $palavraChave = $tipo === 'clipe' ? 'official music video' : 'live performance';

        $query = Song::query()->with('artist');

        if (! $this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('youtube_video_id')->orWhere('youtube_video_id', '');
            });
        }

        if ($artist = $this->option('artist')) {
            $query->whereHas('artist', fn ($q) => $q->where('name', 'like', "%{$artist}%"));
        }

        if ($song = $this->option('song')) {
            $query->where('title', 'like', "%{$song}%");
        }

        $songs = $query->get();

        if ($songs->isEmpty()) {
            $this->info('Nenhuma música encontrada com esses filtros (talvez todas já tenham youtube_video_id — use --force pra refazer).');
            return self::SUCCESS;
        }

        $this->warn("Atenção: cada busca consome 100 unidades da cota diária da API do YouTube (limite padrão: 10.000/dia, ~100 buscas).");
        $this->info("Buscando vídeos ({$tipo}) para {$songs->count()} música(s)...");

        $resultados = [];

        foreach ($songs as $song) {
            $termo = "{$song->artist->name} {$song->title} {$palavraChave}";

            $params = [
                'part' => 'snippet',
                'q' => $termo,
                'type' => 'video',
                'videoCategoryId' => 10, // categoria "Música"
                'maxResults' => 5,
                'order' => 'relevance',
                'key' => $apiKey,
            ];

            // Se o artista já tem o canal oficial salvo, restringe a busca a ele —
            // muito mais preciso e evita pegar cover/reaction de outros canais.
            if (! empty($song->artist->youtube_channel_id)) {
                $params['channelId'] = $song->artist->youtube_channel_id;
            }

            $response = Http::get('https://www.googleapis.com/youtube/v3/search', $params);

            if ($response->status() === 403) {
                $this->error('Cota da API do YouTube estourada (ou chave inválida/sem permissão). Parando aqui.');
                $this->table(['Música', 'Resultado'], $resultados);
                return self::FAILURE;
            }

            if ($response->failed()) {
                $resultados[] = [$song->title, 'Erro na API (HTTP ' . $response->status() . ')'];
                continue;
            }

            $items = $response->json('items', []);

            $videoIds = array_values(array_filter(array_map(
                fn ($item) => $item['id']['videoId'] ?? null,
                $items
            )));

            $embeddableMap = $this->buscarEmbeddable($videoIds, $apiKey);

            $escolhido = $this->escolherMelhorVideo($items, $song->artist->name, $embeddableMap);

            if (! $escolhido) {
                $resultados[] = [$song->title, 'Nenhum resultado com embed permitido encontrado'];
                continue;
            }

            $videoId = $escolhido['id']['videoId'] ?? null;
            $canal = $escolhido['snippet']['channelTitle'] ?? '?';

            if (! $videoId) {
                $resultados[] = [$song->title, 'Resposta sem videoId'];
                continue;
            }

            $song->youtube_video_id = $videoId;
            $song->save();

            $resultados[] = [$song->title, "OK — {$videoId} (canal: {$canal})"];

            // Pequena pausa pra não martelar a API
            usleep(300_000);
        }

        $this->newLine();
        $this->table(['Música', 'Resultado'], $resultados);

        return self::SUCCESS;
    }

    /**
     * Consulta em lote (1 unidade de cota, até 50 IDs) se cada vídeo permite ser
     * incorporado (embed) fora do youtube.com. Vídeos de VEVO/gravadoras grandes
     * e canais "- Topic" costumam vir com embeddable=false.
     *
     * @return array<string, bool> videoId => embeddable
     */
    private function buscarEmbeddable(array $videoIds, string $apiKey): array
    {
        if (empty($videoIds)) {
            return [];
        }

        $response = Http::get('https://www.googleapis.com/youtube/v3/videos', [
            'part' => 'status',
            'id' => implode(',', $videoIds),
            'key' => $apiKey,
        ]);

        if ($response->failed()) {
            return [];
        }

        $map = [];
        foreach ($response->json('items', []) as $item) {
            $map[$item['id']] = (bool) ($item['status']['embeddable'] ?? false);
        }

        return $map;
    }

    /**
     * Escolhe o melhor vídeo da lista de resultados:
     * 1. Descarta títulos com palavras "lixo" (lyric, audio, cover, reaction, karaoke, etc.)
     * 2. Descarta vídeos com embed desabilitado (embeddable === false) — senão o player
     *    escondido do site nunca consegue tocar o som
     * 3. Entre os que sobraram, prioriza o vídeo cujo canal contenha o nome do artista
     * 4. Se nada passar nos filtros, usa o primeiro resultado bruto como último recurso
     */
    private function escolherMelhorVideo(array $items, string $nomeArtista, array $embeddableMap = []): ?array
    {
        if (empty($items)) {
            return null;
        }

        $candidatos = array_values(array_filter($items, function ($item) {
            $titulo = Str::lower($item['snippet']['title'] ?? '');

            foreach (self::PALAVRAS_LIXO as $palavra) {
                if (Str::contains($titulo, $palavra)) {
                    return false;
                }
            }

            return true;
        }));

        if (! empty($embeddableMap)) {
            $comEmbedPermitido = array_values(array_filter($candidatos, function ($item) use ($embeddableMap) {
                $id = $item['id']['videoId'] ?? null;
                return ! isset($embeddableMap[$id]) || $embeddableMap[$id] === true;
            }));

            if (! empty($comEmbedPermitido)) {
                $candidatos = $comEmbedPermitido;
            }
        }

        if (empty($candidatos)) {
            return $items[0];
        }

        usort($candidatos, function ($a, $b) use ($nomeArtista) {
            $aOficial = Str::contains(Str::lower($a['snippet']['channelTitle'] ?? ''), Str::lower($nomeArtista));
            $bOficial = Str::contains(Str::lower($b['snippet']['channelTitle'] ?? ''), Str::lower($nomeArtista));

            return (int) $bOficial <=> (int) $aOficial;
        });

        return $candidatos[0];
    }
}