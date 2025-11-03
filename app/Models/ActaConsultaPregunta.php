<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActaConsultaPregunta extends Model
{
    use HasFactory;

    protected $table = 'acta_consulta_preguntas';

    protected $fillable = [
        'acta_consulta_id',
        'pregunta_id',
        'votos_si',
        'votos_no',
    ];

    protected $casts = [
        'votos_si' => 'integer',
        'votos_no' => 'integer',
    ];

    // Para que se incluyan automáticamente en JSON/array
    protected $appends = [
        'total_votos',
        'porcentaje_si',
        'porcentaje_no',
    ];

    // Relación con ActaConsulta
    public function actaConsulta()
    {
        return $this->belongsTo(ActaConsulta::class, 'acta_consulta_id');
    }

    // Relación con Pregunta
    public function pregunta()
    {
        return $this->belongsTo(PreguntaConsulta::class, 'pregunta_id');
    }

    // Accessor para total de votos
    // Accessor para total de votos
    public function getTotalVotosAttribute(): int
    {
        return $this->votos_si + $this->votos_no;
    }

    // Accessor para porcentaje de votos SÍ (basado en votos_validos del acta)
    public function getPorcentajeSiAttribute(): float
    {
        // Cargar la relación si no está cargada para evitar N+1
        if (!$this->relationLoaded('actaConsulta')) {
            $this->load('actaConsulta');
        }

        $validos = (int) $this->actaConsulta?->votos_validos;

        if ($validos <= 0) {
            return 0.0;
        }

        return round(($this->votos_si / $validos) * 100, 2);
    }

    // Accessor para porcentaje de votos NO (basado en votos_validos del acta)
    public function getPorcentajeNoAttribute(): float
    {
        // Cargar la relación si no está cargada para evitar N+1
        if (!$this->relationLoaded('actaConsulta')) {
            $this->load('actaConsulta');
        }

        $validos = (int) $this->actaConsulta?->votos_validos;

        if ($validos <= 0) {
            return 0.0;
        }

        return round(($this->votos_no / $validos) * 100, 2);
    }
}
