<?php

namespace App\Services;

use App\Models\Canton;
use Illuminate\Support\Facades\DB;

class EscrutinioService
{
    /**
     * Reemplaza el procedimiento almacenado getAvanceEscrutinio
     */
    public function calcularAvanceEscrutinio()
    {
        return DB::table('cantones as c')
            ->crossJoin('dignidades as d')
            ->select(
                'c.id as canton_id', 
                'c.nombre_canton', 
                'd.id as dignidad_id', 
                'd.nombre_dignidad'
            )
            ->selectRaw('
                COALESCE((
                    SELECT COUNT(ac.id) 
                    FROM actas AS ac
                    WHERE ac.canton_id = c.id AND ac.dignidad_id = d.id
                ), 0) AS ingresadas
            ')
            ->selectRaw('
                (
                    SELECT COUNT(j.id) 
                    FROM juntas AS j
                    INNER JOIN zonas AS z ON j.zona_id = z.id
                    INNER JOIN parroquias AS p ON p.id = z.parroquia_id
                    WHERE p.canton_id = c.id
                ) AS total
            ')
            ->where('c.id', '<>', 3)
            ->orderBy('d.id')
            ->orderBy('c.id')
            ->get();
    }

    public function obtenerEscrutinioPorDignidad()
    {
        return \App\Models\Acta::from('actas as a')
            ->selectRaw('COUNT(a.id) as total_ingresadas, d.nombre_dignidad,
                        CONCAT(ROUND((COUNT(a.id) / 1413 * 100), 2)) as porcentaje')
            ->rightJoin('dignidades as d', 'd.id', 'a.dignidad_id')
            ->where('d.activo', 1)
            ->groupBy('a.dignidad_id', 'd.nombre_dignidad')
            ->get();
    }

    public function obtenerResultadosPorCanton($dignidadId)
    {
        $cantones = Canton::with([
            'actas' => function ($query) use ($dignidadId) {
                $query->whereHas('dignidad', function ($dignidadQuery) use ($dignidadId) {
                    if ($dignidadId) {
                        $dignidadQuery->where('id', $dignidadId);
                    }
                })->with([
                    'dignidad:id,nombre_dignidad',
                    'candidatos' => function ($candidatoQuery) {
                        $candidatoQuery->select(
                            'candidatos.id',
                            'candidatos.nombre_candidato',
                            'organizaciones.color',
                            'actas.canton_id'
                        )
                            ->selectRaw('COALESCE(SUM(acta_candidato.num_votos), 0) as total_votos')
                            ->join('organizaciones', 'organizaciones.id', 'candidatos.organizacion_id')
                            ->join('actas', 'actas.id', '=', 'acta_candidato.acta_id')
                            ->groupBy('candidatos.id', 'candidatos.nombre_candidato', 'actas.canton_id', 'organizaciones.color')
                            ->orderBy('total_votos', 'desc');
                    }
                ]);
            }
        ])->get();

        return $cantones->map(function ($canton) {
            $totalVotosValidos = $canton->actas->sum('votos_validos');

            return [
                'id' => $canton->id,
                'nombre_canton' => $canton->nombre_canton,
                'total_votos_validos' => $totalVotosValidos,
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
    }

    public function obtenerResultadosPorZona($dignidadId)
    {
        $cantones = Canton::with('parroquias.zonas.actas.dignidad', 'parroquias.zonas.actas.candidatos.organizacion')->get();

        return $cantones->map(function ($canton) use ($dignidadId) {
            return [
                'id' => $canton->id,
                'nombre_canton' => $canton->nombre_canton,
                'zonas' => $canton->parroquias->flatMap(function ($parroquia) use ($dignidadId) {
                    return $parroquia->zonas->map(function ($zona) use ($dignidadId) {

                        $actasFiltradas = $zona->actas->filter(function ($acta) use ($dignidadId) {
                            return !$dignidadId || $acta->dignidad_id == $dignidadId;
                        });

                        $totalVotosValidos = $actasFiltradas->sum('votos_validos');

                        $dignidades = $actasFiltradas
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
                                        return [
                                            'id' => $candidatos->first()['id'],
                                            'nombre_candidato' => $candidatos->first()['nombre_candidato'],
                                            'color' => $candidatos->first()['color'],
                                            'total_votos' => $candidatos->sum('total_votos'),
                                        ];
                                    })
                                    ->values();

                                return [
                                    'nombre_dignidad' => $nombreDignidad,
                                    'candidatos' => $candidatos,
                                ];
                            })
                            ->values();

                        return [
                            'id' => $zona->id,
                            'nombre_zona' => $zona->nombre_zona,
                            'total_votos_validos' => $totalVotosValidos,
                            'dignidades' => $dignidades,
                        ];
                    });
                }),
            ];
        });
    }
}
