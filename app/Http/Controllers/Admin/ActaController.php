<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Exports\ActasExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\ActaRequest;
use App\Interfaces\ActaInterface;
use App\Models\Acta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ActaController extends Controller
{

    private ActaInterface $actaRepository;

    public function __construct(ActaInterface $actaRepository)
    {
        $this->actaRepository = $actaRepository;
    }

    function existeJuntaDignidad(Request $request): JsonResponse
    {
        $acta = Acta::from('actas as a')
            ->selectRaw('a.*, u.nombres_completos as creador, us.nombres_completos as actualizador')
            ->join('users as u', 'u.id', 'a.user_add')
            ->leftJoin('users as us', 'us.id', 'a.user_update')
            ->where('a.junta_id', $request->junta_id)
            ->where('a.dignidad_id', $request->dignidad_id)
            ->first();

        if ($acta) {
            return response()->json(['status' => true, 'acta' => $acta], 200);
        } else {
            return response()->json(['status' => false, 'msg' => HTTPStatus::NotFound], 200);
        }
    }

    function store(ActaRequest $request): JsonResponse
    {
        try {
            $acta = Acta::create($request->validated());
            $dignidad = (int)$request->dignidad_id;

            /* Presidentes, Asambleístas Nacionales, Asambleístas Provinciales, Prefectos */
            if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, 0, 0);
                /* Alcaldes son nivel cantonal */
            } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, 0);
                /* Juntas Parroquiales son a nivel parroquial */
            } else if ($dignidad === 8) {
                $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, $acta->parroquia_id);
            }

            $votos = [];
            $index = 0;

            foreach ($candidatos as $candidato) {
                $votos[$index] = $request->num_votos[$index];
                $acta->candidatos()->attach([
                    $candidato->id => ['num_votos' => !is_null($votos[$index]) ? $votos[$index] : 0]
                ]);
                $index += 1;
            }

            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::ActaCreated], 201);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    function update(ActaRequest $request): JsonResponse
    {
        $acta = Acta::find($request->id);
        try {
            if ($acta) {
                $acta->fill($request->validated());
                $acta->user_update = auth()->id();
                $acta->save();
                $dignidad = (int)$acta->dignidad_id;

                /* Presidentes, Asambleístas Nacionales, Asambleístas Provinciales, Prefectos */
                if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, 0, 0);
                    /* Alcaldes son a nivel cantonal */
                } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, 0);
                } else if ($dignidad === 8) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, $acta->parroquia_id);
                }

                $votos = [];
                $index = 0;
                $acta->candidatos()->detach();

                foreach ($candidatos as $candidato) {
                    $votos[$index] = $request->num_votos[$index];
                    $acta->candidatos()->attach([
                        $candidato->id => ['num_votos' => !is_null($votos[$index]) ? $votos[$index] : 0]
                    ]);
                    $index += 1;
                }
                return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::ActaUpdated], 201);
            } else {
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Success, 'msg' => $th->getMessage()], 500);
        }
    }

    function destroy(int $id): JsonResponse
    {
        $acta = Acta::find($id);

        if ($acta) {
            $acta->candidatos()->detach();
            $acta->delete();
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Eliminado], 200);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
        }
    }

    function getTotalActasIngresadas(Request $request): JsonResponse
    {
        $totalActasIngresadas = Acta::from('actas as a')
            ->selectRaw('COUNT(a.id) AS digitadas')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('provincias as prov', 'prov.id', 'a.provincia_id')
            ->join('cantones as cant', 'cant.id', 'a.canton_id')
            ->join('parroquias as parr', 'parr.id', 'a.parroquia_id')
            ->dignidad($request->dignidad_id)
            ->provincia($request->provincia_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->first();

        return response()->json([
            'status' => HTTPStatus::Success,
            'totalActasIngresadas' => $totalActasIngresadas
        ], 200);
    }

    // INFO: SE SUPRIME EL METODO GETALLACTAS
    function getActas(Request $request): JsonResponse
    {
        $actas = Acta::from('actas as a')
            ->selectRaw('a.id, j.junta_nombre, a.cod_cne,
                        a.votos_validos, a.votos_blancos, a.votos_nulos,
                        a.cuadrada, a.legible, d.nombre_dignidad,
                        z.nombre_zona, parr.nombre_parroquia, cant.nombre_canton,
                        r.nombre_recinto, u.nombres_completos')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('juntas as j', 'j.id', 'a.junta_id')
            ->join('zonas as z', 'z.id', 'j.zona_id')
            ->join('parroquias as parr', 'parr.id', 'z.parroquia_id')
            ->join('cantones as cant', 'cant.id', 'parr.canton_id')
            ->leftJoin('users as u', 'u.id', 'a.user_add')
            ->leftJoin('recintos as r', 'r.id', 'j.recinto_id')
            ->dignidad($request->dignidad_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->cuadrada($request->tipo_acta)
            ->orderBy('parr.nombre_parroquia', 'ASC')
            ->orderBy('j.junta_nombre', 'ASC')
            ->get();

        return response()->json(['status' => HTTPStatus::Success, 'actas' => $actas], 200);
    }

    //INFO: SE SUPRIME EL METODO EXPORTALLACTAS
    function exportExcelActas(Request $request): BinaryFileResponse
    {
        return Excel::download(new ActasExport(
            $request->dignidad_id,
            $request->canton_id,
            $request->parroquia_id,
            $request->tipo_acta
        ), 'actasExport.xlsx');
    }
}
