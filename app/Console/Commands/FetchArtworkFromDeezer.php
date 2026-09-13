<?php

namespace App\Console\Commands;

use App\Models\Artist;
use App\Models\Song;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchArtworkFromDeezer extends Command
{
    protected $signature = 'songs:fetch-images {--force : Sobrescreve imagens já existentes}';
    protected $description = 'Busca capas de música e fotos de artista na API pública do Deezer';

    public function handle(): int
    {
        $force = $this->option('force');

        $artists = Artist::when(
            !$force,
            fn ($q) => $q->where(fn ($q2) => $q2->whereNull('image_url')->orWhere('image_url', ''))
        )->get();
        $this->info("Buscando fotos para {$artists->count()} artista(s)...");

        foreach ($artists as $artist) {
            $response = Http::get('https://api.deezer.com/search/artist', [
                'q' => $artist->name,
            ]);

            if ($response->successful() && !empty($response->json('data'))) {
            $results = collect($response->json('data'));

            // Prioriza resultados cujo nome bate exatamente com o artista buscado,
            // pra evitar que a busca "fuzzy" do Deezer traga artistas famosos e irrelevantes
            $exactMatches = $results->filter(
                fn ($item) => mb_strtolower(trim($item['name'])) === mb_strtolower(trim($artist->name))
            );

            $candidates = $exactMatches->isNotEmpty() ? $exactMatches : $results;
            $data = $candidates->sortByDesc('nb_fan')->first();
            $picture = $data['picture_big'] ?? $data['picture_medium'] ?? null;

                if ($picture) {
                    $artist->update(['image_url' => $picture]);
                    $this->line("✓ {$artist->name}");
                } else {
                    $this->warn("✗ {$artist->name} — sem imagem retornada");
                }
            } else {
                $this->warn("✗ {$artist->name} — não encontrado no Deezer");
            }

            usleep(300000);
        }

        $songs = Song::with('artist')->when(
            !$force,
            fn ($q) => $q->where(fn ($q2) => $q2->whereNull('image_url')->orWhere('image_url', ''))
        )->get();
        $this->info("Buscando capas para {$songs->count()} música(s)...");

        foreach ($songs as $song) {
            $query = trim('track:"'.$song->title.'" artist:"'.($song->artist->name ?? '').'"');

            $response = Http::get('https://api.deezer.com/search', [
                'q' => $query,
            ]);

            if ($response->successful() && !empty($response->json('data'))) {
                $data = $response->json('data')[0];
                $cover = $data['album']['cover_big'] ?? $data['album']['cover_medium'] ?? null;

                if ($cover) {
                    $song->update(['image_url' => $cover]);
                    $this->line("✓ {$song->title}");
                } else {
                    $this->warn("✗ {$song->title} — sem capa retornada");
                }
            } else {
                $this->warn("✗ {$song->title} — não encontrada no Deezer");
            }

            usleep(300000);
        }

        $this->info('Concluído!');

        return self::SUCCESS;
    }
}