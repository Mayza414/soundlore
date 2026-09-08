<?php
namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Genre;
use Inertia\Inertia;

class ArtistController extends Controller
{
    public function show(Artist $artist)
    {
        $artist->load('songs.genres');

        return Inertia::render('Artist/Show', [
            'artist' => $artist,
            'genres' => Genre::all(),
        ]);
    }
}