<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatusRequest;
use App\Http\Requests\UserPassword;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
    function getUsuarios(Request $request): JsonResponse
    {
        $usuarios = User::from('users as u')
            ->selectRaw('u.id, u.nombres_completos, u.dni, u.activo,
                                 u.provincia_id, p.nombre_provincia,
                                 p.cod_cne_prov as cod_cne,
                                 u.canton_id, c.nombre_canton,
                                 r.id as role_id, r.name as role')
            ->leftJoin('model_has_roles as mhr', 'mhr.model_id', 'u.id')
            ->leftJoin('roles as r', 'r.id', 'mhr.role_id')
            ->join('provincias as p', 'p.id', 'u.provincia_id')
            ->leftJoin('cantones as c', 'c.id', 'u.canton_id')
            ->byProvinciaId($request->provincia_id)
            ->byCantonId($request->canton_id)
            ->orderBy('u.id', 'ASC')
            ->allowed()
            ->get();

        return response()->json([
            'status'   => HTTPStatus::Success,
            'usuarios' => $usuarios->filter(function ($value) {
                if ($value->role_id > 1) {
                    return $value;
                }
            })->values()
        ], 200);
    }

    function store(UserRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $usuario = User::create($request->validated());
            $usuario->assignRole($request->role);
            DB::commit();
            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Creacion
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    function update(UserRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        $usuario = User::find($id);
        try {
            if ($usuario) {
                $usuario->update($request->validated());

                if ($request->filled('role')) {
                    $usuario->roles()->detach();
                    $usuario->assignRole($request->role);
                }
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Creacion
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

    function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        $usuario = User::find($id);

        if ($usuario) {
            $usuario->roles()->detach();
            $usuario->delete();
            DB::commit();
            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => HTTPStatus::Eliminado
            ], 200);
        } else {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => HTTPStatus::NotFound
            ], 404);
        }
    }

    public function updatePassword(UserPassword $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        $usuario = User::find($id);

        try {
            if ($usuario) {
                $usuario->update($request->validated());
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

    public function updateStatus(StatusRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        $usuario = User::find($id);
        try {
            if ($usuario) {
                $usuario->update($request->validated());
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

    public function contarActas(Request $request)
    {
        // Ejecutamos el procedimiento almacenado
        $resultado = DB::select('CALL sp_contar_actas(?)', [$request->usuario_id]);

        // Como `select` devuelve un array de resultados, tomamos el primero
        return response()->json(['status' => HTTPStatus::Success, 'resultado' => $resultado], 200);
    }
}
