<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Song $song)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => [
                'nullable',
                'exists:comments,id',
                function ($attribute, $value, $fail) use ($song) {
                    if ($value && !Comment::where('id', $value)->where('song_id', $song->id)->exists()) {
                        $fail('O comentário pai não pertence a esta música.');
                    }
                },
            ],
        ]);

        Comment::create([
            'user_id' => Auth::id(),
            'song_id' => $song->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Comentário publicado!');
    }

    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Você não tem permissão para excluir este comentário.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comentário excluído!');
    }
}