<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Distrito extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_distrito'
    ];

    public function candidatos(): BelongsToMany
    {
        return $this->belongsToMany(Candidato::class, 'candidato_distrito');
    }
}
