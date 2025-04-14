<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Acta extends Model
{
    use HasFactory;

    protected $fillable = [
        'provincia_id',
        'canton_id',
        'parroquia_id',
        'zona_id',
        'junta_id',
        'dignidad_id',
        'cod_cne',
        'votos_validos',
        'votos_blancos',
        'votos_nulos',
        'cuadrada',
        'legible',
        'user_add',
        'user_update',
        'estado'
    ];

    protected $attributes = [
        'votos_blancos' => 0,
        'votos_nulos' => 0
    ];

    public static function create(array $attributes = [])
    {

        $attributes['user_add'] = auth()->id();

        $acta = static::query()->create($attributes);

        return $acta;
    }

    public function parroquia()
    {
        return $this->belongsTo(Parroquia::class);
    }

    public function canton()
    {
        return $this->belongsTo(Canton::class);
    }

    function votos(): HasMany
    {
        return $this->hasMany(ActaCandidato::class, 'acta_id', 'id')
            ->join('candidatos as c', 'c.id', 'acta_candidato.candidato_id');
    }

    public function candidatos(): BelongsToMany
    {
        return $this->belongsToMany(Candidato::class)->withPivot('num_votos');
    }

    public function candidatoses(): BelongsToMany
    {
        return $this->belongsToMany(Candidato::class, 'acta_candidato', 'acta_id', 'candidato_id')
            ->withPivot('num_votos');
    }

    public function dignidad(): BelongsTo
    {
        return $this->belongsTo(Dignidad::class, 'dignidad_id');
    }

    function scopeDignidad($query, $dignidad_id)
    {
        if ($dignidad_id) {
            return $query->where('a.dignidad_id', $dignidad_id);
        }
    }

    function scopeProvincia($query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('a.provincia_id', $provincia_id);
        }
    }

    function scopeCanton($query, $canton_id)
    {
        if ($canton_id) {
            return $query->where('a.canton_id', $canton_id);
        }
    }

    function scopeParroquia($query, $parroquia_id)
    {
        if ($parroquia_id) {
            return $query->where('a.parroquia_id', $parroquia_id);
        }
    }

    function scopeZona($query, $zona_id)
    {
        if ($zona_id) {
            return $query->where('a.zona_id', $zona_id);
        }
    }

    function scopeCuadrada($query, $tipo_acta)
    {
        if (!is_null($tipo_acta) && $tipo_acta !== '') {
            return $query->where('a.cuadrada', $tipo_acta);
        }
    }

    function scopeLegible($query, $legible)
    {
        if (!is_null($legible) && $legible !== '') {
            return $query->where('a.legible', $legible);
        }
    }


}
