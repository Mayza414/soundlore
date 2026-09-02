<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Artist;

class ArtistSeeder extends Seeder
{
    public function run(): void
    {
        $artists = [
            [
                'name' => 'Djavan',
                'bio' => 'Djavan é um cantor, compositor e multi-instrumentista brasileiro, um dos maiores nomes da MPB. Sua música mistura elementos do samba, jazz, funk e música africana.',
                'image_url' => 'https://exemplo.com/djavan.jpg'
            ],
            [
                'name' => 'Queen',
                'bio' => 'Queen é uma banda britânica de rock formada em 1970. Conhecida por sua diversidade musical, performances elaboradas e vocais harmoniosos.',
                'image_url' => 'https://exemplo.com/queen.jpg'
            ],
            [
                'name' => 'Michael Jackson',
                'bio' => 'Michael Jackson foi um cantor, compositor e dançarino americano, conhecido como o "Rei do Pop". Sua carreira e legado influenciaram a música e a cultura pop global.',
                'image_url' => 'https://exemplo.com/michael.jpg'
            ],
            [
                'name' => 'Cartola',
                'bio' => 'Cartola foi um cantor, compositor e poeta brasileiro, considerado um dos maiores nomes do samba. Sua obra é marcada pela poesia e melodia.',
                'image_url' => 'https://exemplo.com/cartola.jpg'
            ],
            [
                'name' => 'The Beatles',
                'bio' => 'The Beatles foi uma banda de rock inglesa formada em Liverpool em 1960. São amplamente considerados a banda mais influente de todos os tempos.',
                'image_url' => 'https://exemplo.com/beatles.jpg'
            ]
        ];

        foreach ($artists as $artist) {
            Artist::create($artist);
        }
    }
}