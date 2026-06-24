<?php

namespace App\Services;

use App\Models\Organizacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class OrganizacionService
{
    public function crearOrganizacion(array $data, $logoFile, array $aliados = [])
    {
        return DB::transaction(function () use ($data, $logoFile, $aliados) {
            $organizacion = Organizacion::create($data);

            if ($logoFile) {
                $filename = 'logo_' . uniqid() . '.' . $logoFile->getClientOriginalExtension();
                $save_path = '/logos/organizaciones/' . $organizacion->id . '/';
                
                $path = Storage::putFileAs(
                    'public' . $save_path,
                    $logoFile,
                    $filename
                );

                if (!$path) {
                    throw new \Exception('Error al cargar los archivos');
                }

                $organizacion->logo_url = $save_path . $filename;
                $organizacion->save();
            }

            if (!empty($aliados)) {
                $idsAliados = array_map(function($aliado) { return $aliado['id'] ?? $aliado; }, $aliados);
                $organizacion->aliados()->attach($idsAliados);
            }

            return $organizacion;
        });
    }

    public function actualizarOrganizacion(Organizacion $organizacion, array $data, $logoFile = null, array $aliados = [])
    {
        return DB::transaction(function () use ($organizacion, $data, $logoFile, $aliados) {
            if ($logoFile) {
                if ($organizacion->logo_url) {
                    Storage::disk('public')->delete($organizacion->logo_url);
                }

                $filename = 'logo_' . uniqid() . '.' . $logoFile->getClientOriginalExtension();
                $save_path = '/logos/organizaciones/' . $organizacion->id . '/';

                $path = Storage::putFileAs(
                    'public' . $save_path,
                    $logoFile,
                    $filename
                );

                if (!$path) {
                    throw new \Exception('Error al cargar los archivos');
                }

                $data['logo_url'] = $save_path . $filename;
            } else {
                unset($data['logo_url']);
            }

            $organizacion->update($data);

            if (!empty($aliados)) {
                $idsAliados = array_map(function($aliado) { return is_array($aliado) ? $aliado['id'] : $aliado; }, $aliados);
                $organizacion->aliados()->sync($idsAliados);
            }

            return $organizacion;
        });
    }

    public function eliminarOrganizacion(Organizacion $organizacion)
    {
        return DB::transaction(function () use ($organizacion) {
            if ($organizacion->logo_url) {
                File::deleteDirectory(storage_path('app/public') . '/logos/organizaciones/' . $organizacion->id);
            }
            
            $organizacion->delete();
            return true;
        });
    }
}
