<?php

namespace App\Http\Controllers\Auth;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function login(LoginRequest $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->validated())) {
                return response()->json([
                    'msg' => HTTPStatus::LoginFailed
                ], 404);
            }

            $usuario = User::from('users as u')
                ->selectRaw('u.id, u.nombres_completos, u.dni, u.activo,
                             u.provincia_id, p.nombre_provincia,
                             p.cod_cne_prov as cod_cne,
                             u.canton_id, c.nombre_canton, u.es_responsable,
                             r.id as role_id, r.name as role')
                ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
                ->join('roles as r', 'r.id', 'mhr.role_id')
                ->join('provincias as p', 'p.id', 'u.provincia_id')
                ->leftJoin('cantones as c', 'c.id', 'u.canton_id')
                ->where('u.dni', $request->dni)
                ->where('u.activo', 1)
                ->first();

            if ($usuario) {
                $token = $usuario->createToken('auth_token')->plainTextToken;
                return response()->json([
                    'status'        =>  'success',
                    'access_token'  =>  $token,
                    'token_type'    =>  'Bearer',
                    'usuario'       =>  $usuario
                ]);
            } else {
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::UserNotActive], 404);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function refresh(): JsonResponse
    {
        $authUserId = Auth::id();
        $usuario = User::from('users as u')
            ->selectRaw('u.id, u.nombres_completos, u.dni, u.activo,
                         u.provincia_id, p.nombre_provincia,
                         p.cod_cne_prov as cod_cne,
                         u.canton_id, c.nombre_canton, u.es_responsable,
                         r.id as role_id, r.name as role')
            ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
            ->join('roles as r', 'r.id', 'mhr.role_id')
            ->join('provincias as p', 'p.id', 'u.provincia_id')
            ->leftJoin('cantones as c', 'c.id', 'u.canton_id')
            ->where('u.id', $authUserId)
            ->where('u.activo', 1)
            ->first();

        if ($usuario) {
            $usuario->tokens()->delete();
            $token = $usuario->createToken('auth_token')->plainTextToken;
            return response()->json([
                "usuario"       => $usuario,
                "token_type"    => 'Bearer',
                "access_token"  => $token,
            ]);
        } else {
            return response()->json([
                "status" => HTTPStatus::Error,
                "msg"    => HTTPStatus::UserNotActive
            ]);
        }
    }

    /* function refresh(): JsonResponse
    {
        $usuario = Auth::user(); // Obtener el usuario autenticado

        if ($usuario && $usuario->activo) {
            // Eliminar tokens previos y generar uno nuevo
            $usuario->tokens()->delete();
            $token = $usuario->createToken('auth_token')->plainTextToken;

            // Construir los datos necesarios para la respuesta
            $usuario->load(['roles', 'provincia', 'canton']); // Relacionar tablas necesarias

            return response()->json([
                "usuario"    => $usuario,
                "token_type" => 'Bearer',
                "token"      => $token,
            ]);
        }

        return response()->json([
            "status" => HTTPStatus::Error,
            "msg"    => HTTPStatus::UserNotActive,
        ], 403);
    } */

    function profile(): JsonResponse
    {
        $profile = User::from('users as u')
            ->selectRaw('u.id, u.nombres_completos, u.dni, u.activo,
                         u.provincia_id, p.nombre_provincia,
                         p.cod_cne_prov as cod_cne,
                         u.canton_id, c.nombre_canton, u.es_responsable,
                         r.id as role_id, r.name as role')
            ->join('model_has_roles as mhr', 'mhr.model_id', 'u.id')
            ->join('roles as r', 'r.id', 'mhr.role_id')
            ->join('provincias as p', 'p.id', 'u.provincia_id')
            ->leftJoin('cantones as c', 'c.id', 'u.canton_id')
            ->where('u.dni', Auth::user()->id)
            ->where('u.activo', 1)
            ->first();

        return response()->json([
            'status'    => HTTPStatus::Success,
            'profile'   => $profile
        ]);
    }

    function logout(Request $request): JsonResponse
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        if ($user) {
            // Revocar todos los tokens del usuario
            $user->tokens()->delete();
        }

        // Cerrar la sesión (si se usa guard 'web')
        Auth::guard('web')->logout();

        // Invalidar la sesión del usuario
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Eliminar la cookie de autenticación (para Sanctum basado en cookies)
        return response()->json([
            'status' => 200,
            'msg'    => 'Sesión finalizada'
        ])->cookie('laravel_session', '', -1); // Expira inmediatamente
    }
}
