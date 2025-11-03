<?php

namespace App\Http\Controllers\Consulta;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PreguntaConsultaRequest;
use App\Models\PreguntaConsulta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PreguntaConsultaController extends Controller
{
    /**
     * Listado paginado de preguntas.
     * Opcionales: ?q=texto, ?activo=1/0, ?per_page=25, ?page=1
     */
    public function getPreguntas(Request $request): JsonResponse
    {
        $q = $request->query('q');
        $activo = $request->query('activo');
        $perPage = intval($request->input('per_page', 20));
        $page = intval($request->input('page', 1));

        $query = PreguntaConsulta::query();

        if (!is_null($activo) && in_array($activo, ['0', '1', 0, 1], true)) {
            $query->where('activo', (bool) $activo);
        }

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('texto_pregunta', 'like', "%{$q}%")
                    ->orWhere('descripcion', 'like', "%{$q}%")
                    ->orWhere('numero_pregunta', 'like', "%{$q}%");
            });
        }

        $preguntas = $query->orderBy('numero_pregunta')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => HTTPStatus::Success,
            'preguntas' => $preguntas,
            'paginacion' => [
                'total' => $preguntas->total(),
                'por_pagina' => $preguntas->perPage(),
                'pagina_actual' => $preguntas->currentPage(),
                'ultima_pagina' => $preguntas->lastPage(),
                'desde' => $preguntas->firstItem(),
                'hasta' => $preguntas->lastItem(),
            ],
        ], 200);
    }

    /**
     * Mostrar una pregunta por id.
     */
    public function show(int $id): JsonResponse
    {
        $pregunta = PreguntaConsulta::find($id);

        if (!$pregunta) {
            return response()->json(['message' => 'Pregunta no encontrada.'], 404);
        }

        return response()->json([
            'status' => HTTPStatus::Success,
            'pregunta' => $pregunta
        ], 200);
    }

    /**
     * Crear nueva pregunta.
     */
    public function store(PreguntaConsultaRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();

            $pregunta = PreguntaConsulta::create($data);

            DB::commit();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Pregunta creada correctamente.',
                'pregunta' => $pregunta
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar pregunta existente.
     */
    public function update(PreguntaConsultaRequest $request, int $id): JsonResponse
    {
        $pregunta = PreguntaConsulta::find($id);

        if (!$pregunta) {
            return response()->json(['message' => 'Pregunta no encontrada.'], 404);
        }

        $data = $request->validated();

        try {
            DB::beginTransaction();

            $pregunta->update($data);

            DB::commit();

            return response()->json([
                'status'    => HTTPStatus::Success,
                'msg'       => 'Pregunta actualizada correctamente.',
                'pregunta'  => $pregunta->fresh()
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * "Eliminar" - marca la pregunta como inactiva (soft-delete lógico).
     */
    public function destroy(int $id): JsonResponse
    {
        $pregunta = PreguntaConsulta::find($id);

        if (!$pregunta) {
            return response()->json(['message' => 'Pregunta no encontrada.'], 404);
        }

        try {
            $pregunta->activo = false;
            $pregunta->save();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Pregunta desactivada correctamente.'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al desactivar la pregunta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restaurar una pregunta (marcar como activa).
     */
    public function restore(int $id): JsonResponse
    {
        $pregunta = PreguntaConsulta::find($id);

        if (!$pregunta) {
            return response()->json(['message' => 'Pregunta no encontrada.'], 404);
        }

        try {
            $pregunta->activo = true;
            $pregunta->save();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Pregunta reactivada correctamente.'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Obtener todas las preguntas activas de la consulta
     * Para mostrar el formulario de ingreso
     */
    public function obtenerPreguntas(): JsonResponse
    {
        try {
            $preguntas = DB::table('preguntas_consulta')
                ->select('id', 'numero_pregunta', 'texto_pregunta', 'descripcion')
                ->where('activo', true)
                ->orderBy('numero_pregunta', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $preguntas,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }
}
