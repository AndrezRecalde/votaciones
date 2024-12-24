<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\Acta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class EscrutinioController extends Controller
{
    function getAvanceEscrutinio(): JsonResponse
    {
        $escrutinios = DB::select('CALL getAvanceEscrutinio()');

        return response()->json([
            'status' => HTTPStatus::Success,
            'escrutinios' => $escrutinios
        ], 200);
    }

    function getEscrutinioPorDignidad(): JsonResponse
    {
        $total = Acta::from('actas as a')
            ->selectRaw('COUNT(a.id) as total_ingresadas, d.nombre_dignidad,
                        CONCAT(ROUND((COUNT(a.id) / 1402 * 100), 2)) as porcentaje')
            ->rightJoin('dignidades as d', 'd.id', 'a.dignidad_id')
            ->where('d.activo', 1)
            ->groupBy('a.dignidad_id', 'd.nombre_dignidad')
            ->get();

        return response()->json(['status' => HTTPStatus::Success, 'total' => $total], 200);
    }
}
