<?php

namespace App\Services;

use App\Models\Distrito;

class DistritoService
{
    public function obtenerDistritos()
    {
        return Distrito::get(['id', 'tipo_distrito']);
    }
}
