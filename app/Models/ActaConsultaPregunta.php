<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActaConsultaPregunta extends Model
{
    use HasFactory;

    protected $table = 'acta_consulta_preguntas';

    protected $fillable = [
        'acta_consulta_id',
        'pregunta_id',
        'votos_blancos',
        'votos_nulos',
        'votos_si',
        'votos_no',
    ];

    protected $casts = [
        'acta_consulta_id' => 'integer',
        'pregunta_id'      => 'integer',
        'votos_blancos'    => 'integer',
        'votos_nulos'      => 'integer',
        'votos_si'         => 'integer',
        'votos_no'         => 'integer',
    ];

    // Si quieres que se serialicen automáticamente en JSON:
    protected $appends = ['porcentaje_si', 'porcentaje_no', 'total_votos'];

    // Relaciones
    public function actaConsulta(): BelongsTo
    {
        return $this->belongsTo(ActaConsulta::class, 'acta_consulta_id');
    }

    // Usa el nombre/clase real de tu modelo de pregunta (PreguntaConsulta si aplica)
    public function pregunta(): BelongsTo
    {
        return $this->belongsTo(PreguntaConsulta::class, 'pregunta_id');
    }

    // Total de votos de la pregunta (no se usa como denominador)
    public function getTotalVotosAttribute(): int
    {
        return (int) $this->votos_si + (int) $this->votos_no;
    }

    // Porcentaje SÍ sobre los votos_validos del acta (encabezado)
    public function getPorcentajeSiAttribute(): float
    {
        if (!$this->relationLoaded('actaConsulta')) {
            $this->load('actaConsulta');
        }
        $validos = (int) ($this->actaConsulta?->votos_validos ?? 0);
        return $validos > 0 ? round(($this->votos_si / $validos) * 100, 2) : 0.0;
    }

    // Porcentaje NO sobre los votos_validos del acta (encabezado)
    public function getPorcentajeNoAttribute(): float
    {
        if (!$this->relationLoaded('actaConsulta')) {
            $this->load('actaConsulta');
        }
        $validos = (int) ($this->actaConsulta?->votos_validos ?? 0);
        return $validos > 0 ? round(($this->votos_no / $validos) * 100, 2) : 0.0;
    }
}
