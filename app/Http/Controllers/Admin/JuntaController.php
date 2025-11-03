<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\ActaConsulta;
use App\Models\Junta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

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

    /* === CONSULTA POPULAR === */
    /**
     * Buscar acta de consulta por junta
     * Retorna el acta si existe, o null si no existe
     */
    public function buscarPorJunta(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'junta_id' => 'required|integer|exists:juntas,id',
            ]);

            // Buscar si ya existe un acta para esta junta
            $acta = ActaConsulta::with([
                'actaConsultaPreguntas.pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta.recinto'
            ])
                ->where('junta_id', $request->junta_id)
                ->where('estado', true)
                ->first();

            if ($acta) {
                return response()->json([
                    'success' => HTTPStatus::Success,
                    'existe_acta' => true,
                    'acta' => $acta,
                    'mensaje' => 'Ya existe un acta registrada para esta junta. Puede editarla.'
                ], 200);
            }

            // Si no existe acta, obtener información de la junta
            $junta = DB::table('juntas as j')
                ->select(
                    'j.id as junta_id',
                    'j.num_junta',
                    'j.genero',
                    'j.junta_nombre',
                    'j.num_electores_cne',
                    'j.cne_cod_junta',
                    'z.id as zona_id',
                    'z.nombre_zona',
                    'p.id as parroquia_id',
                    'p.nombre_parroquia',
                    'p.tipo as tipo_parroquia',
                    'c.id as canton_id',
                    'c.nombre_canton',
                    'pr.id as provincia_id',
                    'pr.nombre_provincia',
                    'pr.cod_cne_prov',
                    'r.nombre_recinto',
                    'r.direccion_recinto'
                )
                ->join('zonas as z', 'j.zona_id', '=', 'z.id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
                ->leftJoin('recintos as r', 'j.recinto_id', '=', 'r.id')
                ->where('j.id', $request->junta_id)
                ->first();

            if (!$junta) {
                return response()->json([
                    'success' => HTTPStatus::Error,
                    'message' => 'Junta no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => HTTPStatus::Success,
                'existe_acta' => false,
                'junta' => $junta,
                'mensaje' => 'No existe acta para esta junta. Puede crear una nueva.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el acta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
