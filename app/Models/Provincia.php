<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    use HasFactory;


    function scopeActivo(Builder $query, $activo)
    {
        if ($activo) {
            return $query->where('activo', $activo);
        }
    }

    function scopeForId(Builder $query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('id', $provincia_id);
        }
    }
}
