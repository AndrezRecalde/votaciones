<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parroquia extends Model
{
    use HasFactory;

    public function canton()
    {
        return $this->belongsTo(Canton::class);
    }

    public function actas()
    {
        return $this->hasMany(Acta::class);
    }

    public function zonas()
    {
        return $this->hasMany(Zona::class, 'parroquia_id');
    }
}
