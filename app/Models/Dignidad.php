<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dignidad extends Model
{
    use HasFactory;

    protected $table = 'dignidades';

    protected $fillable = [
        'nombre_dignidad',
        'tipo_dignidad',  //T: RESULTADOS TOTALES;  W:RESULTADOS WEBSTER:  J: RESULTADOS JUNTAS
        'activo'
    ];

    public function actas()
{
    return $this->hasMany(Acta::class, 'dignidad_id');
}

    function scopeActivo(Builder $query, $activo) {
        if ($activo) {
            return $query->where('dig.activo', $activo);
        }
    }

    function scopeTipo(Builder $query, $tipo) {
        if ($tipo) {
            return $query->where('dig.tipo_dignidad',  $tipo);
        }
    }
}
