<?php

namespace App\Services;

use App\Models\Junta;

class JuntaService
{
    public function obtenerInfoJunta(int $juntaId)
    {
        return Junta::from('juntas as j')
            ->selectRaw('j.id, j.junta_nombre as junta, z.nombre_zona as zona,
                            prov.nombre_provincia as provincia, c.nombre_canton as canton,
                            p.nombre_parroquia as parroquia,
                            r.nombre_recinto as recinto,
                            a.id as acta_id')
            ->join('zonas as z', 'z.id', 'j.zona_id')
            ->join('recintos as r', 'r.id', 'j.recinto_id')
            ->join('parroquias as p', 'p.id', 'r.parroquia_id')
            ->join('cantones as c', 'c.id', 'p.canton_id')
            ->join('provincias as prov', 'prov.id', 'c.provincia_id')
            ->leftJoin('actas as a', 'a.junta_id', 'j.id')
            ->where('j.id', $juntaId)
            ->first();
    }

    public function obtenerTotalJuntas(?int $provinciaId, ?int $cantonId, ?int $parroquiaId)
    {
        return Junta::from('juntas as j')
            ->selectRaw('COUNT(*) as total')
            ->join('zonas as z', 'z.id', 'j.zona_id')
            ->join('parroquias as p', 'p.id', 'z.parroquia_id')
            ->join('cantones as c', 'c.id', 'p.canton_id')
            ->join('provincias as prov', 'prov.id', 'c.provincia_id')
            ->when($provinciaId, function($q) use ($provinciaId) {
                $q->provincia($provinciaId);
            })
            ->when($cantonId, function($q) use ($cantonId) {
                $q->canton($cantonId);
            })
            ->when($parroquiaId, function($q) use ($parroquiaId) {
                $q->parroquia($parroquiaId);
            })
            ->first();
    }

    public function obtenerReporteCompletoProvincia(int $provinciaId)
    {
        return Junta::getReporteCompletoProvincia($provinciaId);
    }
}
