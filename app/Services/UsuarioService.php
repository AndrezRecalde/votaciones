<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class UsuarioService
{
    /**
     * Reemplaza el procedimiento almacenado sp_contar_actas
     */
    public function contarActasPorUsuario(int $userId)
    {
        return DB::table('actas')
            ->selectRaw('
                SUM(CASE WHEN user_add = ? THEN 1 ELSE 0 END) AS total_ingresadas_add,
                SUM(CASE WHEN user_update = ? THEN 1 ELSE 0 END) AS total_ingresadas_update
            ', [$userId, $userId])
            ->first();
    }
}
