<?php
namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Genre;
use Inertia\Inertia;

class ArtistController extends Controller
{
    public function index()
    {
        $artists = Artist::with('songs.genres')
            ->withCount('songs')
            ->orderBy('name')
            ->get();

        return Inertia::render('Artist/Index', [
            'artists' => $artists,
            'genres' => Genre::all(),
        ]);
    }

    public function show(Artist $artist)
    {
        $artist->load(['songs.genres', 'albums' => function ($query) {
            $query->withCount('songs')->latest('release_year');
        }]);

        return Inertia::render('Artist/Show', [
            'artist' => $artist,
            'genres' => Genre::all(),
        ]);
    }
}