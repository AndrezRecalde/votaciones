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
            ]);

            $juntaId = (int) $request->junta_id;

            // Intentar obtener el acta activa con sus relaciones
            $acta = ActaConsulta::with([
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta.recinto',
                'preguntas.pregunta',
                'userAdd',
                'userUpdate',
            ])
                ->where('junta_id', $juntaId)
                ->activas()
                ->first();

            // Ubicación (si existe acta tomamos de ella, caso contrario derivamos de la junta)
            if ($acta) {
                $ubicacion = [
                    'provincia_id' => $acta->provincia_id,
                    'canton_id'    => $acta->canton_id,
                    'parroquia_id' => $acta->parroquia_id,
                    'zona_id'      => $acta->zona_id,
                    'junta_id'     => $juntaId,
                    'recinto_id'   => $acta->junta->recinto_id ?? null,
                    'nombres'      => [
                        'provincia' => $acta->provincia->nombre_provincia ?? null,
                        'canton'    => $acta->canton->nombre_canton ?? null,
                        'parroquia' => $acta->parroquia->nombre_parroquia ?? null,
                        'zona'      => $acta->zona->nombre_zona ?? null,
                        'junta'     => $acta->junta->junta_nombre ?? null,
                        'recinto'   => optional($acta->junta->recinto)->nombre_recinto,
                    ],
                ];
            } else {
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
                    ->leftJoin('recintos as r', 'j.recinto_id', '=', 'r.id')
                    ->where('j.id', $juntaId)
                    ->first();

                if (!$u) {
                    return response()->json([
                        'status' => HTTPStatus::Error,
                        'msg' => 'No se encontró información de ubicación para la junta',
                    ], 404);
                }

                $ubicacion = [
                    'provincia_id' => $u->provincia_id,
                    'canton_id'    => $u->canton_id,
                    'parroquia_id' => $u->parroquia_id,
                    'zona_id'      => $u->zona_id,
                    'junta_id'     => $juntaId,
                    'recinto_id'   => $u->recinto_id,
                    'nombres'      => [
                        'provincia' => $u->nombre_provincia,
                        'canton'    => $u->nombre_canton,
                        'parroquia' => $u->nombre_parroquia,
                        'zona'      => $u->nombre_zona,
                        'junta'     => $u->junta_nombre,
                        'recinto'   => $u->nombre_recinto,
                    ],
                ];
            }

            // Catálogo completo de preguntas activas
            $catalogoPreguntas = PreguntaConsulta::select('id', 'casillero_pregunta', 'texto_pregunta')
                ->where('activo', true)
                ->orderBy('casillero_pregunta')
                ->get();

            // Indexar preguntas existentes del acta (si hay)
            $preguntasExistentes = [];
            if ($acta) {
                foreach ($acta->preguntas as $p) {
                    $preguntasExistentes[$p->pregunta_id] = $p;
                }
            }

            // Votos válidos global del acta (ahora solo está en encabezado)
            $votosValidosActa = $acta?->votos_validos;

            // Construir array final de preguntas
            $preguntas = $catalogoPreguntas->map(function ($row) use ($preguntasExistentes, $votosValidosActa) {
                /** @var \App\Models\ActaConsultaPregunta|null $reg */
                $reg = $preguntasExistentes[$row->id] ?? null;

                // Como ya no hay votos_validos en el detalle, se replica el valor global (o null)
                $validos = $votosValidosActa;

                return [
                    'acta_consulta_pregunta_id' => $reg->id ?? null,
                    'pregunta_id'     => $row->id,
                    'casillero_pregunta' => $row->casillero_pregunta,
                    'texto_pregunta'  => $row->texto_pregunta,
                    'votos_si'        => $reg?->votos_si ?? null,
                    'votos_no'        => $reg?->votos_no ?? null,
                    'votos_blancos'   => $reg?->votos_blancos ?? null,
                    'votos_nulos'     => $reg?->votos_nulos ?? null,
                    'votos_validos'   => $validos ?? null,
                    'porcentaje_si'   => ($validos && $validos > 0 && $reg) ? round(($reg->votos_si / $validos) * 100, 2) : null,
                    'porcentaje_no'   => ($validos && $validos > 0 && $reg) ? round(($reg->votos_no / $validos) * 100, 2) : null,
                ];
            });

            // Agrupar la información del acta en info_acta (solicitado)
            $infoActa = [
                'existe_acta'   => (bool) $acta,
                'acta_id'       => $acta->id ?? null,
                'cod_cne'       => $acta->cod_cne ?? null,
                'votos_validos' => $acta?->votos_validos ?? null,
                'cuadrada'      => $acta?->cuadrada ?? null,
                'legible'       => $acta?->legible ?? null,
                'estado'        => $acta?->estado ?? null,
                'user_add'      => $acta?->userAdd->nombres_completos ?? null,
                'user_update'   => $acta?->userUpdate->nombres_completos ?? null,
            ];

            return response()->json([
                'status'     => HTTPStatus::Success,
                'info_acta'  => $infoActa,
                'ubicacion'  => $ubicacion,
                'preguntas'  => $preguntas,
                'msg'        => $acta
                    ? 'Se encontró acta para la junta y se listan sus preguntas (con o sin votos).'
                    : 'No existe acta para esta junta. Todas las preguntas aparecen sin votos.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $e->getMessage(),
            ], 500);
        }
    }
}
