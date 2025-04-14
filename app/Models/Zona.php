<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zona extends Model
{
    use HasFactory;

    public function parroquia()
    {
        return $this->belongsTo(Parroquia::class, 'parroquia_id');
    }

    public function actas()
    {
        return $this->hasMany(Acta::class);
    }
}
