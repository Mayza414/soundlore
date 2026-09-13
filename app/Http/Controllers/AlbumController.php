<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Genre;
use Inertia\Inertia;

class AlbumController extends Controller
{
    public function index()
    {
        $albums = Album::with('artist')
            ->withCount('songs')
            ->latest()
            ->get();

        return Inertia::render('Album/Index', [
            'albums' => $albums,
            'genres' => Genre::all(),
        ]);
    }

    public function show(Album $album)
    {
        $album->load(['artist', 'songs.genres']);

        return Inertia::render('Album/Show', [
            'album' => $album,
            'genres' => Genre::all(),
        ]);
    }
}