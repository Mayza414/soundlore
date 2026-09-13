<?php
namespace App\Http\Controllers;
use App\Models\Genre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GenreController extends Controller
{
    public function show(Genre $genre)
    {
        $songs = $genre->songs()->with('artist')->latest()->get();

        return Inertia::render('Genre/Show', [
            'genre' => $genre,
            'songs' => $songs,
            'genres' => Genre::all(),
        ]);
    }
}