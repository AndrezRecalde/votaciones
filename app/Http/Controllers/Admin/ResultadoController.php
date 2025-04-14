<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\ActaCandidato;
use App\Models\Canton;
//use App\Models\Junta;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Exports\ResultadosPorZonaExport;
use Maatwebsite\Excel\Facades\Excel;

class ResultadoController extends Controller
{
    function getResultados(Request $request): JsonResponse
    {
        $candidatos = ActaCandidato::from('acta_candidato as ac')
            ->selectRaw('d.id as dignidad_id, d.nombre_dignidad, c.nombre_candidato,
                org.nombre_organizacion, org.numero_organizacion, org.sigla, org.color,
                SUM(ac.num_votos) as total_votos')
            ->join('actas as a', 'a.id', 'ac.acta_id')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('candidatos as c', 'c.id', 'ac.candidato_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('juntas as j', 'j.id', 'a.junta_id')
            ->join('zonas as z', 'z.id', 'a.zona_id')
            ->join('parroquias as parr', 'parr.id', 'a.parroquia_id')
            ->join('cantones as cant', 'cant.id', 'parr.canton_id')
            ->join('recintos as re', 're.id', 'j.recinto_id')
            ->dignidad($request->dignidad_id)
            ->provincia($request->provincia_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->recinto($request->recinto_id)
            ->zona($request->zona_id)
            ->cuadrada($request->cuadrada)
            ->legible($request->legible)
            ->groupBy('ac.candidato_id', 'd.nombre_dignidad')
            ->orderBy('total_votos', 'DESC')
            ->get();

        /* if (sizeof($candidatos) > 0) {
        return response()->json(['status' => 'success', 'candidatos' => $candidatos], 200);
    } else {
        return response()->json(['status' => 'success', 'msg' => 'Aún no existen datos'], 200);
    } */
        return response()->json(['status' => HTTPStatus::Success, 'candidatos' => $candidatos], 200);
    }

    function getTotalVotos(Request $request): JsonResponse
    {
        $totalDeVotos = ActaCandidato::from('acta_candidato as ac')
            ->selectRaw('
            SUM(a.votos_validos) as total_votos_validos,
            SUM(a.votos_blancos) as total_votos_blancos,
            SUM(a.votos_nulos) as total_votos_nulos
        ')
            ->join('actas as a', 'a.id', 'ac.acta_id')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('candidatos as c', 'c.id', 'ac.candidato_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('juntas as j', 'j.id', 'a.junta_id')
            ->join('zonas as z', 'z.id', 'a.zona_id')
            ->join('parroquias as parr', 'parr.id', 'a.parroquia_id')
            ->join('cantones as cant', 'cant.id', 'parr.canton_id')
            ->dignidad($request->dignidad_id)
            ->provincia($request->provincia_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->zona($request->zona_id)
            ->groupBy('ac.candidato_id')
            ->first();

        if ($totalDeVotos) {
            // Asegurarse de convertir a INT
            $totalDeVotos->total_votos_validos = (int) $totalDeVotos->total_votos_validos;
            $totalDeVotos->total_votos_blancos = (int) $totalDeVotos->total_votos_blancos;
            $totalDeVotos->total_votos_nulos = (int) $totalDeVotos->total_votos_nulos;

            return response()->json([
                'status' => HTTPStatus::Success,
                'totalDeVotos' => $totalDeVotos,
            ], 200);
        } else {
            return response()->json([
                'status' => HTTPStatus::Info,
                'msg' => 'Aún no existen datos',
            ], 200);
        }
    }


    function getTendenciaZonas(Request $request): JsonResponse
    {
        $tendencias = ActaCandidato::from('acta_candidato as ac')
            ->selectRaw('d.nombre_dignidad, c.nombre_candidato,
                org.nombre_organizacion, org.numero_organizacion, org.sigla, org.color,
                j.genero, j.junta_nombre, z.id,
                 SUM(ac.num_votos) as total_votos')
            ->join('actas as a', 'a.id', 'ac.acta_id')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('candidatos as c', 'c.id', 'ac.candidato_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->leftJoin('juntas as j', 'j.id', 'a.junta_id')
            ->leftJoin('zonas as z', 'z.id', 'a.zona_id')
            ->dignidad($request->dignidad_id)
            ->zona($request->zona_id)
            ->groupBy('ac.candidato_id', 'd.nombre_dignidad', 'j.genero', 'j.junta_nombre', 'z.id')
            ->orderBy('j.junta_nombre', 'ASC')
            ->orderBy('org.numero_organizacion', 'ASC')
            ->get();

        return response()->json(['status' => HTTPStatus::Success, 'tendencias' => $tendencias], 200);
    }

    function getTendencias(Request $request): JsonResponse
    {

        // Obtener parámetros de la solicitud
        $zonaId = $request->input('zona_id');
        $dignidadId = $request->input('dignidad_id');

        $tendencias = DB::table('juntas')
            ->join('candidatos', function ($join) use ($dignidadId) {
                $join->on('candidatos.dignidad_id', '=', DB::raw($dignidadId)); // Filtrar por dignidad_id
            })
            ->leftJoin('actas', function ($join) {
                $join->on('juntas.id', '=', 'actas.junta_id');
            })
            ->leftJoin('acta_candidato', function ($join) {
                $join->on('actas.id', '=', 'acta_candidato.acta_id')
                    ->on('acta_candidato.candidato_id', '=', 'candidatos.id');
            })
            ->leftJoin('organizaciones', function ($join) {
                $join->on('organizaciones.id', '=', 'candidatos.organizacion_id');
            })
            ->select(
                'juntas.junta_nombre',
                'candidatos.nombre_candidato',
                'organizaciones.color',
                DB::raw('COALESCE(SUM(acta_candidato.num_votos), 0) as total_votos')
            )
            ->where('juntas.zona_id', $zonaId) // Filtrar por zona
            ->groupBy('juntas.id', 'juntas.junta_nombre', 'candidatos.id', 'candidatos.nombre_candidato')
            ->orderBy('juntas.num_junta', 'asc')
            ->orderBy('candidatos.nombre_candidato', 'asc')
            ->get();

        return response()->json(['status' => HTTPStatus::Success, 'tendencias' => $tendencias], 200);
    }

    /* function getResultadosPorCanton(Request $request): JsonResponse
    {
        $cantones = Canton::with([
            'actas' => function ($query) {
                $query->whereHas('dignidad', function ($dignidadQuery) {
                    $dignidadQuery->where('activo', 1); // Filtro por dignidad.activo = 1
                })->with([
                    'dignidad:id,nombre_dignidad',
                    'candidatos' => function ($candidatoQuery) {
                        $candidatoQuery->select('candidatos.id', 'candidatos.nombre_candidato')
                                       ->selectRaw('COALESCE(SUM(acta_candidato.num_votos), 0) as total_votos')
                                       ->groupBy('candidatos.id', 'candidatos.nombre_candidato')
                                       ->orderBy('total_votos', 'desc');  // Ordenar por total_votos
                    }
                ]);
            }
        ])->get();

        // Reorganizamos los datos para el formato solicitado
        $resultados = $cantones->map(function ($canton) {
            return [
                'id' => $canton->id,
                'nombre_canton' => $canton->nombre_canton,
                'dignidades' => $canton->actas->groupBy('dignidad.nombre_dignidad')->map(function ($actas, $dignidad) {
                    $candidatos = $actas->flatMap(function ($acta) {
                        return $acta->candidatos->map(function ($candidato) {
                            return [
                                'id' => $candidato->id,
                                'nombre_candidato' => $candidato->nombre_candidato,
                                'total_votos' => $candidato->total_votos,
                            ];
                        });
                    })->unique('id')->values();

                    return [
                        'dignidad' => $dignidad,
                        'candidatos' => $candidatos,
                    ];
                })->values(),
            ];
        });

        return response()->json(['status' => HTTPStatus::Success, 'resultados' => $resultados], 200);
    } */

    function getResultadosPorCanton(Request $request): JsonResponse
    {
        $dignidadId = $request->dignidad_id; // Obtén el valor de dignidad_id del request

        $cantones = Canton::with([
            'actas' => function ($query) use ($dignidadId) {
                $query->whereHas('dignidad', function ($dignidadQuery) use ($dignidadId) {
                    if ($dignidadId) {
                        $dignidadQuery->where('id', $dignidadId); // Filtro por dignidad_id
                    }
                })->with([
                    'dignidad:id,nombre_dignidad',
                    'candidatos' => function ($candidatoQuery) {
                        $candidatoQuery->select(
                            'candidatos.id',
                            'candidatos.nombre_candidato',
                            'organizaciones.color',
                            'actas.canton_id' // Incluir el cantón para agrupar
                        )
                            ->selectRaw('COALESCE(SUM(acta_candidato.num_votos), 0) as total_votos')
                            ->join('organizaciones', 'organizaciones.id', 'candidatos.organizacion_id')
                            ->join('actas', 'actas.id', '=', 'acta_candidato.acta_id') // Unir con actas para obtener el canton_id
                            ->groupBy('candidatos.id', 'candidatos.nombre_candidato', 'actas.canton_id', 'organizaciones.color')
                            ->orderBy('total_votos', 'desc'); // Ordenar por total_votos
                    }
                ]);
            }
        ])->get();

        // Reorganizamos los datos para el formato solicitado
        $resultados = $cantones->map(function ($canton) {
            // Sumar los votos_validos de todas las actas del cantón
            $totalVotosValidos = $canton->actas->sum('votos_validos');

            return [
                'id' => $canton->id,
                'nombre_canton' => $canton->nombre_canton,
                'total_votos_validos' => $totalVotosValidos, // <-- aquí lo agregamos
                'dignidades' => $canton->actas->groupBy('dignidad.nombre_dignidad')->map(function ($actas, $dignidad) {
                    $candidatos = $actas->flatMap(function ($acta) {
                        return $acta->candidatos->map(function ($candidato) {
                            return [
                                'id' => $candidato->id,
                                'nombre_candidato' => $candidato->nombre_candidato,
                                'color' => $candidato->color,
                                'total_votos' => $candidato->total_votos,
                            ];
                        });
                    })->unique('id')->values();

                    return [
                        'dignidad' => $dignidad,
                        'candidatos' => $candidatos,
                    ];
                })->values(),
            ];
        });

        return response()->json(['status' => HTTPStatus::Success, 'resultados' => $resultados], 200);
    }

    public function getResultadosPorZona(Request $request): JsonResponse
{
    $dignidadId = $request->dignidad_id; // valor de dignidad_id desde el request

    $cantones = Canton::with('parroquias.zonas.actas.dignidad', 'parroquias.zonas.actas.candidatos.organizacion')->get();

    $resultados = $cantones->map(function ($canton) use ($dignidadId) {
        return [
            'id' => $canton->id,
            'nombre_canton' => $canton->nombre_canton,
            'zonas' => $canton->parroquias->flatMap(function ($parroquia) use ($dignidadId) {
                return $parroquia->zonas->map(function ($zona) use ($dignidadId) {
                    // Calcula el total de votos válidos de todas las actas de la zona
                    $totalVotosValidos = $zona->actas->sum('votos_validos');

                    // Agrupa candidatos por dignidad
                    $dignidades = $zona->actas
                        ->filter(function ($acta) use ($dignidadId) {
                            return !$dignidadId || $acta->dignidad_id == $dignidadId;
                        })
                        ->groupBy('dignidad.nombre_dignidad')
                        ->map(function ($actas, $nombreDignidad) {
                            $candidatos = $actas->flatMap(function ($acta) {
                                return $acta->candidatos->map(function ($candidato) use ($acta) {
                                    return [
                                        'id' => $candidato->id,
                                        'nombre_candidato' => $candidato->nombre_candidato,
                                        'color' => $candidato->organizacion->color ?? '#000000',
                                        'total_votos' => $candidato->pivot->num_votos,
                                    ];
                                });
                            })
                            ->groupBy('id')
                            ->map(function ($candidatos) {
                                $candidato = $candidatos->first();
                                return [
                                    'id' => $candidato['id'],
                                    'nombre_candidato' => $candidato['nombre_candidato'],
                                    'color' => $candidato['color'],
                                    'total_votos' => $candidatos->sum('total_votos'),
                                ];
                            })
                            ->sortByDesc('total_votos')
                            ->values();

                            return [
                                'dignidad' => $nombreDignidad,
                                'candidatos' => $candidatos,
                            ];
                        })
                        ->values();

                    return [
                        'nombre_zona' => $zona->nombre_zona,
                        'total_votos_validos' => $totalVotosValidos,
                        'dignidades' => $dignidades,
                    ];
                });
            }),
        ];
    });

    return response()->json(['status' => HTTPStatus::Success, 'resultados' => $resultados], 200);
}



    /* Exportaciones PDF */
    function exportResultadosPDF(Request $request)
    {
        $resultados = $request->resultados;
        $totalDeVotos = $request->totalDeVotos;
        $dignidad_id = $request->dignidad_id;

        // Datos para la vista del PDF
        $data = [
            'title'         => 'RESULTADOS ',
            'fecha'         => Carbon::now()->format('l jS \\of F Y h:i:s A'),
            'resultados'    => $resultados,
            'totalDeVotos'  => $totalDeVotos,
        ];

        if ($dignidad_id == 1 || $dignidad_id == 4 || $dignidad_id == 5) {
            $pdf = Pdf::loadView('resultados.binomios', $data);
        } else {
            $pdf = Pdf::loadView('resultados.webster', $data);
        }

        // Configuramos el tamaño y orientación del PDF, y lo descargamos
        return $pdf->setPaper('a4', 'portrait')->download('resultados.pdf');
    }

    function exportResultadosPDFPorZona(Request $request)
    {
        $resultados = $request->resultados;
        $totalDeVotos = $request->totalDeVotos;
        $dignidad_id = $request->dignidad_id;

        // Datos para la vista del PDF
        $data = [
            'title'         => 'RESULTADOS DETALLADO',
            'fecha'         => Carbon::now()->format('l jS \\of F Y h:i:s A'),
            'resultados'    => $resultados,
            'totalDeVotos'  => $totalDeVotos,
        ];

        /* if ($dignidad_id == 1 || $dignidad_id == 4 || $dignidad_id == 5) {
            $pdf = Pdf::loadView('resultados.detalle', $data);
        } else {
            $pdf = Pdf::loadView('resultados.webster', $data);
        } */
        $pdf = Pdf::loadView('resultados.detalle_b', $data);


        // Configuramos el tamaño y orientación del PDF, y lo descargamos
        return $pdf->setPaper('a4', 'portrait')->download('resultados.pdf');
    }

    public function exportarResultadosXLS(Request $request)
    {
        return Excel::download(new ResultadosPorZonaExport($request->dignidad_id), 'resultados_zonas.xlsx');
    }
}
