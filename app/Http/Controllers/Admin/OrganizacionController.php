<?php

namespace App\Http\Controllers\Admin;

use File;
use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizacionRequest;
use App\Models\Organizacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class OrganizacionController extends Controller
{
    function getOrganizaciones(): JsonResponse
    {
        $organizaciones = Organizacion::get([
            'id',
            'nombre_organizacion',
            'numero_organizacion',
            'sigla',
            'color',
            'logo_url'
        ]);

        return response()->json([
            'status' => HTTPStatus::Success,
            'organizaciones' => $organizaciones
        ], 200);
    }

    function store(OrganizacionRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $organizacion = Organizacion::create($request->validated());

            // Subir y guardar el logo
            $logo = $request->file('logo_url');
            $filename = 'logo_' . uniqid() . '.' . $logo->getClientOriginalExtension();
            $save_path = '/logos/organizaciones/' . $organizacion->id . '/';
            $public_path = $save_path . $filename;
            $path = Storage::putFileAs(
                'public' . $save_path,
                $logo,
                $filename
            );
            if (!$path) {
                DB::rollback();
                return response()->json(['status' => HTTPStatus::Error, 'msg' => 'Error al cargar los archivos'], 500);
            }
            $organizacion->logo_url = $public_path;
            $organizacion->save();

            // Asociar aliados si están presentes en la solicitud
            if ($request->has('aliados') && is_array($request->aliados)) {
                $aliados = $request->input('aliados'); // Array de aliados con sus datos
                foreach ($aliados as $aliado) {
                    $organizacion->aliados()->attach($aliado['id']);
                }
            }

            DB::commit();
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Creacion], 201);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Success, 'msg' => $th->getMessage()], 500);
        }
    }

    function update(OrganizacionRequest $request, int $id): JsonResponse
    {
        DB::beginTransaction();
        $organizacion = Organizacion::find($id);

        try {
            if ($organizacion) {
                // Verificar si se está actualizando el logo
                if ($request->hasFile('logo_url')) {
                    $filename = $organizacion->logo_url;
                    if ($filename) {
                        Storage::disk('public')->delete($filename);
                    }
                    $organizacion->fill($request->validated());

                    $logo = $request->file('logo_url');
                    $filename = 'logo_' . uniqid() . '.' . $logo->getClientOriginalExtension();
                    $save_path = '/logos/organizaciones/' . $organizacion->id . '/';
                    $public_path = $save_path . $filename;
                    $path = Storage::putFileAs(
                        'public' . $save_path,
                        $logo,
                        $filename
                    );

                    if (!$path) {
                        DB::rollBack();
                        return response()->json(['status' => HTTPStatus::Error, 'msg' => 'Error al cargar los archivos'], 500);
                    }

                    $organizacion->logo_url = $public_path;
                }

                // Actualizar otros datos de la organización
                $organizacion->update(array_filter($request->validated()));

                // Actualizar aliados si están presentes en la solicitud
                if ($request->has('aliados') && is_array($request->aliados)) {
                    // Desvincular aliados existentes
                    $organizacion->aliados()->sync($request->input('aliados'));
                }

                DB::commit();
                return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
            } else {
                DB::rollBack();
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }


    function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        $organizacion = Organizacion::find($id);
        try {
            if ($organizacion) {
                if ($organizacion->logo_url) {
                    File::deleteDirectory(storage_path('app/public') . '/logos/organizaciones/' . $organizacion->id);
                    $organizacion->delete();
                    DB::commit();
                    return response()->json([
                        'status' => HTTPStatus::Success,
                        'msg' => HTTPStatus::Eliminado
                    ], 200);
                } else {
                    $organizacion->delete();
                    DB::commit();
                    return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Eliminado], 200);
                }
            } else {
                DB::rollback();
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
            }
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => $th->getMessage()
            ], 500);
        }
    }
}
