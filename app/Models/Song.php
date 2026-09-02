<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable = ['artist_id', 'title', 'youtube_video_id', 'lyrics', 'release_year', 'image_url'];
    
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }

    public function curiosities()
    {
        return $this->hasMany(Curiosity::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}