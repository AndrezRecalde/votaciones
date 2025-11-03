<?php

namespace App\Http\Controllers\Consulta;

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
     * Listar todas las actas de consulta con paginación
     */
    public function getActasConsulta(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);

            $actas = ActaConsulta::with([
                'actaConsultaPreguntas.pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta',
                'userAdd',
                'userUpdate'
            ])
                ->activas()
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'actas' => $actas,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las actas de consulta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear nueva acta de consulta con preguntas
     */
    public function store(StoreActaConsultaRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Crear el acta de consulta
            $actaData = $request->except('preguntas');
            $actaData['user_add'] = Auth::id();

            $acta = ActaConsulta::create($actaData);

            // Crear las preguntas asociadas
            if ($request->has('preguntas')) {
                foreach ($request->preguntas as $pregunta) {
                    $acta->actaConsultaPreguntas()->create([
                        'pregunta_id' => $pregunta['pregunta_id'],
                        'votos_si' => $pregunta['votos_si'],
                        'votos_no' => $pregunta['votos_no'],
                    ]);
                }
            }

            DB::commit();

            // Cargar las relaciones
            $acta->load([
                'actaConsultaPreguntas.pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta'
            ]);

            return response()->json([
                'success' => true,
                'msg' => 'Acta de consulta creada exitosamente',
                'acta' => $acta,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el acta de consulta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostrar un acta de consulta específica
     */
    public function show(int $id): JsonResponse
    {
        try {
            $acta = ActaConsulta::with([
                'actaConsultaPreguntas.pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta',
                'userAdd',
                'userUpdate'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'acta' => $acta,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Acta de consulta no encontrada',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Actualizar un acta de consulta con sus preguntas
     */
    public function update(UpdateActaConsultaRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $acta = ActaConsulta::findOrFail($id);

            // Actualizar datos del acta
            $actaData = $request->except('preguntas');
            $actaData['user_update'] = Auth::id();

            $acta->update($actaData);

            // Actualizar preguntas si se envían
            if ($request->has('preguntas')) {
                // Eliminar preguntas existentes
                $acta->actaConsultaPreguntas()->delete();

                // Crear las nuevas preguntas
                foreach ($request->preguntas as $pregunta) {
                    $acta->actaConsultaPreguntas()->create([
                        'pregunta_id' => $pregunta['pregunta_id'],
                        'votos_si' => $pregunta['votos_si'],
                        'votos_no' => $pregunta['votos_no'],
                    ]);
                }
            }

            DB::commit();

            // Cargar las relaciones
            $acta->load([
                'actaConsultaPreguntas.pregunta',
                'provincia',
                'canton',
                'parroquia',
                'zona',
                'junta'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Acta de consulta actualizada exitosamente',
                'acta' => $acta,
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el acta de consulta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar (soft delete) un acta de consulta
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $acta = ActaConsulta::findOrFail($id);

            // Soft delete (cambiar estado a false)
            $acta->update(['estado' => false]);

            return response()->json([
                'success' => true,
                'message' => 'Acta de consulta eliminada exitosamente',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el acta de consulta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener resumen de votos por pregunta de un acta
     */
    public function resumenVotos(int $id): JsonResponse
    {
        try {
            $acta = ActaConsulta::findOrFail($id);
            $resumen = $acta->getResumenVotosPorPregunta();

            return response()->json([
                'success' => true,
                'data' => [
                    'acta_id' => $acta->id,
                    'cod_cne' => $acta->cod_cne,
                    'votos_validos' => $acta->votos_validos,
                    'votos_blancos' => $acta->votos_blancos,
                    'votos_nulos' => $acta->votos_nulos,
                    'total_votos_emitidos' => $acta->total_votos_emitidos,
                    'resumen_preguntas' => $resumen,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el resumen de votos',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Obtener estadísticas de actas ingresadas
     * Filtrable por provincia, cantón, parroquia o zona
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

            // Aplicar filtros usando los scopes
            if ($request->has('provincia_id')) {
                $query->porProvincia($request->provincia_id);
            }

            if ($request->has('canton_id')) {
                $query->porCanton($request->canton_id);
            }

            if ($request->has('parroquia_id')) {
                $query->porParroquia($request->parroquia_id);
            }

            if ($request->has('zona_id')) {
                $query->porZona($request->zona_id);
            }

            // Obtener estadísticas
            $totalActas = $query->count();
            $actasCuadradas = (clone $query)->cuadrada()->count();
            $actasLegibles = (clone $query)->legible()->count();

            $totalVotosValidos = $query->sum('votos_validos');
            $totalVotosBlancos = $query->sum('votos_blancos');
            $totalVotosNulos = $query->sum('votos_nulos');
            $totalVotosEmitidos = $totalVotosValidos + $totalVotosBlancos + $totalVotosNulos;

            // Estadísticas por provincia (si no se filtró por provincia)
            $porProvincia = [];
            if (!$request->has('provincia_id')) {
                $porProvincia = ActaConsulta::select(
                    'provincias.nombre_provincia',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('provincias', 'actas_consulta.provincia_id', '=', 'provincias.id')
                    ->where('actas_consulta.estado', true)
                    ->groupBy('provincias.id', 'provincias.nombre_provincia')
                    ->get();
            }

            // Estadísticas por cantón (si se filtró por provincia pero no por cantón)
            $porCanton = [];
            if ($request->has('provincia_id') && !$request->has('canton_id')) {
                $porCanton = ActaConsulta::select(
                    'cantones.nombre_canton',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('cantones', 'actas_consulta.canton_id', '=', 'cantones.id')
                    ->where('actas_consulta.estado', true)
                    ->where('actas_consulta.provincia_id', $request->provincia_id)
                    ->groupBy('cantones.id', 'cantones.nombre_canton')
                    ->get();
            }

            // Estadísticas por parroquia (si se filtró por cantón pero no por parroquia)
            $porParroquia = [];
            if ($request->has('canton_id') && !$request->has('parroquia_id')) {
                $porParroquia = ActaConsulta::select(
                    'parroquias.nombre_parroquia',
                    'parroquias.tipo',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('parroquias', 'actas_consulta.parroquia_id', '=', 'parroquias.id')
                    ->where('actas_consulta.estado', true)
                    ->where('actas_consulta.canton_id', $request->canton_id)
                    ->groupBy('parroquias.id', 'parroquias.nombre_parroquia', 'parroquias.tipo')
                    ->get();
            }

            // Estadísticas por zona (si se filtró por parroquia pero no por zona)
            $porZona = [];
            if ($request->has('parroquia_id') && !$request->has('zona_id')) {
                $porZona = ActaConsulta::select(
                    'zonas.nombre_zona',
                    DB::raw('COUNT(actas_consulta.id) as total_actas'),
                    DB::raw('SUM(actas_consulta.votos_validos) as total_votos_validos')
                )
                    ->join('zonas', 'actas_consulta.zona_id', '=', 'zonas.id')
                    ->where('actas_consulta.estado', true)
                    ->where('actas_consulta.parroquia_id', $request->parroquia_id)
                    ->groupBy('zonas.id', 'zonas.nombre_zona')
                    ->get();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'filtros_aplicados' => [
                        'provincia_id' => $request->provincia_id,
                        'canton_id' => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id' => $request->zona_id,
                    ],
                    'resumen_general' => [
                        'total_actas_ingresadas' => $totalActas,
                        'actas_cuadradas' => $actasCuadradas,
                        'actas_legibles' => $actasLegibles,
                        'porcentaje_cuadradas' => $totalActas > 0 ? round(($actasCuadradas / $totalActas) * 100, 2) : 0,
                        'porcentaje_legibles' => $totalActas > 0 ? round(($actasLegibles / $totalActas) * 100, 2) : 0,
                    ],
                    'resumen_votos' => [
                        'total_votos_validos' => $totalVotosValidos,
                        'total_votos_blancos' => $totalVotosBlancos,
                        'total_votos_nulos' => $totalVotosNulos,
                        'total_votos_emitidos' => $totalVotosEmitidos,
                        'porcentaje_validos' => $totalVotosEmitidos > 0 ? round(($totalVotosValidos / $totalVotosEmitidos) * 100, 2) : 0,
                        'porcentaje_blancos' => $totalVotosEmitidos > 0 ? round(($totalVotosBlancos / $totalVotosEmitidos) * 100, 2) : 0,
                        'porcentaje_nulos' => $totalVotosEmitidos > 0 ? round(($totalVotosNulos / $totalVotosEmitidos) * 100, 2) : 0,
                    ],
                    'por_provincia' => $porProvincia,
                    'por_canton' => $porCanton,
                    'por_parroquia' => $porParroquia,
                    'por_zona' => $porZona,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las estadísticas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener resultados consolidados por pregunta
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

            $query = ActaConsulta::query()->activas();

            // Aplicar filtros
            if ($request->has('provincia_id')) {
                $query->porProvincia($request->provincia_id);
            }
            if ($request->has('canton_id')) {
                $query->porCanton($request->canton_id);
            }
            if ($request->has('parroquia_id')) {
                $query->porParroquia($request->parroquia_id);
            }
            if ($request->has('zona_id')) {
                $query->porZona($request->zona_id);
            }

            // Obtener IDs de las actas filtradas
            $actaIds = $query->pluck('id');

            // Consolidar resultados por pregunta
            $resultados = DB::table('acta_consulta_preguntas')
                ->select(
                    'preguntas_consulta.id as pregunta_id',
                    'preguntas_consulta.numero_pregunta',
                    'preguntas_consulta.texto_pregunta',
                    DB::raw('SUM(acta_consulta_preguntas.votos_si) as total_votos_si'),
                    DB::raw('SUM(acta_consulta_preguntas.votos_no) as total_votos_no'),
                    DB::raw('COUNT(DISTINCT acta_consulta_preguntas.acta_consulta_id) as total_actas')
                )
                ->join('preguntas_consulta', 'acta_consulta_preguntas.pregunta_id', '=', 'preguntas_consulta.id')
                ->whereIn('acta_consulta_preguntas.acta_consulta_id', $actaIds)
                ->groupBy('preguntas_consulta.id', 'preguntas_consulta.numero_pregunta', 'preguntas_consulta.texto_pregunta')
                ->orderBy('preguntas_consulta.numero_pregunta')
                ->get()
                ->map(function ($item) {
                    $totalVotos = $item->total_votos_si + $item->total_votos_no;
                    return [
                        'pregunta_id' => $item->pregunta_id,
                        'numero_pregunta' => $item->numero_pregunta,
                        'texto_pregunta' => $item->texto_pregunta,
                        'total_votos_si' => $item->total_votos_si,
                        'total_votos_no' => $item->total_votos_no,
                        'total_votos' => $totalVotos,
                        'porcentaje_si' => $totalVotos > 0 ? round(($item->total_votos_si / $totalVotos) * 100, 2) : 0,
                        'porcentaje_no' => $totalVotos > 0 ? round(($item->total_votos_no / $totalVotos) * 100, 2) : 0,
                        'total_actas' => $item->total_actas,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'filtros_aplicados' => [
                        'provincia_id' => $request->provincia_id,
                        'canton_id' => $request->canton_id,
                        'parroquia_id' => $request->parroquia_id,
                        'zona_id' => $request->zona_id,
                    ],
                    'resultados' => $resultados,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los resultados por pregunta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
