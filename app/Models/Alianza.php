<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alianza extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizacion_id',
        'aliado_id'
    ];

    public function organizacion()
    {
        return $this->belongsTo(Organizacion::class, 'organizacion_id');
    }

    public function aliado()
    {
        return $this->belongsTo(Organizacion::class, 'aliado_id');
    }
}
