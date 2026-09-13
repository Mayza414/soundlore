<?php

namespace App\Console\Commands;

use App\Models\Song;
use Illuminate\Console\Command;

class ResetCompleto extends Command
{
    protected $signature = 'soundlore:reset';
    protected $description = 'Reseta o banco (migrate:fresh --seed) e já busca os vídeos/canais do YouTube na sequência certa';

    /**
     * Correções manuais conhecidas: casos em que a busca automática (por
     * canal "- Topic") encontrou um vídeo com título certo mas áudio/duração
     * errados. Sempre aplicadas por último, depois do --force.
     */
    private const CORRECOES_MANUAIS = [
        'Flor de Lis' => 'ivA6ncCdIgM',
    ];

    public function handle(): int
    {
        $this->call('migrate:fresh', ['--seed' => true]);
        $this->call('songs:fetch-images', ['--force' => true]);
        $this->call('artists:fetch-youtube-channel');
        $this->call('songs:fetch-youtube-videos', ['--force' => true]);

        $this->newLine();
        $this->info('Aplicando correções manuais conhecidas...');
        foreach (self::CORRECOES_MANUAIS as $titulo => $videoId) {
            $atualizados = Song::where('title', $titulo)->update(['youtube_video_id' => $videoId]);
            $this->line($atualizados > 0 ? "✓ {$titulo} → {$videoId}" : "? {$titulo} não encontrada");
        }

        $this->info('Reset completo!');
        return self::SUCCESS;
    }
}