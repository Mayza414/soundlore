<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Genre;
use App\Models\Song;
use Illuminate\Database\Seeder;

class ChappellRoanSeeder extends Seeder
{
    /**
     * Cadastra a Chappell Roan como artista e algumas músicas dela.
     *
     * A capa (image_url do artista e das músicas) fica em branco de propósito —
     * depois de rodar este seeder, rode:
     *   ./vendor/bin/sail artisan songs:fetch-images
     * para o comando já existente buscar as imagens via API pública do Deezer.
     */
    public function run(): void
    {
        $artist = Artist::firstOrCreate(
            ['name' => 'Chappell Roan'],
            [
                'bio' => 'Chappell Roan é uma cantora e compositora norte-americana, conhecida por sua estética drag-pop e por hits como "Good Luck, Babe!" e "Hot to Go!". Seu álbum de estreia, "The Rise and Fall of a Midwest Princess" (2023), a projetou como uma das vozes mais marcantes do pop contemporâneo.',
            ]
        );

        // Gênero "Pop" precisa existir (ou é criado, se ainda não houver seeder de gêneros rodado)
        $pop = Genre::firstOrCreate(
            ['name' => 'Pop'],
            ['slug' => 'pop']
        );

        $songs = [
            [
                'title' => 'Good Luck, Babe!',
                'youtube_video_id' => 'V2QpS0jl0Ac',
                'release_year' => 2024,
                'lyrics' => null,
            ],
            [
                'title' => 'Hot to Go!',
                'youtube_video_id' => 'ZWEXtCXjJ7k',
                'release_year' => 2023,
                'lyrics' => null,
            ],
            [
                'title' => 'Pink Pony Club',
                'youtube_video_id' => 'aQ_wLuUMFXQ',
                'release_year' => 2020,
                'lyrics' => null,
            ],
            [
                'title' => 'Red Wine Supernova',
                'youtube_video_id' => 'UOMSc-tsjbA',
                'release_year' => 2023,
                'lyrics' => null,
            ],
        ];

        foreach ($songs as $songData) {
            $song = Song::firstOrCreate(
                [
                    'artist_id' => $artist->id,
                    'title' => $songData['title'],
                ],
                [
                    'youtube_video_id' => $songData['youtube_video_id'],
                    'release_year' => $songData['release_year'],
                    'lyrics' => $songData['lyrics'],
                ]
            );

            // Vincula ao gênero Pop, sem duplicar se rodar o seeder de novo
            $song->genres()->syncWithoutDetaching([$pop->id]);
        }
    }
}   