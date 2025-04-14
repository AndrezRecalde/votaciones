<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Candidato extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizacion_id',
        'dignidad_id',
        'nombre_candidato',
        'activo'
    ];

    public function organizacion()
    {
        return $this->belongsTo(Organizacion::class);
    }

    function distritosCandidatos(): BelongsToMany
    {
        return $this->belongsToMany(Distrito::class, 'candidato_distrito')
            ->join('distritos as dis', 'dis.id', 'candidato_distrito.distrito_id')
            ->join('provincias as prov', 'prov.id', 'candidato_distrito.provincia_id')
            ->leftJoin('cantones as cant', 'cant.id', 'candidato_distrito.canton_id')
            ->leftJoin('parroquias as parr', 'parr.id', 'candidato_distrito.parroquia_id');
    }

    function distritos(): BelongsToMany
    {
        return $this->belongsToMany(Distrito::class, 'candidato_distrito');
    }

    public function actas(): BelongsToMany
    {
        return $this->belongsToMany(Acta::class)->withPivot('num_votos');
    }

    public function actases()
    {
        return $this->belongsToMany(Acta::class, 'acta_candidato', 'candidato_id', 'acta_id')
            ->withPivot('num_votos');
    }

    function scopeDignidadId(Builder $query, $dignidad_id)
    {
        if ($dignidad_id) {
            return $query->where('c.dignidad_id', $dignidad_id)->where('c.activo', 1);
        }
    }

    public function scopeProvinciaId(Builder $query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('prov.id', $provincia_id);
        }
    }

    public function scopeCantonId(Builder $query, $canton_id)
    {
        if ($canton_id) {
            return $query->where('cant.id', $canton_id);
        }
    }

    public function scopeParroquiaId(Builder $query, $parroquia_id)
    {
        if ($parroquia_id) {
            return $query->where('parr.id', $parroquia_id);
        }
    }

    public function scopeActa(Builder $query, $acta_id)
    {
        if ($acta_id) {
            return $query->where('ac.acta_id', $acta_id);
        }
    }

    function scopeActivo(Builder $query, $activo)
    {
        if ($activo) {
            return $query->where('c.activo', $activo);
        }
    }
}
