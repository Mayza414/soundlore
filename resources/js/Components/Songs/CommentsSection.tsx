import React, { useState } from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import { Send, Trash2, MessageCircle } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: { id: number; name: string; avatar_url: string | null };
  replies?: Comment[];
}

interface CommentsSectionProps {
  songId: number;
  comments: Comment[];
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export default function CommentsSection({ songId, comments }: CommentsSectionProps) {
  const { auth } = usePage().props as any;
  const isAuthenticated = !!auth?.user;
  const { data, setData, post, processing, reset } = useForm({ content: '' });
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    const payload: any = { ...data };
    if (replyTo) payload.parent_id = replyTo;

    post(`/musicas/${songId}/comentarios`, {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setReplyTo(null);
      },
    });
  };

  const deleteComment = (commentId: number) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
    router.delete(`/comentarios/${commentId}`, { preserveScroll: true });
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isAuthor = auth?.user && auth.user.id === comment.user.id;
    return (
      <div key={comment.id} className={depth > 0 ? 'ml-8 mt-4 pl-4 border-l border-outline-variant/30' : ''}>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex-shrink-0 flex items-center justify-center font-label-sm text-primary text-xs overflow-hidden">
            {comment.user.avatar_url ? (
              <img src={comment.user.avatar_url} alt={comment.user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(comment.user.name)
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <div className="flex items-baseline gap-2">
                <span className="font-label-sm text-on-surface text-xs">{comment.user.name}</span>
                <span className="font-label-sm text-on-surface-variant/50 text-[10px]">{timeAgo(comment.created_at)}</span>
              </div>
              {isAuthor && (
                <button onClick={() => deleteComment(comment.id)} className="text-on-surface-variant/50 hover:text-tertiary transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="font-body-md text-on-surface-variant text-sm bg-surface-container/30 p-3 rounded-lg rounded-tl-none border border-white/5">
              {comment.content}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mt-2"
              >
                {replyTo === comment.id ? 'Cancelar' : 'Responder'}
              </button>
            )}
          </div>
        </div>
        {comment.replies && comment.replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-white/5 bg-surface-container/50">
        <h2 className="font-headline-md text-xl text-on-surface flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Community Notes
        </h2>
        <p className="font-label-sm text-on-surface-variant text-xs mt-1">{comments.length} comentário(s)</p>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 max-h-[500px]">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
            <p className="font-body-md text-on-surface-variant text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-surface-container/80">
        <div className="relative">
          <textarea
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            disabled={!isAuthenticated || processing}
            placeholder={isAuthenticated ? 'Adicione uma nota...' : 'Faça login para comentar'}
            rows={2}
            className="w-full bg-[#050505] border border-white/10 rounded-lg py-3 px-4 text-on-surface font-body-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isAuthenticated || processing || !data.content.trim()}
            className="absolute right-3 bottom-3 text-primary hover:text-primary-fixed transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {replyTo && (
          <p className="font-label-sm text-[11px] text-primary mt-2">
            Respondendo · <button type="button" onClick={() => setReplyTo(null)} className="text-on-surface-variant hover:text-on-surface">cancelar</button>
          </p>
        )}
      </form>
    </div>
  );
}