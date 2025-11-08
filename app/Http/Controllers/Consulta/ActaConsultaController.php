<?php

namespace App\Http\Controllers\Consulta;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActaConsultaRequest;
use App\Http\Requests\UpdateActaConsultaRequest;
use App\Models\ActaConsulta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Auth;

class ActaConsultaController extends Controller
{
    /**
     * Listar actas (cada fila = junta + pregunta)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);

            $query = ActaConsulta::with([
                'pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta',
                'userAdd',
                'userUpdate'
            ])->activas();

            // Filtros opcionales
            if ($request->filled('provincia_id')) {
                $query->porProvincia((int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $query->porCanton((int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $query->porParroquia((int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $query->porZona((int) $request->zona_id);
            }
            if ($request->filled('junta_id')) {
                $query->where('junta_id', (int) $request->junta_id);
            }
            if ($request->filled('pregunta_id')) {
                $query->where('pregunta_id', (int) $request->pregunta_id);
            }

            $actas = $query->orderByDesc('created_at')->paginate($perPage);

            return response()->json([
                'status' => true,
                'actas' => $actas,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(StoreActaConsultaRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Verificar unicidad junta_id + pregunta_id
            $exists = ActaConsulta::where('junta_id', $request->junta_id)
                ->where('pregunta_id', $request->pregunta_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Ya existe un acta para esta junta y pregunta.',
                ], 422);
            }

            $payload = [
                // geografía
                'provincia_id'  => (int) $request->provincia_id,
                'canton_id'     => (int) $request->canton_id,
                'parroquia_id'  => (int) $request->parroquia_id,
                'zona_id'       => (int) $request->zona_id,
                'junta_id'      => (int) $request->junta_id,

                // pregunta + datos
                'pregunta_id'   => (int) $request->pregunta_id,
                'cod_cne'       => $request->cod_cne,
                'votos_si'      => (int) $request->votos_si,
                'votos_no'      => (int) $request->votos_no,
                'votos_validos' => (int) $request->votos_validos,
                'votos_blancos' => (int) $request->votos_blancos,
                'votos_nulos'   => (int) $request->votos_nulos,
                'cuadrada'      => (bool) $request->cuadrada,
                'legible'       => (bool) $request->legible,
                //'estado'        => (bool) $request->estado,
                'user_add'      => Auth::id(),
            ];

            $acta = ActaConsulta::create($payload)->load(['pregunta', 'junta']);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Acta creada exitosamente.',
                'data'    => $acta,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostrar un registro de acta (junta+pregunta) por ID
     */
    public function show(int $id): JsonResponse
    {
        try {
            $acta = ActaConsulta::with([
                'pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta',
                'userAdd',
                'userUpdate'
            ])->findOrFail($id);

            return response()->json([
                'status' => true,
                'data' => $acta,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => $e->getMessage(),
            ], 404);
        }
    }

