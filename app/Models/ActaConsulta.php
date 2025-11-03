<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'votos_blancos',
        'votos_nulos',
        'cuadrada',
        'legible',
        'user_add',
        'user_update',
        'estado',
    ];

    protected $casts = [
        'provincia_id'   => 'integer',
        'canton_id'      => 'integer',
        'parroquia_id'   => 'integer',
        'zona_id'        => 'integer',
        'junta_id'       => 'integer',
        'votos_validos'  => 'integer',
        'votos_blancos'  => 'integer',
        'votos_nulos'    => 'integer',
        'cuadrada'       => 'boolean',
        'legible'        => 'boolean',
        'estado'         => 'boolean',
        'user_add'       => 'integer',
        'user_update'    => 'integer',
    ];


    public function preguntas()
    {
        return $this->belongsToMany(PreguntaConsulta::class, 'acta_consulta_preguntas', 'acta_consulta_id', 'pregunta_id')
            ->withPivot('votos_si', 'votos_no')
            ->withTimestamps();
    }

    public function actaConsultaPreguntas()
    {
        return $this->hasMany(ActaConsultaPregunta::class, 'acta_consulta_id');
    }

    public function provincia()
    {
        return $this->belongsTo(Provincia::class);
    }

    public function canton()
    {
        return $this->belongsTo(Canton::class);
    }

    public function parroquia()
    {
        return $this->belongsTo(Parroquia::class);
    }

    public function zona()
    {
        return $this->belongsTo(Zona::class);
    }

    public function junta()
    {
        return $this->belongsTo(Junta::class);
    }

    public function userAdd()
    {
        return $this->belongsTo(User::class, 'user_add');
    }

    public function userUpdate()
    {
        return $this->belongsTo(User::class, 'user_update');
    }

    /**
     * Obtener resumen de votos por pregunta con porcentajes
     */
    public function getResumenVotosPorPregunta()
    {
        return $this->actaConsultaPreguntas()
            ->with('pregunta')
            ->get()
            ->map(function ($actaPregunta) {
                return [
                    'pregunta_id' => $actaPregunta->pregunta_id,
                    'numero_pregunta' => $actaPregunta->pregunta->numero_pregunta ?? null,
                    'texto_pregunta' => $actaPregunta->pregunta->texto_pregunta ?? null,
                    'votos_si' => $actaPregunta->votos_si,
                    'votos_no' => $actaPregunta->votos_no,
                    'total_votos' => $actaPregunta->total_votos,
                    'porcentaje_si' => $actaPregunta->porcentaje_si,
                    'porcentaje_no' => $actaPregunta->porcentaje_no,
                ];
            });
    }

    /**
     * Obtener el total de votos emitidos (válidos + blancos + nulos)
     */
    public function getTotalVotosEmitidosAttribute(): int
    {
        return $this->votos_validos + $this->votos_blancos + $this->votos_nulos;
    }

    // ========================================
    // SCOPES
    // ========================================

    public function scopeActivas($query)
    {
        return $query->where('estado', true);
    }

    public function scopePorProvincia($query, int $provinciaId)
    {
        return $query->where('provincia_id', $provinciaId);
    }

    public function scopePorCanton($query, int $cantonId)
    {
        return $query->where('canton_id', $cantonId);
    }

    public function scopePorParroquia($query, int $parroquiaId)
    {
        return $query->where('parroquia_id', $parroquiaId);
    }

    public function scopePorZona($query, int $zonaId)
    {
        return $query->where('zona_id', $zonaId);
    }

    public function scopeCuadrada($query)
    {
        return $query->where('cuadrada', true);
    }

    public function scopeLegible($query)
    {
        return $query->where('legible', true);
    }
}
