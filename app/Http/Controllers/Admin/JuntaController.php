<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\ActaConsulta;
use App\Models\Junta;
use App\Models\PreguntaConsulta;
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
     * Buscar por junta (flujo digitador)
     */
    public function buscarPorJunta(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'junta_id' => 'required|integer|exists:juntas,id',
                'pregunta_id' => 'required|integer|exists:preguntas_consulta,id',
            ]);

            $juntaId = (int) $request->junta_id;
            $preguntaId = (int) $request->pregunta_id;

            // Buscar acta existente para la combinación junta + pregunta
            $acta = ActaConsulta::with([
                'pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta.recinto', // <-- cargar recinto
            ])
                ->where('junta_id', $juntaId)
                ->where('pregunta_id', $preguntaId)
                ->activas()
                ->first();

            // Construir ubicación con nombres SIEMPRE (incluyendo recinto)
            if ($acta) {
                $ubicacion = [
                    'provincia_id' => $acta->provincia_id,
                    'canton_id'    => $acta->canton_id,
                    'parroquia_id' => $acta->parroquia_id,
                    'zona_id'      => $acta->zona_id,
                    'junta_id'     => $juntaId,
                    'recinto_id'   => $acta->junta->recinto_id ?? null, // <-- id de recinto
                    'nombres'      => [
                        'provincia' => $acta->provincia->nombre_provincia ?? null,
                        'canton'    => $acta->canton->nombre_canton ?? null,
                        'parroquia' => $acta->parroquia->nombre_parroquia ?? null,
                        'zona'      => $acta->zona->nombre_zona ?? null,
                        'junta'     => $acta->junta->junta_nombre ?? null,
                        'recinto'   => optional($acta->junta->recinto)->nombre_recinto, // <-- nombre de recinto
                    ],
                ];
            } else {
                // Cuando no hay acta aún, obtener nombres por JOIN usando la junta (incluyendo recinto)
                $u = DB::table('juntas as j')
                    ->select(
                        'j.id as junta_id',
                        'z.id as zona_id',
                        'p.id as parroquia_id',
                        'c.id as canton_id',
                        'pr.id as provincia_id',
                        'j.recinto_id',
                        'j.junta_nombre',
                        'z.nombre_zona',
                        'p.nombre_parroquia',
                        'c.nombre_canton',
                        'pr.nombre_provincia',
                        'r.nombre_recinto'
                    )
                    ->join('zonas as z', 'j.zona_id', '=', 'z.id')
                    ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                    ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                    ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
                    ->leftJoin('recintos as r', 'j.recinto_id', '=', 'r.id') // <-- incluir recinto
                    ->where('j.id', $juntaId)
                    ->first();

                if (!$u) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se encontró información de ubicación para la junta',
                    ], 404);
                }

                $ubicacion = [
                    'provincia_id' => $u->provincia_id,
                    'canton_id'    => $u->canton_id,
                    'parroquia_id' => $u->parroquia_id,
                    'zona_id'      => $u->zona_id,
                    'junta_id'     => $juntaId,
                    'recinto_id'   => $u->recinto_id, // <-- id de recinto
                    'nombres'      => [
                        'provincia' => $u->nombre_provincia,
                        'canton'    => $u->nombre_canton,
                        'parroquia' => $u->nombre_parroquia,
                        'zona'      => $u->nombre_zona,
                        'junta'     => $u->junta_nombre,
                        'recinto'   => $u->nombre_recinto, // <-- nombre de recinto
                    ],
                ];
            }

            // Metadatos de la pregunta solicitada
            $metaPregunta = PreguntaConsulta::select('id', 'numero_pregunta', 'texto_pregunta')
                ->find($preguntaId);

            // Objeto único "pregunta"
            $pregunta = [
                'id'              => $acta->id ?? null, // id del registro de acta si existe
                'pregunta_id'     => $preguntaId,
                'numero_pregunta' => $metaPregunta->numero_pregunta ?? null,
                'texto_pregunta'  => $metaPregunta->texto_pregunta ?? null,

                // Campos por-pregunta (si no existe acta, van en null)
                'cod_cne'         => $acta->cod_cne ?? null,
                'votos_si'        => $acta->votos_si ?? null,
                'votos_no'        => $acta->votos_no ?? null,
                'votos_blancos'   => $acta->votos_blancos ?? null,
                'votos_nulos'     => $acta->votos_nulos ?? null,
                'votos_validos'   => $acta->votos_validos ?? null,
                'porcentaje_si'   => $acta?->porcentaje_si ?? null,
                'porcentaje_no'   => $acta?->porcentaje_no ?? null,
                'cuadrada'        => isset($acta) ? (bool) $acta->cuadrada : null,
                'legible'         => isset($acta) ? (bool) $acta->legible : null,
                'estado'          => isset($acta) ? (bool) $acta->estado : null,
            ];

            return response()->json([
                'success'     => true,
                'existe_acta' => (bool) $acta,
                'ubicacion'   => $ubicacion,
                'pregunta'    => $pregunta,
                'mensaje'     => $acta
                    ? 'Se encontró acta para esta junta y pregunta.'
                    : 'No existe acta para esta junta y pregunta. Puede crearla.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar el acta por junta y pregunta',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
