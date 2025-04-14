<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActaCandidato extends Model
{
    use HasFactory;

    protected $table = 'acta_candidato';

    protected $fillable = [
        'acta_id',
        'candidato_id',
        'num_votos'
    ];

    protected $attributes = [
        'num_votos' => 0
    ];

    function scopeDignidad($query, $dignidad_id)
    {
        if ($dignidad_id) {
            return $query->where('d.id', $dignidad_id);
        }
    }

    function scopeProvincia($query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('a.provincia_id', $provincia_id);
        }
    }

    function scopeCanton($query, $canton_id)
    {
        if($canton_id) {
            return $query->where('cant.id', $canton_id);
        }
    }

    function scopeParroquia($query, $parroquia_id)
    {
        if($parroquia_id) {
            return $query->where('parr.id', $parroquia_id);
        }
    }

    function scopeRecinto($query, $recinto_id)
    {
        if($recinto_id) {
            return $query->where('re.id', $recinto_id);
        }
    }

    function scopeZona($query, $zona_id)
    {
        if($zona_id){
            return $query->where('z.id', $zona_id);
        }
    }

    function scopeCuadrada($query, $cuadrada)
    {
        if (!is_null($cuadrada) && $cuadrada !== '') {
            return $query->where('a.cuadrada', $cuadrada);
        }
    }

    function scopeLegible($query, $legible)
    {
        if (!is_null($legible) && $legible !== '') {
            return $query->where('a.legible', $legible);
        }
    }
}
