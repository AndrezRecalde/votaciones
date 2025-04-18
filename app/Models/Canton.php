<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Canton extends Model
{
    use HasFactory;

    protected $table = 'cantones';

    public function parroquias()
    {
        return $this->hasMany(Parroquia::class);
    }

    function actas() : HasMany {
        return $this->hasMany(Acta::class, 'canton_id');
    }
}
