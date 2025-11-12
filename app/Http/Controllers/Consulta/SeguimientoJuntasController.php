<?php

namespace App\Http\Controllers\Consulta;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeguimientoJuntasController extends Controller
{
    function getSeguimientoJuntasConsulta(Request $request): JsonResponse
    {
        $zonaId = $request->input('zona_id');
        $preguntaId = $request->input('pregunta_id');

        $tendenciasConsulta = DB::table('juntas')
            ->leftJoin('recintos', 'juntas.recinto_id', '=', 'recintos.id')
            ->crossJoin('preguntas_consulta')
            ->leftJoin('actas_consulta', function ($join) {
                $join->on('juntas.id', '=', 'actas_consulta.junta_id');
            })
            ->leftJoin('acta_consulta_preguntas', function ($join) {
                $join->on('actas_consulta.id', '=', 'acta_consulta_preguntas.acta_consulta_id')
                    ->on('acta_consulta_preguntas.pregunta_id', '=', 'preguntas_consulta.id');
            })
            ->select(
                'juntas.junta_nombre',
                'recintos.nombre_recinto',
                'preguntas_consulta.casillero_pregunta',
                'preguntas_consulta.texto_pregunta',
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_si), 0) as votos_si'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_no), 0) as votos_no'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_blancos), 0) as votos_blancos'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_nulos), 0) as votos_nulos'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_si + acta_consulta_preguntas.votos_no), 0) as total_votos')
            )
            ->where('juntas.zona_id', $zonaId)
            ->where('preguntas_consulta.activo', 1)
            ->when($preguntaId, function ($query) use ($preguntaId) {
                return $query->where('preguntas_consulta.id', $preguntaId);
            })
            ->groupBy(
                'juntas.id',
                'juntas.junta_nombre',
                'recintos.nombre_recinto',
                'preguntas_consulta.id',
                'preguntas_consulta.casillero_pregunta',
                'preguntas_consulta.texto_pregunta'
            )
            ->orderBy('juntas.num_junta', 'asc')
            ->orderByRaw('COALESCE(SUM(acta_consulta_preguntas.votos_si + acta_consulta_preguntas.votos_no), 0) DESC')
            ->get()
            ->map(function ($item) {
                $item->votos_si = (int) $item->votos_si;
                $item->votos_no = (int) $item->votos_no;
                $item->votos_blancos = (int) $item->votos_blancos;
                $item->votos_nulos = (int) $item->votos_nulos;
                $item->total_votos = (int) $item->total_votos;
                return $item;
            });

        return response()->json(['status' => HTTPStatus::Success, 'tendenciasConsulta' => $tendenciasConsulta], 200);
    }
}
