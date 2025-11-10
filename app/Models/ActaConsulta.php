<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActaConsulta extends Model
{
    use HasFactory;

    protected $table = 'actas_consulta';

    protected $fillable = [
        'provincia_id',
        'canton_id',
        'parroquia_id',
        'zona_id',
        'junta_id',
        'cod_cne',
        'votos_validos',
        'cuadrada',
        'legible',
        'estado',
        'user_add',
        'user_update',
    ];

    protected $casts = [
        'votos_validos' => 'integer',
        'cuadrada'      => 'boolean',
        'legible'       => 'boolean',
        'estado'        => 'boolean',
    ];

    // Relaciones geográficas
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class, 'provincia_id');
    }

    public function canton(): BelongsTo
    {
        return $this->belongsTo(Canton::class, 'canton_id');
    }

    public function parroquia(): BelongsTo
    {
        return $this->belongsTo(Parroquia::class, 'parroquia_id');
    }

    public function zona(): BelongsTo
    {
        return $this->belongsTo(Zona::class, 'zona_id');
    }

    public function junta(): BelongsTo
    {
        return $this->belongsTo(Junta::class, 'junta_id');
    }

    public function preguntas(): HasMany
    {
        return $this->hasMany(ActaConsultaPregunta::class, 'acta_consulta_id');
    }

    // Auditoría
    public function userAdd(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_add');
    }

    public function userUpdate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_update');
    }

    // Scopes
    public function scopeActivas(Builder $query): Builder
    {
        return $query->where('estado', true);
    }

    public function scopeCuadrada(Builder $query): Builder
    {
        return $query->where('cuadrada', true);
    }

    public function scopeLegible(Builder $query): Builder
    {
        return $query->where('legible', true);
    }

    public function scopePorProvincia(Builder $query, int $provinciaId): Builder
    {
        return $query->where('provincia_id', $provinciaId);
    }

    public function scopePorCanton(Builder $query, int $cantonId): Builder
    {
        return $query->where('canton_id', $cantonId);
    }

    public function scopePorParroquia(Builder $query, int $parroquiaId): Builder
    {
        return $query->where('parroquia_id', $parroquiaId);
    }

    public function scopePorZona(Builder $query, int $zonaId): Builder
    {
        return $query->where('zona_id', $zonaId);
    }
}
