<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Organizacion extends Model
{
    use HasFactory;

    protected $table = 'organizaciones';

    protected $fillable = [
        'nombre_organizacion',
        'numero_organizacion',
        'sigla',
        'color',
        'logo_url'
    ];

    public function aliados()
    {
        return $this->belongsToMany(
            Organizacion::class,
            'alianzas',
            'organizacion_id',
            'aliado_id'
        )->withTimestamps();
    }

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($organizacion) {
            $organizacion->aliados()->detach();
        });
    }
}
