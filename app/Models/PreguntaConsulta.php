<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreguntaConsulta extends Model
{
    use HasFactory;

    protected $table = 'preguntas_consulta';

    protected $fillable = [
        'numero_pregunta',
        'texto_pregunta',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'numero_pregunta' => 'integer',
        //'activo' => 'boolean',
    ];

    // Relación con actas de consulta
    public function actasConsulta()
    {
        return $this->hasMany(ActaConsulta::class, 'pregunta_id');
    }

    // Scopes útiles
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    // Scope para ordenar por número de pregunta
    public function scopeOrdenadoPorNumero($query)
    {
        return $query->orderBy('numero_pregunta', 'asc');
    }
}
