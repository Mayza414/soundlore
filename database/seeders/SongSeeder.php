<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Song;
use App\Models\Artist;
use App\Models\Genre;

class SongSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar artistas e gêneros
        $djavan = Artist::where('name', 'Djavan')->first();
        $queen = Artist::where('name', 'Queen')->first();
        $michael = Artist::where('name', 'Michael Jackson')->first();
        $cartola = Artist::where('name', 'Cartola')->first();
        $beatles = Artist::where('name', 'The Beatles')->first();

        $mpb = Genre::where('name', 'MPB')->first();
        $rock = Genre::where('name', 'Rock')->first();
        $pop = Genre::where('name', 'Pop')->first();
        $samba = Genre::where('name', 'Samba')->first();

        // Músicas do Djavan
        $song = Song::create([
            'artist_id' => $djavan->id,
            'title' => 'Flor de Lis',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Eu sou aquela\nQue não tem mais jeito\nEu sou aquela\nQue não tem mais jeito\n\nEu sou aquela\nQue não tem mais jeito\nEu sou aquela\nQue não tem mais jeito",
            'release_year' => 1976
        ]);
        $song->genres()->attach([$mpb->id]);

        $song = Song::create([
            'artist_id' => $djavan->id,
            'title' => 'Oceano',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Oceano\nOceano\nOceano\nOceano",
            'release_year' => 1989
        ]);
        $song->genres()->attach([$mpb->id]);

        // Músicas do Queen
        $song = Song::create([
            'artist_id' => $queen->id,
            'title' => 'Bohemian Rhapsody',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Is this the real life?\nIs this just fantasy?\nCaught in a landslide\nNo escape from reality",
            'release_year' => 1975
        ]);
        $song->genres()->attach([$rock->id]);

        $song = Song::create([
            'artist_id' => $queen->id,
            'title' => 'We Will Rock You',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Buddy you're a boy make a big noise\nPlayin' in the street gonna be a big man someday",
            'release_year' => 1977
        ]);
        $song->genres()->attach([$rock->id]);

        // Músicas do Michael Jackson
        $song = Song::create([
            'artist_id' => $michael->id,
            'title' => 'Thriller',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "It's close to midnight\nSomething evil's lurking in the dark",
            'release_year' => 1982
        ]);
        $song->genres()->attach([$pop->id]);

        $song = Song::create([
            'artist_id' => $michael->id,
            'title' => 'Billie Jean',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "She was more like a beauty queen from a movie scene\nI said don't mind, but what do you mean I am the one",
            'release_year' => 1982
        ]);
        $song->genres()->attach([$pop->id]);

        // Músicas do Cartola
        $song = Song::create([
            'artist_id' => $cartola->id,
            'title' => 'As Rosas Não Falam',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Penso que flores\nSão para quem quer\nE não para quem\nAcredita no amor",
            'release_year' => 1976
        ]);
        $song->genres()->attach([$samba->id]);

        // Músicas dos Beatles
        $song = Song::create([
            'artist_id' => $beatles->id,
            'title' => 'Hey Jude',
            'youtube_video_id' => 'dQw4w9WgXcQ',
            'lyrics' => "Hey Jude, don't make it bad\nTake a sad song and make it better",
            'release_year' => 1968
        ]);
        $song->genres()->attach([$rock->id]);
    }
}