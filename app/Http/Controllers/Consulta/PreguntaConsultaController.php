<?php

namespace App\Http\Controllers\Consulta;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\PreguntaConsultaRequest;
use App\Http\Requests\StatusRequest;
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
        $preguntas = PreguntaConsulta::query();

        $all = $request->boolean('all', false);

        if ($all) {
            $preguntas = PreguntaConsulta::activas()->get();
            return response()->json([
                'status' => HTTPStatus::Success,
                'preguntas' => $preguntas,
            ], 200);
        }

        // Si no, aplica paginación normal
        $perPage = intval($request->input('per_page', 20));
        $page = intval($request->input('page', 1));

        $preguntasPaginadas = $preguntas->orderBy('casillero_pregunta', 'ASC')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => HTTPStatus::Success,
            'preguntas' => $preguntasPaginadas->items(),
            'paginacion' => [
                'total' => $preguntasPaginadas->total(),
                'por_pagina' => $preguntasPaginadas->perPage(),
                'pagina_actual' => $preguntasPaginadas->currentPage(),
                'ultima_pagina' => $preguntasPaginadas->lastPage(),
                'desde' => $preguntasPaginadas->firstItem(),
                'hasta' => $preguntasPaginadas->lastItem(),
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

    function updateActivo(StatusRequest $request, int $id): JsonResponse
    {
        $pregunta = PreguntaConsulta::find($id);
        if ($pregunta) {
            $pregunta->update($request->validated());
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
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
     * Obtener preguntas activas
     */
    public function obtenerPreguntas(): JsonResponse
    {
        try {
            $preguntas = PreguntaConsulta::activas()->ordenadoPorNumero()
                ->get(['id', 'casillero_pregunta', 'texto_pregunta', 'descripcion']);

            return response()->json([
                'success' => true,
                'data' => $preguntas,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => HTTPStatus::Error,
                'msg' => $e->getMessage(),
            ], 500);
        }
    }
}
