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
        'pregunta_id',
        'cod_cne',
        'votos_si',
        'votos_no',
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
        'pregunta_id'    => 'integer',
        'votos_si'       => 'integer',
        'votos_no'       => 'integer',
        'votos_validos'  => 'integer',
        'votos_blancos'  => 'integer',
        'votos_nulos'    => 'integer',
        'cuadrada'       => 'boolean',
        'legible'        => 'boolean',
        'estado'         => 'boolean',
        'user_add'       => 'integer',
        'user_update'    => 'integer',
    ];

    // Para que se incluyan automáticamente en JSON/array
    protected $appends = [
        'total_votos',
        'porcentaje_si',
        'porcentaje_no',
    ];

    // Relaciones
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

    public function pregunta()
    {
        return $this->belongsTo(PreguntaConsulta::class, 'pregunta_id');
    }

    public function userAdd()
    {
        return $this->belongsTo(User::class, 'user_add');
    }

    public function userUpdate()
    {
        return $this->belongsTo(User::class, 'user_update');
    }

    // Atributos calculados (solo de lectura)
    public function getTotalVotosAttribute(): int
    {
        return (int) ($this->votos_validos + $this->votos_blancos + $this->votos_nulos);
    }

    public function getPorcentajeSiAttribute(): float
    {
        $validos = (int) $this->votos_validos;
        if ($validos <= 0) {
            return 0.0;
        }
        return round(($this->votos_si / $validos) * 100, 2);
    }

    public function getPorcentajeNoAttribute(): float
    {
        $validos = (int) $this->votos_validos;
        if ($validos <= 0) {
            return 0.0;
        }
        return round(($this->votos_no / $validos) * 100, 2);
    }

    // Scopes útiles
    public function scopeActivas($query)
    {
        return $query->where('estado', true);
    }

    public function scopePorPregunta($query, int $preguntaId)
    {
        return $query->where('pregunta_id', $preguntaId);
    }

    public function scopePorProvincia($query, int $provinciaId)
    {
        return $query->where('provincia_id', $provinciaId);
    }
}
