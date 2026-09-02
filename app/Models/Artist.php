<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    protected $fillable = ['name', 'bio', 'image_url'];

    public function songs()
    {
        return $this->hasMany(Song::class);
    }
}