    public function update(UpdateActaConsultaRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $acta = ActaConsulta::findOrFail($id);

            // Validar unicidad si cambian junta o pregunta
            $targetJuntaId = (int) $request->junta_id;
            $targetPreguntaId = (int) $request->pregunta_id;

            $exists = ActaConsulta::where('junta_id', $targetJuntaId)
                ->where('pregunta_id', $targetPreguntaId)
                ->where('id', '<>', $acta->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg' => 'Ya existe un acta para esa combinación de junta y pregunta.',
                ], 422);
            }

            $payload = [
                // geografía
                'provincia_id'  => (int) $request->provincia_id,
                'canton_id'     => (int) $request->canton_id,
                'parroquia_id'  => (int) $request->parroquia_id,
                'zona_id'       => (int) $request->zona_id,
                'junta_id'      => $targetJuntaId,

                // pregunta + datos
                'pregunta_id'   => $targetPreguntaId,
                'cod_cne'       => $request->cod_cne,
                'votos_si'      => (int) $request->votos_si,
                'votos_no'      => (int) $request->votos_no,
                'votos_validos' => (int) $request->votos_validos,
                'votos_blancos' => (int) $request->votos_blancos,
                'votos_nulos'   => (int) $request->votos_nulos,
                'cuadrada'      => (bool) $request->cuadrada,
                'legible'       => (bool) $request->legible,
                //'estado'        => (bool) $request->estado,
                'user_update'   => Auth::id(),
            ];

            $acta->update($payload);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Acta actualizada exitosamente.',
                'data'    => $acta->fresh(['pregunta', 'junta']),
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Soft delete de un registro (estado=false)
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $acta = ActaConsulta::findOrFail($id);
            $acta->delete();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Acta eliminada exitosamente',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resumen de votos por preguntas para una junta
     * - Si llega junta_id en query, se usa directamente
     * - Si no, se usa el id del acta para inferir la junta y agrupar todas sus preguntas
     */
    public function resumenVotos(Request $request, int $id): JsonResponse
    {
        try {
            if ($request->filled('junta_id')) {
                $juntaId = (int) $request->junta_id;
                $sample = ActaConsulta::where('junta_id', $juntaId)->firstOrFail();
            } else {
                $sample = ActaConsulta::findOrFail($id);
                $juntaId = $sample->junta_id;
            }

            $rows = ActaConsulta::with('pregunta')
                ->where('junta_id', $juntaId)
                ->activas()
                ->orderBy('pregunta_id')
                ->get();

            $resumen = $rows->map(function ($r) {
                return [
                    'pregunta_id'     => $r->pregunta_id,
                    'numero_pregunta' => $r->pregunta->numero_pregunta ?? null,
                    'texto_pregunta'  => $r->pregunta->texto_pregunta ?? null,
                    'votos_si'        => $r->votos_si,
                    'votos_no'        => $r->votos_no,
                    'votos_validos'   => $r->votos_validos,
                    'votos_blancos'   => $r->votos_blancos,
                    'votos_nulos'     => $r->votos_nulos,
                    'porcentaje_si'   => $r->porcentaje_si,
                    'porcentaje_no'   => $r->porcentaje_no,
                ];
            });

            // Totales de la junta (sumando por pregunta)
            $totales = [
                'validos' => $rows->sum('votos_validos'),
                'blancos' => $rows->sum('votos_blancos'),
                'nulos'   => $rows->sum('votos_nulos'),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'data' => [
                    'junta_id' => $juntaId,
                    'ubicacion' => [
                        'provincia_id' => $sample->provincia_id,
                        'canton_id'    => $sample->canton_id,
                        'parroquia_id' => $sample->parroquia_id,
                        'zona_id'      => $sample->zona_id,
                    ],
                    'totales' => $totales,
                    'resumen_preguntas' => $resumen,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Estadísticas generales y filtradas
     * - porcentaje_validos se calcula sobre totalNumElectores (suma de recintos.num_electores)
     * Para mostrarlo en la vista de Perfil de Consulta Popular
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'provincia_id' => 'nullable|integer|exists:provincias,id',
                'canton_id' => 'nullable|integer|exists:cantones,id',
                'parroquia_id' => 'nullable|integer|exists:parroquias,id',
                'zona_id' => 'nullable|integer|exists:zonas,id',
            ]);

            $query = ActaConsulta::query()->activas();

            if ($request->filled('provincia_id')) {
                $query->porProvincia((int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $query->porCanton((int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $query->porParroquia((int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $query->porZona((int) $request->zona_id);
            }

            // Totales de actas y juntas
            $totalActas = $query->count();
            $totalJuntasConActa = (clone $query)->distinct('junta_id')->count('junta_id');

            $actasCuadradas = (clone $query)->cuadrada()->count();
            $actasLegibles = (clone $query)->legible()->count();

            $totalVotosValidos = (int) $query->sum('votos_validos');
            $totalVotosBlancos = (int) $query->sum('votos_blancos');
            $totalVotosNulos   = (int) $query->sum('votos_nulos');

            // Denominador: total de electores (recintos.num_electores) según filtros
            $electoresQuery = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                ->join('cantones as c', 'c.id', '=', 'p.canton_id')
                ->join('provincias as pr', 'pr.id', '=', 'c.provincia_id');

            if ($request->filled('provincia_id')) {
                $electoresQuery->where('pr.id', (int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $electoresQuery->where('c.id', (int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $electoresQuery->where('p.id', (int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $electoresQuery->where('z.id', (int) $request->zona_id);
            }

            $totalNumElectores = (int) $electoresQuery->sum('r.num_electores');
            $porcentajeValidosSobreElectores = $totalNumElectores > 0
                ? round(($totalVotosValidos / $totalNumElectores) * 100, 2)
                : 0.0;

            // Desglose por provincia (si no se filtró por provincia)
            $porProvincia = [];
            if (!$request->filled('provincia_id')) {
                $porProvincia = ActaConsulta::select(
                    'provincias.id as provincia_id',
                    'provincias.nombre_provincia',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('COUNT(DISTINCT actas_consulta.junta_id) as total_juntas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('provincias', 'actas_consulta.provincia_id', '=', 'provincias.id')
                    //->where('actas_consulta.estado', true)
                    ->groupBy('provincias.id', 'provincias.nombre_provincia')
                    ->get();

                // Electores por provincia
                $electoresPorProvincia = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                    ->join('cantones as c', 'c.id', '=', 'p.canton_id')
                    ->join('provincias as pr', 'pr.id', '=', 'c.provincia_id')
                    ->select('pr.id as provincia_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                    ->groupBy('pr.id')
                    ->pluck('total_num_electores', 'provincia_id');

                $porProvincia = $porProvincia->map(function ($row) use ($electoresPorProvincia) {
                    $den = (int) ($electoresPorProvincia[$row->provincia_id] ?? 0);
                    $row->total_num_electores = $den;
                    $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                    return $row;
                });
            }

            // Desglose por cantón (si se filtró por provincia pero no por cantón)
            $porCanton = [];
            if ($request->filled('provincia_id') && !$request->filled('canton_id')) {
                $porCanton = ActaConsulta::select(
                    'cantones.id as canton_id',
                    'cantones.nombre_canton',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('COUNT(DISTINCT actas_consulta.junta_id) as total_juntas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('cantones', 'actas_consulta.canton_id', '=', 'cantones.id')
                    //->where('actas_consulta.estado', true)
                    ->where('actas_consulta.provincia_id', $request->provincia_id)
                    ->groupBy('cantones.id', 'cantones.nombre_canton')
                    ->get();

                $electoresPorCanton = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                    ->join('cantones as c', 'c.id', '=', 'p.canton_id')
                    ->select('c.id as canton_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                    ->where('c.provincia_id', (int) $request->provincia_id)
                    ->groupBy('c.id')
                    ->pluck('total_num_electores', 'canton_id');

                $porCanton = $porCanton->map(function ($row) use ($electoresPorCanton) {
                    $den = (int) ($electoresPorCanton[$row->canton_id] ?? 0);
                    $row->total_num_electores = $den;
                    $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                    return $row;
                });
            }

            // Desglose por parroquia (si se filtró por cantón pero no por parroquia)
            $porParroquia = [];
            if ($request->filled('canton_id') && !$request->filled('parroquia_id')) {
                $porParroquia = ActaConsulta::select(
                    'parroquias.id as parroquia_id',
                    'parroquias.nombre_parroquia',
                    'parroquias.tipo',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('COUNT(DISTINCT actas_consulta.junta_id) as total_juntas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('parroquias', 'actas_consulta.parroquia_id', '=', 'parroquias.id')
                    //->where('actas_consulta.estado', true)
                    ->where('actas_consulta.canton_id', $request->canton_id)
                    ->groupBy('parroquias.id', 'parroquias.nombre_parroquia', 'parroquias.tipo')
                    ->get();

                $electoresPorParroquia = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                    ->select('p.id as parroquia_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                    ->where('p.canton_id', (int) $request->canton_id)
                    ->groupBy('p.id')
                    ->pluck('total_num_electores', 'parroquia_id');

                $porParroquia = $porParroquia->map(function ($row) use ($electoresPorParroquia) {
                    $den = (int) ($electoresPorParroquia[$row->parroquia_id] ?? 0);
                    $row->total_num_electores = $den;
                    $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                    return $row;
                });
            }

            // Desglose por zona (si se filtró por parroquia pero no por zona)
            $porZona = [];
            if ($request->filled('parroquia_id') && !$request->filled('zona_id')) {
                $porZona = ActaConsulta::select(
                    'zonas.id as zona_id',
                    'zonas.nombre_zona',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('COUNT(DISTINCT actas_consulta.junta_id) as total_juntas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('zonas', 'actas_consulta.zona_id', '=', 'zonas.id')
                    //->where('actas_consulta.estado', true)
                    ->where('actas_consulta.parroquia_id', $request->parroquia_id)
                    ->groupBy('zonas.id', 'zonas.nombre_zona')
                    ->get();

                $electoresPorZona = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->select('z.id as zona_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                    ->where('z.parroquia_id', (int) $request->parroquia_id)
                    ->groupBy('z.id')
                    ->pluck('total_num_electores', 'zona_id');

                $porZona = $porZona->map(function ($row) use ($electoresPorZona) {
                    $den = (int) ($electoresPorZona[$row->zona_id] ?? 0);
                    $row->total_num_electores = $den;
                    $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                    return $row;
                });
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'data' => [
                    'filtros_aplicados' => [
                        'provincia_id' => $request->provincia_id,
                        'canton_id' => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id' => $request->zona_id,
                    ],
                    'resumen_general' => [
                        'total_actas_ingresadas' => $totalActas, // filas (junta+pregunta)
                        'total_juntas_con_acta'  => $totalJuntasConActa, // juntas distintas
                        'actas_cuadradas' => $actasCuadradas,
                        'actas_legibles' => $actasLegibles,
                        'porcentaje_cuadradas' => $totalActas > 0 ? round(($actasCuadradas / $totalActas) * 100, 2) : 0,
                        'porcentaje_legibles' => $totalActas > 0 ? round(($actasLegibles / $totalActas) * 100, 2) : 0,
                    ],
                    'resumen_votos' => [
                        'total_votos_validos' => $totalVotosValidos,
                        'total_votos_blancos' => $totalVotosBlancos,
                        'total_votos_nulos' => $totalVotosNulos,
                        'total_num_electores' => $totalNumElectores,
                        'porcentaje_validos_sobre_electores' => $porcentajeValidosSobreElectores,
                        'porcentaje_blancos' => $totalVotosValidos > 0 ? round(($totalVotosBlancos / $totalVotosValidos) * 100, 2) : 0,
                        'porcentaje_nulos' => $totalVotosValidos > 0 ? round(($totalVotosNulos / $totalVotosValidos) * 100, 2) : 0,
                    ],
                    'por_provincia' => $porProvincia,
                    'por_canton' => $porCanton,
                    'por_parroquia' => $porParroquia,
                    'por_zona' => $porZona,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resultados consolidados por pregunta (suma nacional o filtrada)
     *  Utilizarlo para mostrar en la vista de ResultadosActaConsultaPage
     */
    public function resultadosPorPregunta(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'provincia_id' => 'nullable|integer|exists:provincias,id',
                'canton_id' => 'nullable|integer|exists:cantones,id',
                'parroquia_id' => 'nullable|integer|exists:parroquias,id',
                'zona_id' => 'nullable|integer|exists:zonas,id',
            ]);

            $query = ActaConsulta::query()->from('actas_consulta');
            // ->where('estado', true);

            if ($request->filled('provincia_id')) {
                $query->where('provincia_id', (int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $query->where('canton_id', (int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $query->where('parroquia_id', (int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $query->where('zona_id', (int) $request->zona_id);
            }

            // Resultados agregados por pregunta
            $resultados = (clone $query)
                ->join('preguntas_consulta', 'actas_consulta.pregunta_id', '=', 'preguntas_consulta.id')
                ->select(
                    'preguntas_consulta.id as pregunta_id',
                    'preguntas_consulta.numero_pregunta',
                    'preguntas_consulta.texto_pregunta',
                    DB::raw('SUM(actas_consulta.votos_si) as total_votos_si'),
                    DB::raw('SUM(actas_consulta.votos_no) as total_votos_no'),
                    DB::raw('SUM(actas_consulta.votos_blancos) as total_votos_blancos'),
                    DB::raw('SUM(actas_consulta.votos_nulos) as total_votos_nulos'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos'),
                    DB::raw('COUNT(DISTINCT actas_consulta.junta_id) as juntas_con_acta'),
                    DB::raw('COUNT(actas_consulta.id) as filas')
                )
                ->groupBy('preguntas_consulta.id', 'preguntas_consulta.numero_pregunta', 'preguntas_consulta.texto_pregunta')
                ->orderBy('preguntas_consulta.numero_pregunta')
                ->get()
                ->map(function ($item) {
                    $validos = (int) $item->total_votos_validos;
                    return [
                        'pregunta_id' => $item->pregunta_id,
                        'numero_pregunta' => $item->numero_pregunta,
                        'texto_pregunta' => $item->texto_pregunta,
                        'total_votos_si' => (int) $item->total_votos_si,
                        'total_votos_no' => (int) $item->total_votos_no,
                        'total_votos_blancos' => (int) $item->total_votos_blancos,
                        'total_votos_nulos' => (int) $item->total_votos_nulos,
                        'total_votos_validos' => $validos,
                        'porcentaje_si' => $validos > 0 ? round(($item->total_votos_si / $validos) * 100, 2) : 0,
                        'porcentaje_no' => $validos > 0 ? round(($item->total_votos_no / $validos) * 100, 2) : 0,
                        'juntas_con_acta' => (int) $item->juntas_con_acta,
                        'filas' => (int) $item->filas,
                    ];
                });

            // Acumulado global del ámbito (sumatorias simples)
            $acumGlobal = (clone $query)
                ->selectRaw('
                SUM(votos_blancos) as total_votos_blancos,
                SUM(votos_nulos) as total_votos_nulos,
                SUM(votos_validos) as total_votos_validos
            ')
                ->first();

            // Total de electores en el ámbito (recintos.num_electores)
            $electoresQuery = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                ->join('cantones as c', 'c.id', '=', 'p.canton_id')
                ->join('provincias as pr', 'pr.id', '=', 'c.provincia_id');

            if ($request->filled('provincia_id')) {
                $electoresQuery->where('pr.id', (int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $electoresQuery->where('c.id', (int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $electoresQuery->where('p.id', (int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $electoresQuery->where('z.id', (int) $request->zona_id);
            }

            $totalNumElectores = (int) $electoresQuery->sum('r.num_electores');

            return response()->json([
                'status' => HTTPStatus::Success,
                'data' => [
                    'filtros_aplicados' => [
                        'provincia_id' => $request->provincia_id,
                        'canton_id' => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id' => $request->zona_id,
                    ],
                    'resultados' => $resultados,
                    'acumulado_simple' => [
                        'total_votos_blancos' => (int) ($acumGlobal->total_votos_blancos ?? 0),
                        'total_votos_nulos' => (int) ($acumGlobal->total_votos_nulos ?? 0),
                        'total_votos_validos' => (int) ($acumGlobal->total_votos_validos ?? 0),
                    ],
                    'poblacion_electoral' => [
                        'total_num_electores' => $totalNumElectores,
                    ],
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }
}
