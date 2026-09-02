<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Criar um novo comentário
     */
    public function store(Request $request, $songId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'song_id' => $songId,
            'content' => $request->content,
            'parent_id' => $request->parent_id
        ]);

        return redirect()->back()->with('success', 'Comentário publicado!');
    }

    /**
     * Excluir um comentário
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        // Verificar se o usuário é o autor
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Você não tem permissão para excluir este comentário.');
        }

        $comment->delete();

        return redirect()->back()->with('success', 'Comentário excluído!');
    }
}