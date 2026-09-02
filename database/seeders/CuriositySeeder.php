<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Curiosity;
use App\Models\Song;

class CuriositySeeder extends Seeder
{
    public function run(): void
    {
        $songs = Song::all();

        $curiosities = [
            [
                'title' => 'Inspiração',
                'content' => 'Esta música foi inspirada em uma viagem do artista pelo litoral brasileiro.'
            ],
            [
                'title' => 'Gravação',
                'content' => 'Foi gravada em apenas uma tomada, sem edições.'
            ],
            [
                'title' => 'Prêmios',
                'content' => 'Ganhou o prêmio de Melhor Música do Ano em 1976.'
            ],
            [
                'title' => 'Versão',
                'content' => 'Existe uma versão em inglês gravada pelo próprio artista.'
            ],
            [
                'title' => 'Clipe',
                'content' => 'O clipe foi gravado em um único dia e em locações reais.'
            ],
            [
                'title' => 'Curiosidade',
                'content' => 'A música foi composta em apenas 15 minutos.'
            ],
            [
                'title' => 'Bastidores',
                'content' => 'O artista escreveu esta música durante uma turnê pela Europa.'
            ]
        ];

        foreach ($songs as $song) {
            // Pegar 2 curiosidades aleatórias
            $selected = collect($curiosities)->random(2);
            
            foreach ($selected as $curiosity) {
                Curiosity::create([
                    'song_id' => $song->id,
                    'title' => $curiosity['title'],
                    'content' => $curiosity['content']
                ]);
            }
        }
    }
}