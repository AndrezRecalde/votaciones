<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CandidatoRequest;
use App\Http\Requests\StatusRequest;
use App\Interfaces\ActaInterface;
use App\Models\Candidato;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CandidatoController extends Controller
{
    private ActaInterface $actaRepository;

    public function __construct(ActaInterface $actaRepository)
    {
        $this->actaRepository = $actaRepository;
    }

    function getCandidatos(Request $request): JsonResponse
    {
        $candidatos = Candidato::from('candidatos as c')
            ->selectRaw('c.id, c.nombre_candidato, c.activo,
                         c.organizacion_id, org.nombre_organizacion,
                         org.numero_organizacion, org.sigla, org.color,
                         c.dignidad_id, d.nombre_dignidad,
                         dis.id as distrito_id, dis.tipo_distrito,
                         prov.id as provincia_id, prov.nombre_provincia,
                         cant.id as canton_id, cant.nombre_canton,
                         parr.id as parroquia_id, parr.nombre_parroquia')
            //->with(['distritosCandidatos'])
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('dignidades as d', 'd.id', 'c.dignidad_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('distritos as dis', 'dis.id', 'cd.distrito_id')
            ->join('provincias as prov', 'prov.id', 'cd.provincia_id')
            ->leftJoin('cantones as cant', 'cant.id', 'cd.canton_id')
            ->leftJoin('parroquias as parr', 'parr.id', 'cd.parroquia_id')
            ->dignidadId($request->dignidad_id)
            ->provinciaId($request->provincia_id)
            ->activo($request->activo)
            ->orderBy('d.id', 'ASC')
            ->orderBy('org.numero_organizacion', 'ASC')
            ->get();

        return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
    }

    function store(CandidatoRequest $request): JsonResponse
    {
        try {
            $candidato = Candidato::create($request->validated());
            $candidato->distritos()->attach(
                $request->distrito_id,
                [
                    'provincia_id'  =>  $request->provincia_id,
                    'canton_id'     =>  $request->canton_id,
                    'parroquia_id'  =>  $request->parroquia_id
                ]
            );
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Creacion], 201);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    public function update(CandidatoRequest $request, int $id)
    {
        $candidato = Candidato::find($id);

        if ($candidato) {
            $candidato->update($request->validated());

            if (
                $request->filled('distrito_id') ||
                $request->filled('provincia_id') ||
                $request->filled('canton_id') ||
                $request->filled('parroquia_id')
            ) {
                $candidato->distritos()->detach();
                $candidato->distritos()
                    ->sync([
                        $request->distrito_id => [
                            "provincia_id" =>   $request->provincia_id,
                            "canton_id"    =>   $request->canton_id,
                            "parroquia_id" =>   $request->parroquia_id
                        ]
                    ]);
            }

            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
        }
    }

    public function destroy(int $id)
    {
        $candidato = Candidato::find($id);

        if ($candidato) {
            $candidato->distritos()->detach();
            $candidato->delete();
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Eliminado], 201);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
        }
    }

    function updateActivo(StatusRequest $request, int $id): JsonResponse
    {
        $candidato = Candidato::find($id);
        if ($candidato) {
            $candidato->update($request->validated());
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
        }
    }




    public function getDignidadesForActaWithId(Request $request): JsonResponse
    {
        try {
            $dignidad = (int)$request->dignidad_id;
            $provincia = (int)$request->provincia_id;
            $canton = (int)$request->canton_id;
            $parroquia = (int)$request->parroquia_id;
            $acta = (int)$request->acta_id;

            /* Presidentes, Asambleístas Nacionales, Asambleístas Provinciales, Prefectos son a nivel de cada provincia */
            if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, 0, 0, $acta);
                /* Alcaldes son a nivel cantonal */
            } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, $canton, 0, $acta);
            } else if ($dignidad === 8) {
                $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, $canton, $parroquia, $acta);
            }

            return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Success, 'msg' => $th->getMessage()], 500);
        }
    }

    public function getDignidadesForActa(Request $request): JsonResponse
    {
        try {
            $dignidad = (int)$request->dignidad_id;
            $provincia = (int)$request->provincia_id;
            $canton = (int)$request->canton_id;
            $parroquia = (int)$request->parroquia_id;

            /* Presidentes, Asambleístas Nacionales, Asambleístas Provinciales, Prefectos son a nivel de cada provincia */
            if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, 0, 0);
                /* Alcaldes son a nivel cantonal */
            } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, $canton, 0);
            } else if ($dignidad === 8) {
                $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, $canton, $parroquia);
            }

            return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Success, 'msg' => $th->getMessage()], 500);
        }
    }

    function getCandidatosForActa(Request $request): JsonResponse
    {
        try {

            $dignidad = (int)$request->dignidad_id;
            $provincia = (int)$request->provincia_id;
            $canton = (int)$request->canton_id;
            $parroquia = (int)$request->parroquia_id;

            if ($request->acta_id) {
                $acta = (int)$request->acta_id;
                /* Presidentes, Asambleístas, Prefectos son a nivel de cada provincia */
                if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                    $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, 0, 0, $acta);
                    /* Alcaldes son a nivel cantonal */
                } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                    $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, $canton, 0, $acta);
                } else if ($dignidad === 8) {
                    $candidatos = $this->actaRepository->getDignidadesForActaWithId($dignidad, $provincia, $canton, $parroquia, $acta);
                }
            } else {
                /* Presidentes, Asambleístas, Prefectos son a nivel de cada provincia */
                if ($dignidad === 1 || $dignidad === 2 || $dignidad === 3 || $dignidad === 4) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, 0, 0);
                    /* Alcaldes son a nivel cantonal */
                } else if ($dignidad === 5 || $dignidad === 6 || $dignidad === 7) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, $canton, 0);
                } else if ($dignidad === 8) {
                    $candidatos = $this->actaRepository->getDignidadesForActa($dignidad, $provincia, $canton, $parroquia);
                }
            }
            return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Success, 'msg' => $th->getMessage()], 500);
        }
    }



    //TODO: Esta funcion puede reemplazar a getDignidadesForActaWithId y getDignidadesForActa
    public function getDignidadesForActa2(Request $request): JsonResponse
    {
        try {
            $dignidad = (int)$request->dignidad_id;
            $provincia = (int)$request->provincia_id;
            $canton = (int)$request->canton_id;
            $parroquia = (int)$request->parroquia_id;
            $acta = $request->acta_id !== null ? (int)$request->acta_id : null; // Soporte para null

            $niveles = match (true) {
                in_array($dignidad, [1, 2, 3, 4]) => [$provincia, 0, 0],
                in_array($dignidad, [5, 6, 7]) => [$provincia, $canton, 0],
                $dignidad === 8 => [$provincia, $canton, $parroquia],
                default => throw new \InvalidArgumentException('Dignidad no válida')
            };

            [$nivelProvincia, $nivelCanton, $nivelParroquia] = $niveles;

            // Llamada al repositorio con soporte para acta como null
            $candidatos = $this->actaRepository->getDignidadesForActaWithId(
                $dignidad,
                $nivelProvincia,
                $nivelCanton,
                $nivelParroquia,
                $acta
            );

            return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    //TODO: Esta funcion podria reemplazar a getCandidatosForActa

    function getCandidatosForActa2(Request $request): JsonResponse
    {
        try {
            $dignidad = (int)$request->dignidad_id;
            $provincia = (int)$request->provincia_id;
            $canton = (int)$request->canton_id;
            $parroquia = (int)$request->parroquia_id;
            $acta = $request->acta_id !== null ? (int)$request->acta_id : null;

            // Determinar los niveles de alcance según la dignidad
            $niveles = match (true) {
                in_array($dignidad, [1, 2, 3, 4]) => [$provincia, 0, 0], // Nivel provincial
                in_array($dignidad, [5, 6, 7]) => [$provincia, $canton, 0], // Nivel cantonal
                $dignidad === 8 => [$provincia, $canton, $parroquia], // Nivel parroquial
                default => throw new \InvalidArgumentException('Dignidad no válida'),
            };

            [$nivelProvincia, $nivelCanton, $nivelParroquia] = $niveles;

            // Llamada dinámica al repositorio dependiendo de si acta_id está presente o no
            $candidatos = $acta !== null
                ? $this->actaRepository->getDignidadesForActaWithId($dignidad, $nivelProvincia, $nivelCanton, $nivelParroquia, $acta)
                : $this->actaRepository->getDignidadesForActa($dignidad, $nivelProvincia, $nivelCanton, $nivelParroquia);

            return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }
}


// TODO: REALIZAR EXPORTACION DE ZONAS A LA BASE DE DATOS
// TODO: EJECUTAR FUNCION PARA HACER LAS JUNTAS
// TODO: REALIZAR CONTROLLER DE ACTA CONTROLLER
// TODO: REALIZAR CONTROLLER DE RESULTADOS
// TODO: REALIZAR CONTROLLER PARA EXPORTAR PDF Y EXCEL
// TODO: COLOCAR Y REALIZAR LA API DE CANDIDATO
