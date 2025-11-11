<?php

namespace App\Http\Controllers\Consulta;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActaConsultaRequest;
use App\Http\Requests\UpdateActaConsultaRequest;
use App\Models\ActaConsulta;
use App\Models\ActaConsultaPregunta;
use App\Models\PreguntaConsulta;
use App\Enums\HTTPStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class ActaConsultaController extends Controller
{
    /**
     * INDEX SIMPLE
     * Query params:
     * - provincia_id, canton_id, parroquia_id, zona_id
     * - per_page (int, default 15)
     * Retorna: actas con sus preguntas, votos, porcentajes (respecto a acta.votos_validos), usuarios y geografía.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'provincia_id' => 'nullable|integer|exists:provincias,id',
            'canton_id'    => 'nullable|integer|exists:cantones,id',
            'parroquia_id' => 'nullable|integer|exists:parroquias,id',
            'zona_id'      => 'nullable|integer|exists:zonas,id',
            'per_page'     => 'nullable|integer|min:1|max:200',
        ]);

        $perPage = (int) $request->input('per_page', 15);

        $query = ActaConsulta::query()
            ->with([
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta.recinto',
                'preguntas.pregunta',
                'preguntas.actaConsulta', // para evitar N+1 en accessors de porcentaje
                'userAdd',
                'userUpdate',
            ]);

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

        $query->orderBy('id', 'desc');

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(function (ActaConsulta $acta) {
            $preguntas = $acta->preguntas->sortBy(function ($p) {
                return $p->pregunta->casillero_pregunta ?? $p->pregunta_id;
            })->values()->map(function (ActaConsultaPregunta $p) {
                return [
                    'acta_consulta_pregunta_id' => $p->id,
                    'pregunta_id'    => $p->pregunta_id,
                    'casillero'      => $p->pregunta->casillero_pregunta ?? null,
                    'texto_pregunta' => $p->pregunta->texto_pregunta ?? null,
                    'votos_si'       => (int) $p->votos_si,
                    'votos_no'       => (int) $p->votos_no,
                    'votos_blancos'  => (int) $p->votos_blancos,
                    'votos_nulos'    => (int) $p->votos_nulos,
                    // Porcentajes calculados respecto a acta.votos_validos (permitida inconsistencia)
                    'porcentaje_si'  => $p->porcentaje_si,
                    'porcentaje_no'  => $p->porcentaje_no,
                ];
            });

            return [
                'acta_id'       => $acta->id,
                'cod_cne'       => $acta->cod_cne,
                'votos_validos' => (int) $acta->votos_validos,
                'estado'        => (bool) $acta->estado,
                'cuadrada'      => (bool) $acta->cuadrada,
                'legible'       => (bool) $acta->legible,

                'user_add'      => $acta->userAdd->name ?? null,
                'user_update'   => $acta->userUpdate->name ?? null,

                'provincia_id'  => $acta->provincia_id,
                'canton_id'     => $acta->canton_id,
                'parroquia_id'  => $acta->parroquia_id,
                'zona_id'       => $acta->zona_id,
                'junta_id'      => $acta->junta_id,
                'recinto_id'    => $acta->junta->recinto_id ?? null,

                'nombres' => [
                    'provincia' => $acta->provincia->nombre_provincia ?? null,
                    'canton'    => $acta->canton->nombre_canton ?? null,
                    'parroquia' => $acta->parroquia->nombre_parroquia ?? null,
                    'zona'      => $acta->zona->nombre_zona ?? null,
                    'junta'     => $acta->junta->junta_nombre ?? null,
                    'recinto'   => optional($acta->junta->recinto)->nombre_recinto,
                ],

                'preguntas'  => $preguntas,
                'created_at' => $acta->created_at?->toIso8601String(),
                'updated_at' => $acta->updated_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'status' => HTTPStatus::Success,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
            'filters_applied' => [
                'provincia_id' => $request->provincia_id,
                'canton_id'    => $request->canton_id,
                'parroquia_id' => $request->parroquia_id,
                'zona_id'      => $request->zona_id,
            ],
            'data' => $data,
        ], 200);
    }

    /**
     * STORE: Crea el encabezado del acta + upsert de preguntas.
     * - votos_validos se registra a nivel de ACTA.
     * - En detalle NO se maneja votos_validos.
     */
    public function store(StoreActaConsultaRequest $request): JsonResponse
    {
        $juntaId = (int) $request->junta_id;

        // Derivar geografía desde la junta
        $geo = DB::table('juntas as j')
            ->select(
                'j.id as junta_id',
                'z.id as zona_id',
                'p.id as parroquia_id',
                'c.id as canton_id',
                'pr.id as provincia_id'
            )
            ->join('zonas as z', 'j.zona_id', '=', 'z.id')
            ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
            ->join('cantones as c', 'p.canton_id', '=', 'c.id')
            ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
            ->where('j.id', $juntaId)
            ->first();

        if (!$geo) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'No se pudo derivar la geografía desde la junta.',
            ], 422);
        }

        // Unicidad de acta activa por junta
        $actaExistente = ActaConsulta::where('junta_id', $juntaId)
            ->where('estado', true)
            ->first();

        if ($actaExistente) {
            return response()->json([
                'status'  => HTTPStatus::Error,
                'msg'     => 'Ya existe un acta activa para esta junta.',
                'acta_id' => $actaExistente->id,
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Crear encabezado (votos_validos a nivel de acta)
            $acta = ActaConsulta::create([
                'provincia_id'  => $geo->provincia_id,
                'canton_id'     => $geo->canton_id,
                'parroquia_id'  => $geo->parroquia_id,
                'zona_id'       => $geo->zona_id,
                'junta_id'      => $geo->junta_id,

                'cod_cne'       => $request->cod_cne,
                'votos_validos' => (int) $request->votos_validos,
                'cuadrada'      => $request->boolean('cuadrada', true),
                'legible'       => $request->boolean('legible', true),
                'estado'        => $request->boolean('estado', true),

                'user_add'      => Auth::id(),
            ]);

            // Upsert detalle (sin votos_validos)
            $payload = $request->preguntasPayload($acta->id);

            $inserted = 0;
            $updated  = 0;

            if (!empty($payload)) {
                $ids = collect($payload)->pluck('pregunta_id')->all();
                $existentes = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                    ->whereIn('pregunta_id', $ids)
                    ->pluck('id', 'pregunta_id');

                $inserted = count(array_diff($ids, $existentes->keys()->all()));
                $updated  = count(array_intersect($ids, $existentes->keys()->all()));

                DB::table('acta_consulta_preguntas')->upsert(
                    $payload,
                    ['acta_consulta_id', 'pregunta_id'],
                    ['votos_blancos', 'votos_nulos', 'votos_si', 'votos_no', 'updated_at']
                );
            }

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Acta creada exitosamente.',
                'data'    => [
                    'acta_id'       => $acta->id,
                    'votos_validos' => (int) $acta->votos_validos,
                    'resumen' => [
                        'preguntas_enviadas' => count($payload),
                        'insertadas'         => $inserted,
                        'actualizadas'       => $updated,
                    ],
                ],
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
     * UPDATE: Actualiza encabezado (incluye votos_validos) + upsert de preguntas.
     * - "sync": si true, elimina preguntas NO enviadas.
     */
    public function update(UpdateActaConsultaRequest $request, int $id): JsonResponse
    {
        $acta = ActaConsulta::find($id);
        if (!$acta) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => 'Acta no encontrada.',
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Actualizar encabezado (incluye votos_validos a nivel de acta)
            $acta->update([
                'cod_cne'       => $request->has('cod_cne') ? $request->cod_cne : $acta->cod_cne,
                'votos_validos' => $request->has('votos_validos') ? (int) $request->votos_validos : $acta->votos_validos,
                'cuadrada'      => $request->has('cuadrada') ? (bool) $request->cuadrada : $acta->cuadrada,
                'legible'       => $request->has('legible') ? (bool) $request->legible : $acta->legible,
                'estado'        => $request->has('estado') ? (bool) $request->estado : $acta->estado,
                'user_update'   => Auth::id(),
            ]);

            $payload = $request->preguntasPayload($acta->id);

            $inserted        = 0;
            $updated         = 0;
            $synced_deleted  = 0;

            if (!empty($payload)) {
                $ids = collect($payload)->pluck('pregunta_id')->all();
                $existentes = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                    ->whereIn('pregunta_id', $ids)
                    ->pluck('id', 'pregunta_id');

                $inserted = count(array_diff($ids, $existentes->keys()->all()));
                $updated  = count(array_intersect($ids, $existentes->keys()->all()));

                DB::table('acta_consulta_preguntas')->upsert(
                    $payload,
                    ['acta_consulta_id', 'pregunta_id'],
                    ['votos_blancos', 'votos_nulos', 'votos_si', 'votos_no', 'updated_at']
                );

                if ($request->boolean('sync')) {
                    $synced_deleted = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                        ->whereNotIn('pregunta_id', $ids)
                        ->delete();
                }
            } else {
                if ($request->boolean('sync')) {
                    $synced_deleted = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)->delete();
                }
            }

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Acta actualizada exitosamente.',
                'data'   => [
                    'acta_id'       => $acta->id,
                    'votos_validos' => (int) $acta->votos_validos,
                    'resumen'       => [
                        'preguntas_enviadas'   => count($payload),
                        'insertadas'           => $inserted,
                        'actualizadas'         => $updated,
                        'eliminadas_por_sync'  => $synced_deleted,
                    ],
                ],
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DESTROY (hard delete): Elimina físicamente el acta y sus preguntas (cascade).
     */
    public function destroy(int $id): JsonResponse
    {
        $acta = ActaConsulta::find($id);
        if (!$acta) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'message' => 'Acta no encontrada.',
            ], 404);
        }

        try {
            $acta->delete();
            return response()->json([
                'status' => HTTPStatus::Success,
                'message' => 'Acta eliminada correctamente.',
                'data' => [
                    'acta_id' => $id,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'message' => 'Error al eliminar el acta.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resumen de votos por acta (por id o por junta_id como query param si usas la ruta sin {id}).
     * - Porcentajes de cada pregunta se calculan respecto a acta.votos_validos (inconsistencia permitida).
     */
    public function resumenVotos(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'junta_id' => 'nullable|integer|exists:juntas,id',
            ]);

            if ($request->filled('junta_id')) {
                $acta = ActaConsulta::with([
                    'preguntas.pregunta',
                    'preguntas.actaConsulta',
                    'provincia',
                    'canton',
                    'parroquia',
                    'zona',
                    'junta',
                ])
                    ->activas()
                    ->where('junta_id', (int) $request->junta_id)
                    ->firstOrFail();
            } else {
                $acta = ActaConsulta::with([
                    'preguntas.pregunta',
                    'preguntas.actaConsulta',
                    'provincia',
                    'canton',
                    'parroquia',
                    'zona',
                    'junta',
                ])
                    ->findOrFail($id);
            }

            $detalles = $acta->preguntas->sortBy(function ($p) {
                return $p->pregunta->casillero_pregunta ?? $p->pregunta_id;
            })->values();

            $resumen = $detalles->map(function (ActaConsultaPregunta $p) {
                return [
                    'acta_consulta_pregunta_id' => $p->id,
                    'pregunta_id'               => $p->pregunta_id,
                    'casillero_pregunta'        => $p->pregunta->casillero_pregunta ?? null,
                    'texto_pregunta'            => $p->pregunta->texto_pregunta ?? null,

                    'votos_si'      => (int) $p->votos_si,
                    'votos_no'      => (int) $p->votos_no,
                    'votos_blancos' => (int) $p->votos_blancos,
                    'votos_nulos'   => (int) $p->votos_nulos,

                    'porcentaje_si' => $p->porcentaje_si,
                    'porcentaje_no' => $p->porcentaje_no,
                ];
            });

            $totales = [
                'validos' => (int) $acta->votos_validos,
                'blancos' => (int) $detalles->sum('votos_blancos'),
                'nulos'   => (int) $detalles->sum('votos_nulos'),
            ];

            return response()->json([
                'status' => HTTPStatus::Success,
                'data' => [
                    'acta_id'  => $acta->id,
                    'junta_id' => $acta->junta_id,
                    'ubicacion' => [
                        'provincia_id' => $acta->provincia_id,
                        'canton_id'    => $acta->canton_id,
                        'parroquia_id' => $acta->parroquia_id,
                        'zona_id'      => $acta->zona_id,
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
     * ESTADISTICAS: Agregados globales y desgloses territoriales con la nueva estructura.
     * - votos_validos se suma desde el encabezado (actas_consulta).
     * - blancos y nulos desde el detalle (acta_consulta_preguntas).
     */
    public function estadisticas(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'provincia_id' => 'nullable|integer|exists:provincias,id',
                'canton_id'    => 'nullable|integer|exists:cantones,id',
                'parroquia_id' => 'nullable|integer|exists:parroquias,id',
                'zona_id'      => 'nullable|integer|exists:zonas,id',
            ]);

            $encabezadosQuery = ActaConsulta::query()->activas();

            if ($request->filled('provincia_id')) {
                $encabezadosQuery->porProvincia((int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $encabezadosQuery->porCanton((int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $encabezadosQuery->porParroquia((int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $encabezadosQuery->porZona((int) $request->zona_id);
            }

            $totalActasEncabezado = (clone $encabezadosQuery)->count();
            $totalJuntasConActa   = (clone $encabezadosQuery)->distinct('junta_id')->count('junta_id');
            $actasCuadradas       = (clone $encabezadosQuery)->cuadrada()->count();
            $actasLegibles        = (clone $encabezadosQuery)->legible()->count();

            // Totales de votos
            $totalVotosValidos = (int) (clone $encabezadosQuery)->sum('votos_validos');

            $detalleQuery = DB::table('acta_consulta_preguntas as d')
                ->join('actas_consulta as a', 'd.acta_consulta_id', '=', 'a.id')
                ->where('a.estado', true);

            if ($request->filled('provincia_id')) {
                $detalleQuery->where('a.provincia_id', (int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $detalleQuery->where('a.canton_id', (int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $detalleQuery->where('a.parroquia_id', (int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $detalleQuery->where('a.zona_id', (int) $request->zona_id);
            }

            $totalesDetalle = (clone $detalleQuery)
                ->selectRaw('
                    COUNT(d.id) as filas_preguntas,
                    SUM(d.votos_blancos) as sum_votos_blancos,
                    SUM(d.votos_nulos)   as sum_votos_nulos
                ')
                ->first();

            $totalFilasPreguntas = (int) ($totalesDetalle->filas_preguntas ?? 0);
            $totalVotosBlancos   = (int) ($totalesDetalle->sum_votos_blancos ?? 0);
            $totalVotosNulos     = (int) ($totalesDetalle->sum_votos_nulos ?? 0);

            // Denominador: electores
            $electoresQuery = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id');

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

            // Desgloses
            $porProvincia = [];
            if (!$request->filled('provincia_id')) {
                $porProvincia = DB::table('actas_consulta as a')
                    ->selectRaw('
                        pr.id as provincia_id,
                        pr.nombre_provincia,
                        COUNT(DISTINCT a.id) as total_actas_encabezado,
                        COUNT(DISTINCT a.junta_id) as total_juntas,
                        SUM(a.votos_validos) as total_votos_validos,
                        SUM(d.votos_blancos) as total_votos_blancos,
                        SUM(d.votos_nulos) as total_votos_nulos
                    ')
                    ->join('provincias as pr', 'a.provincia_id', '=', 'pr.id')
                    ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                    ->where('a.estado', true)
                    ->groupBy('pr.id', 'pr.nombre_provincia')
                    ->get();

                $electoresPorProvincia = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                    ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                    ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
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

            $porCanton = [];
            if ($request->filled('provincia_id') && !$request->filled('canton_id')) {
                $porCanton = DB::table('actas_consulta as a')
                    ->selectRaw('
                        c.id as canton_id,
                        c.nombre_canton,
                        COUNT(DISTINCT a.id) as total_actas_encabezado,
                        COUNT(DISTINCT a.junta_id) as total_juntas,
                        SUM(a.votos_validos) as total_votos_validos,
                        SUM(d.votos_blancos) as total_votos_blancos,
                        SUM(d.votos_nulos) as total_votos_nulos
                    ')
                    ->join('cantones as c', 'a.canton_id', '=', 'c.id')
                    ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                    ->where('a.estado', true)
                    ->where('a.provincia_id', (int) $request->provincia_id)
                    ->groupBy('c.id', 'c.nombre_canton')
                    ->get();

                $electoresPorCanton = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                    ->join('cantones as c', 'p.canton_id', '=', 'c.id')
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

            $porParroquia = [];
            if ($request->filled('canton_id') && !$request->filled('parroquia_id')) {
                $porParroquia = DB::table('actas_consulta as a')
                    ->selectRaw('
                        p.id as parroquia_id,
                        p.nombre_parroquia,
                        p.tipo,
                        COUNT(DISTINCT a.id) as total_actas_encabezado,
                        COUNT(DISTINCT a.junta_id) as total_juntas,
                        SUM(a.votos_validos) as total_votos_validos,
                        SUM(d.votos_blancos) as total_votos_blancos,
                        SUM(d.votos_nulos) as total_votos_nulos
                    ')
                    ->join('parroquias as p', 'a.parroquia_id', '=', 'p.id')
                    ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                    ->where('a.estado', true)
                    ->where('a.canton_id', (int) $request->canton_id)
                    ->groupBy('p.id', 'p.nombre_parroquia', 'p.tipo')
                    ->get();

                $electoresPorParroquia = DB::table('juntas as j')
                    ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                    ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                    ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
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

            $porZona = [];
            if ($request->filled('parroquia_id') && !$request->filled('zona_id')) {
                $porZona = DB::table('actas_consulta as a')
                    ->selectRaw('
                        z.id as zona_id,
                        z.nombre_zona,
                        COUNT(DISTINCT a.id) as total_actas_encabezado,
                        COUNT(DISTINCT a.junta_id) as total_juntas,
                        SUM(a.votos_validos) as total_votos_validos,
                        SUM(d.votos_blancos) as total_votos_blancos,
                        SUM(d.votos_nulos) as total_votos_nulos
                    ')
                    ->join('zonas as z', 'a.zona_id', '=', 'z.id')
                    ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                    ->where('a.estado', true)
                    ->where('a.parroquia_id', (int) $request->parroquia_id)
                    ->groupBy('z.id', 'z.nombre_zona')
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
                        'canton_id'    => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id'      => $request->zona_id,
                    ],
                    'resumen_general' => [
                        'total_actas_encabezado'  => $totalActasEncabezado,
                        'total_filas_preguntas'   => $totalFilasPreguntas,
                        'total_juntas_con_acta'   => $totalJuntasConActa,
                        'actas_cuadradas'         => $actasCuadradas,
                        'actas_legibles'          => $actasLegibles,
                        'porcentaje_cuadradas'    => $totalActasEncabezado > 0 ? round(($actasCuadradas / $totalActasEncabezado) * 100, 2) : 0,
                        'porcentaje_legibles'     => $totalActasEncabezado > 0 ? round(($actasLegibles / $totalActasEncabezado) * 100, 2) : 0,
                    ],
                    'resumen_votos' => [
                        'total_votos_validos'            => $totalVotosValidos,
                        'total_votos_blancos'            => $totalVotosBlancos,
                        'total_votos_nulos'              => $totalVotosNulos,
                        'total_num_electores'            => $totalNumElectores,
                        'porcentaje_validos_sobre_electores' => $porcentajeValidosSobreElectores,
                        'porcentaje_blancos'             => $totalVotosValidos > 0 ? round(($totalVotosBlancos / $totalVotosValidos) * 100, 2) : 0,
                        'porcentaje_nulos'               => $totalVotosValidos > 0 ? round(($totalVotosNulos / $totalVotosValidos) * 100, 2) : 0,
                    ],
                    'por_provincia' => $porProvincia,
                    'por_canton'    => $porCanton,
                    'por_parroquia' => $porParroquia,
                    'por_zona'      => $porZona,
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
     * Resultados agregados por pregunta (global/territorial) con nueva estructura.
     * - SI/NO/Blancos/Nulos desde detalle.
     * - Válidos: SUM(a.votos_validos) por cada pregunta (actas con esa pregunta).
     */
    public function resultadosPorPregunta(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'provincia_id' => 'nullable|integer|exists:provincias,id',
                'canton_id'    => 'nullable|integer|exists:cantones,id',
                'parroquia_id' => 'nullable|integer|exists:parroquias,id',
                'zona_id'      => 'nullable|integer|exists:zonas,id',
            ]);

            $detalle = DB::table('acta_consulta_preguntas as d')
                ->join('actas_consulta as a', 'd.acta_consulta_id', '=', 'a.id')
                ->join('preguntas_consulta as q', 'd.pregunta_id', '=', 'q.id')
                ->where('a.estado', true);

            if ($request->filled('provincia_id')) {
                $detalle->where('a.provincia_id', (int) $request->provincia_id);
            }
            if ($request->filled('canton_id')) {
                $detalle->where('a.canton_id', (int) $request->canton_id);
            }
            if ($request->filled('parroquia_id')) {
                $detalle->where('a.parroquia_id', (int) $request->parroquia_id);
            }
            if ($request->filled('zona_id')) {
                $detalle->where('a.zona_id', (int) $request->zona_id);
            }

            $resultados = (clone $detalle)
                ->select(
                    'q.id as pregunta_id',
                    'q.casillero_pregunta',
                    'q.texto_pregunta',
                    DB::raw('SUM(d.votos_si) as total_votos_si'),
                    DB::raw('SUM(d.votos_no) as total_votos_no'),
                    DB::raw('SUM(d.votos_blancos) as total_votos_blancos'),
                    DB::raw('SUM(d.votos_nulos) as total_votos_nulos'),
                    // Válidos del encabezado; cada acta cuenta una vez por pregunta
                    DB::raw('SUM(a.votos_validos) as total_votos_validos'),
                    DB::raw('COUNT(DISTINCT a.junta_id) as juntas_con_acta'),
                    DB::raw('COUNT(d.id) as filas')
                )
                ->groupBy('q.id', 'q.casillero_pregunta', 'q.texto_pregunta')
                ->orderBy('q.casillero_pregunta')
                ->get()
                ->map(function ($item) {
                    $validos = (int) $item->total_votos_validos;
                    return [
                        'pregunta_id'         => (int) $item->pregunta_id,
                        'casillero_pregunta'  => $item->casillero_pregunta,
                        'texto_pregunta'      => $item->texto_pregunta,
                        'total_votos_si'      => (int) $item->total_votos_si,
                        'total_votos_no'      => (int) $item->total_votos_no,
                        'total_votos_blancos' => (int) $item->total_votos_blancos,
                        'total_votos_nulos'   => (int) $item->total_votos_nulos,
                        'total_votos_validos' => $validos,
                        'porcentaje_si'       => $validos > 0 ? round(($item->total_votos_si / $validos) * 100, 2) : 0,
                        'porcentaje_no'       => $validos > 0 ? round(($item->total_votos_no / $validos) * 100, 2) : 0,
                        'juntas_con_acta'     => (int) $item->juntas_con_acta,
                        'filas'               => (int) $item->filas,
                    ];
                });

            // Acumulado global del ámbito (sumatorias simples)
            $acumGlobal = (clone $detalle)
                ->selectRaw('
                    SUM(d.votos_blancos) as total_votos_blancos,
                    SUM(d.votos_nulos)   as total_votos_nulos
                ')
                ->first();

            $totalVotosValidosGlobal = (int) ActaConsulta::query()
                ->activas()
                ->when($request->filled('provincia_id'), fn($q) => $q->porProvincia((int) $request->provincia_id))
                ->when($request->filled('canton_id'), fn($q) => $q->porCanton((int) $request->canton_id))
                ->when($request->filled('parroquia_id'), fn($q) => $q->porParroquia((int) $request->parroquia_id))
                ->when($request->filled('zona_id'), fn($q) => $q->porZona((int) $request->zona_id))
                ->sum('votos_validos');

            // Total de electores del ámbito
            $electoresQuery = DB::table('recintos as r')
                ->join('zonas as z', 'z.id', '=', 'r.zona_id')
                ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id');

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
                        'canton_id'    => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id'      => $request->zona_id,
                    ],
                    'resultados' => $resultados,
                    'acumulado_simple' => [
                        'total_votos_blancos' => (int) ($acumGlobal->total_votos_blancos ?? 0),
                        'total_votos_nulos'   => (int) ($acumGlobal->total_votos_nulos ?? 0),
                        'total_votos_validos' => $totalVotosValidosGlobal,
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
