<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\Junta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JuntaController extends Controller
{

    function getInfoJunta(Request $request): JsonResponse
    {
        $infoJunta = Junta::from('juntas as j')
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
            ->where('j.id', $request->junta_id)
            ->first();

        return response()->json(['status' => HTTPStatus::Success, 'infoJunta' => $infoJunta], 200);
    }

    function getTotalJuntas(Request $request): JsonResponse
    {
        $totalJuntas = Junta::from('juntas as j')
            ->selectRaw('COUNT(*) as total')
            ->join('zonas as z', 'z.id', 'j.zona_id')
            ->join('parroquias as p', 'p.id', 'z.parroquia_id')
            ->join('cantones as c', 'c.id', 'p.canton_id')
            ->join('provincias as prov', 'prov.id', 'c.provincia_id')
            ->provincia($request->provincia_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->first();

        return response()->json([
            'status' => HTTPStatus::Success,
            'totalJuntas' => $totalJuntas
        ], 200);
    }
}
