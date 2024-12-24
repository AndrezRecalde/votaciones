<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatusRequest;
use App\Models\Dignidad;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DignidadController extends Controller
{
    function getDignidades(Request $request): JsonResponse
    {
        $dignidades = Dignidad::from('dignidades as dig')
            ->selectRaw('dig.id, dig.nombre_dignidad, dig.tipo_dignidad, dig.activo')
            ->activo($request->activo)
            ->tipo($request->tipo)
            ->get();
        return response()->json(['status' => HTTPStatus::Success, 'dignidades' => $dignidades], 200);
    }

    function updateStatus(StatusRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        $dignidad = Dignidad::find($id);
        try {
            if ($dignidad) {
                $dignidad->update($request->validated());
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
