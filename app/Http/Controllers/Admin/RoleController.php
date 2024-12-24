<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    function getRoles(): JsonResponse
    {
        $roles = Role::orderBy('id', 'ASC')->get(['id', 'name']);

        return response()->json([
            'status' => HTTPStatus::Success,
            'roles' => $roles->filter(function ($value) {
                if ($value->id > 1) {
                    return $value;
                }
            })->values()
        ]);
    }
}
