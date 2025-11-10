<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PreguntaConsulta extends Model
{
    use HasFactory;

    protected $table = 'preguntas_consulta';

    protected $fillable = [
        'casillero_pregunta',
        'texto_pregunta',
        'descripcion',
        'activo',
    ];


    /**
     * Relación: una pregunta aparece en muchas filas de acta_consulta_preguntas.
     */
    public function actasPreguntas(): HasMany
    {
        return $this->hasMany(ActaConsultaPregunta::class, 'pregunta_id');
    }

    /**
     * Scope: solo preguntas activas.
     */
    public function scopeActivas(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: filtrar por casillero (número o letra).
     */
    public function scopePorCasillero(Builder $query, string $casillero): Builder
    {
        return $query->where('casillero_pregunta', $casillero);
    }

    /**
     * Scope: búsqueda rápida en texto o descripción.
     */
    public function scopeBuscar(Builder $query, ?string $term): Builder
    {
        if (!$term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $like = '%' . trim($term) . '%';
            $q->where('casillero_pregunta', 'LIKE', $like)
                ->orWhere('texto_pregunta', 'LIKE', $like)
                ->orWhere('descripcion', 'LIKE', $like);
        });
    }

    /**
     * Accessor resumido del texto (útil para listados).
     */
    public function getTextoResumenAttribute(): string
    {
        $texto = strip_tags($this->texto_pregunta);
        return mb_strlen($texto) > 120
            ? mb_substr($texto, 0, 117) . '...'
            : $texto;
    }

    protected $appends = [
        'texto_resumen',
    ];
}
