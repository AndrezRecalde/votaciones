<?php

namespace App\Services;

use App\Models\Dignidad;
use Illuminate\Support\Facades\DB;
use Exception;

class DignidadService
{
    public function obtenerDignidades(?int $activo, ?string $tipo)
    {
        return Dignidad::from('dignidades as dig')
            ->selectRaw('dig.id, dig.nombre_dignidad, dig.tipo_dignidad, dig.activo')
            ->activo($activo)
            ->tipo($tipo)
            ->get();
    }

    public function actualizarEstado(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $dignidad = Dignidad::find($id);
            if (!$dignidad) {
                throw new Exception('Dignidad no encontrada', 404);
            }
            $dignidad->update($data);
            return $dignidad;
        });
    }
}
