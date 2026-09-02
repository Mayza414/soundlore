<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curiosity extends Model
{
    use HasFactory;

    protected $fillable = ['song_id', 'title', 'content'];

    public function song()
    {
        return $this->belongsTo(Song::class);
    }
}