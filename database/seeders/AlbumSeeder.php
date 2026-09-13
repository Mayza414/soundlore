<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Song;

class AlbumSeeder extends Seeder
{
    public function run(): void
    {
        // Exemplo: Álbum do Djavan
        $djavan = Artist::where('name', 'Djavan')->first();
        
        if ($djavan) {
            $album = Album::create([
                'artist_id' => $djavan->id,
                'title' => 'Flor de Lis',
                'description' => 'Álbum de estreia de Djavan, lançado em 1976.',
                'cover_image_url' => null,
                'release_year' => 1976,
            ]);

            // Associar músicas ao álbum
            Song::where('artist_id', $djavan->id)
                ->where('release_year', 1976)
                ->update(['album_id' => $album->id]);
        }

        // Exemplo: Álbum da Chappell Roan
        $chappell = Artist::where('name', 'Chappell Roan')->first();
        
        if ($chappell) {
            $album = Album::create([
                'artist_id' => $chappell->id,
                'title' => 'The Rise and Fall of a Midwest Princess',
                'description' => 'Álbum de estreia de Chappell Roan, lançado em 2023.',
                'cover_image_url' => null,
                'release_year' => 2023,
            ]);

            // Associar músicas ao álbum
            Song::where('artist_id', $chappell->id)
                ->update(['album_id' => $album->id]);
        }
    }
}