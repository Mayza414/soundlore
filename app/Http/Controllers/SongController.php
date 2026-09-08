<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Song;
use App\Models\Genre;
use Inertia\Inertia;

class SongController extends Controller
{
    public function index()
    {
        $songs = Song::with(['artist', 'genres'])->take(6)->get();
        $genres = Genre::all();

        $featuredArtist = null;
        $latestArtist = Artist::latest()->first();

        if ($latestArtist) {
            $latestSong = Song::with('genres')
                ->where('artist_id', $latestArtist->id)
                ->latest()
                ->first();

            $featuredArtist = [
                'id' => $latestArtist->id,
                'name' => $latestArtist->name,
                'bio' => $latestArtist->bio,
                'image_url' => $latestArtist->image_url,
                'genreLabel' => $latestSong?->genres->pluck('name')->implode(' / '),
                'songId' => $latestSong?->id,
            ];
        }

        return Inertia::render('Home', [
            'featuredSongs' => $songs,
            'genres' => $genres,
            'featuredArtist' => $featuredArtist,
        ]);
    }

    public function show($id)
    {
        $song = Song::with([
            'artist',
            'genres',
            'curiosities',
            'comments.user'
        ])->findOrFail($id);

        $genres = Genre::all();

        return Inertia::render('Songs/Show', [
            'song' => $song,
            'genres' => $genres,
        ]);
    }
}