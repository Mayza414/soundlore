<?php
use App\Http\Controllers\SongController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SongController::class, 'index'])->name('home');
Route::get('/musicas/{song}', [SongController::class, 'show'])->name('songs.show');
Route::get('/generos/{genre}', [GenreController::class, 'show'])->name('genres.show');

Route::middleware('auth')->group(function () {
    Route::post('/musicas/{song}/comentarios', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('/comentarios/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});

require __DIR__.'/auth.php';