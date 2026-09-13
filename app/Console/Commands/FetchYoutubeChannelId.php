<?php

namespace App\Console\Commands;

use App\Models\Artist;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchYoutubeChannelId extends Command
{
    protected $signature = 'artists:fetch-youtube-channel
                            {--artist= : Nome do artista (busca parcial). Sem isso, roda para todos sem channel_id salvo.}
                            {--force : Refaz mesmo para quem já tem youtube_channel_id salvo}';

    protected $description = 'Busca e salva o channelId oficial do YouTube para os artistas cadastrados';

    public function handle(): int
    {
        $apiKey = env('YOUTUBE_API_KEY');

        if (empty($apiKey)) {
            $this->error('YOUTUBE_API_KEY não está configurada no .env.');
            return self::FAILURE;
        }

        $query = Artist::query();

        if (! $this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('youtube_channel_id')->orWhere('youtube_channel_id', '');
            });
        }

        if ($nome = $this->option('artist')) {
            $query->where('name', 'like', "%{$nome}%");
        }

        $artists = $query->get();

        if ($artists->isEmpty()) {
            $this->info('Nenhum artista encontrado com esses filtros.');
            return self::SUCCESS;
        }

        $resultados = [];

        foreach ($artists as $artist) {
            $response = Http::get('https://www.googleapis.com/youtube/v3/search', [
                'part' => 'snippet',
                'q' => $artist->name,
                'type' => 'channel',
                'maxResults' => 3,
                'key' => $apiKey,
            ]);

            if ($response->status() === 403) {
                $this->error('Cota da API do YouTube estourada (ou chave inválida). Parando aqui.');
                $this->table(['Artista', 'Resultado'], $resultados);
                return self::FAILURE;
            }

            if ($response->failed()) {
                $resultados[] = [$artist->name, 'Erro na API (HTTP ' . $response->status() . ')'];
                continue;
            }

            $items = $response->json('items', []);

            if (empty($items)) {
                $resultados[] = [$artist->name, 'Nenhum canal encontrado'];
                continue;
            }

            $canal = $items[0];
            $channelId = $canal['snippet']['channelId'] ?? $canal['id']['channelId'] ?? null;
            $channelTitle = $canal['snippet']['channelTitle'] ?? '?';

            if (! $channelId) {
                $resultados[] = [$artist->name, 'Resposta sem channelId'];
                continue;
            }

            $artist->youtube_channel_id = $channelId;
            $artist->save();

            $resultados[] = [$artist->name, "OK — {$channelId} (canal: \"{$channelTitle}\")"];

            usleep(300_000);
        }

        $this->newLine();
        $this->table(['Artista', 'Resultado'], $resultados);
        $this->warn('Confira manualmente se o canal encontrado é mesmo o oficial antes de confiar 100% — a heurística usa o primeiro resultado da busca.');

        return self::SUCCESS;
    }
}