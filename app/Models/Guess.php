<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guess extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombres_completos',
        'telefono',
        'codigo',
        'activo'
    ];
}
