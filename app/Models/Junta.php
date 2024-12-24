<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Junta extends Model
{
    use HasFactory;

    function actas(): HasMany
    {
        return $this->hasMany(Acta::class)->with('votos');
    }

    function scopeProvincia($query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('prov.id', $provincia_id);
        }
    }

    function scopeCanton($query, $canton_id)
    {
        if ($canton_id) {
            return $query->where('c.id', $canton_id);
        }
    }

    function scopeParroquia($query, $parroquia_id)
    {
        if ($parroquia_id) {
            return $query->where('p.id', $parroquia_id);
        }
    }

    function scopeDignidad($query, $dignidad_id)
    {
        if ($dignidad_id) {
            return $query->where('d.id', $dignidad_id);
        }
    }

    function scopeZona($query, $zona_id)
    {
        if ($zona_id) {
            return $query->where('z.id', $zona_id);
        }
    }

}
