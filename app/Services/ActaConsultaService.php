<?php

namespace App\Services;

use App\Models\ActaConsulta;
use App\Models\ActaConsultaPregunta;
use App\Models\PreguntaConsulta;
use Illuminate\Support\Facades\DB;
use Exception;

class ActaConsultaService
{
    public function obtenerActasConsulta(array $filtros, int $perPage)
    {
        $query = ActaConsulta::query()
            ->with([
                'provincia', 'canton', 'parroquia', 'zona', 'junta.recinto',
                'preguntas.pregunta', 'preguntas.actaConsulta', 'userAdd', 'userUpdate',
            ]);

        if (isset($filtros['provincia_id'])) {
            $query->porProvincia((int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $query->porCanton((int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $query->porParroquia((int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $query->porZona((int) $filtros['zona_id']);
        }

        $query->orderBy('id', 'desc');
        return $query->paginate($perPage);
    }

    public function buscarPorJuntaParaDigitador(int $juntaId)
    {
        $acta = ActaConsulta::with([
            'provincia', 'canton', 'parroquia', 'zona', 'junta.recinto',
            'preguntas.pregunta', 'userAdd', 'userUpdate',
        ])
        ->where('junta_id', $juntaId)
        ->activas()
        ->first();

        if ($acta) {
            $ubicacion = [
                'provincia_id' => $acta->provincia_id,
                'canton_id'    => $acta->canton_id,
                'parroquia_id' => $acta->parroquia_id,
                'zona_id'      => $acta->zona_id,
                'junta_id'     => $juntaId,
                'recinto_id'   => $acta->junta->recinto_id ?? null,
                'nombres'      => [
                    'provincia' => $acta->provincia->nombre_provincia ?? null,
                    'canton'    => $acta->canton->nombre_canton ?? null,
                    'parroquia' => $acta->parroquia->nombre_parroquia ?? null,
                    'zona'      => $acta->zona->nombre_zona ?? null,
                    'junta'     => $acta->junta->junta_nombre ?? null,
                    'recinto'   => optional($acta->junta->recinto)->nombre_recinto,
                ],
            ];
        } else {
            $u = DB::table('juntas as j')
                ->select(
                    'j.id as junta_id', 'z.id as zona_id', 'p.id as parroquia_id',
                    'c.id as canton_id', 'pr.id as provincia_id', 'j.recinto_id',
                    'j.junta_nombre', 'z.nombre_zona', 'p.nombre_parroquia',
                    'c.nombre_canton', 'pr.nombre_provincia', 'r.nombre_recinto'
                )
                ->join('zonas as z', 'j.zona_id', '=', 'z.id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
                ->leftJoin('recintos as r', 'j.recinto_id', '=', 'r.id')
                ->where('j.id', $juntaId)
                ->first();

            if (!$u) {
                throw new Exception('No se encontró información de ubicación para la junta');
            }

            $ubicacion = [
                'provincia_id' => $u->provincia_id,
                'canton_id'    => $u->canton_id,
                'parroquia_id' => $u->parroquia_id,
                'zona_id'      => $u->zona_id,
                'junta_id'     => $juntaId,
                'recinto_id'   => $u->recinto_id,
                'nombres'      => [
                    'provincia' => $u->nombre_provincia,
                    'canton'    => $u->nombre_canton,
                    'parroquia' => $u->nombre_parroquia,
                    'zona'      => $u->nombre_zona,
                    'junta'     => $u->junta_nombre,
                    'recinto'   => $u->nombre_recinto,
                ],
            ];
        }

        $catalogoPreguntas = PreguntaConsulta::select('id', 'casillero_pregunta', 'texto_pregunta')
            ->where('activo', true)
            ->orderBy('casillero_pregunta')
            ->get();

        $preguntasExistentes = [];
        if ($acta) {
            foreach ($acta->preguntas as $p) {
                $preguntasExistentes[$p->pregunta_id] = $p;
            }
        }

        $votosValidosActa = $acta?->votos_validos;

        $preguntas = $catalogoPreguntas->map(function ($row) use ($preguntasExistentes, $votosValidosActa) {
            $reg = $preguntasExistentes[$row->id] ?? null;
            $validos = $votosValidosActa;

            return [
                'acta_consulta_pregunta_id' => $reg->id ?? null,
                'pregunta_id'        => $row->id,
                'casillero_pregunta' => $row->casillero_pregunta,
                'texto_pregunta'     => $row->texto_pregunta,
                'votos_si'           => $reg?->votos_si ?? null,
                'votos_no'           => $reg?->votos_no ?? null,
                'votos_blancos'      => $reg?->votos_blancos ?? null,
                'votos_nulos'        => $reg?->votos_nulos ?? null,
                'votos_validos'      => $validos ?? null,
                'porcentaje_si'      => ($validos && $validos > 0 && $reg) ? round(($reg->votos_si / $validos) * 100, 2) : null,
                'porcentaje_no'      => ($validos && $validos > 0 && $reg) ? round(($reg->votos_no / $validos) * 100, 2) : null,
            ];
        });

        $infoActa = [
            'existe_acta'   => (bool) $acta,
            'acta_id'       => $acta->id ?? null,
            'cod_cne'       => $acta->cod_cne ?? null,
            'votos_validos' => $acta?->votos_validos ?? null,
            'cuadrada'      => $acta?->cuadrada ?? null,
            'legible'       => $acta?->legible ?? null,
            'estado'        => $acta?->estado ?? null,
            'user_add'      => $acta?->userAdd->nombres_completos ?? null,
            'user_update'   => $acta?->userUpdate->nombres_completos ?? null,
        ];

        return [
            'info_acta' => $infoActa,
            'ubicacion' => $ubicacion,
            'preguntas' => $preguntas,
            'msg'       => $acta 
                ? 'Se encontró acta para la junta y se listan sus preguntas (con o sin votos).'
                : 'No existe acta para esta junta. Todas las preguntas aparecen sin votos.',
            'acta' => $acta
        ];
    }

    public function crearActaConsulta(array $data, array $payload, int $userId)
    {
        $juntaId = (int) $data['junta_id'];

        $geo = DB::table('juntas as j')
            ->select(
                'j.id as junta_id', 'z.id as zona_id', 'p.id as parroquia_id',
                'c.id as canton_id', 'pr.id as provincia_id'
            )
            ->join('zonas as z', 'j.zona_id', '=', 'z.id')
            ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
            ->join('cantones as c', 'p.canton_id', '=', 'c.id')
            ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
            ->where('j.id', $juntaId)
            ->first();

        if (!$geo) {
            throw new Exception('No se pudo derivar la geografía desde la junta.');
        }

        $actaExistente = ActaConsulta::where('junta_id', $juntaId)
            ->where('estado', true)
            ->first();

        if ($actaExistente) {
            throw new Exception('Ya existe un acta activa para esta junta.', 422);
        }

        return DB::transaction(function () use ($data, $geo, $payload, $userId) {
            $acta = ActaConsulta::create([
                'provincia_id'  => $geo->provincia_id,
                'canton_id'     => $geo->canton_id,
                'parroquia_id'  => $geo->parroquia_id,
                'zona_id'       => $geo->zona_id,
                'junta_id'      => $geo->junta_id,
                'cod_cne'       => $data['cod_cne'] ?? null,
                'votos_validos' => (int) ($data['votos_validos'] ?? 0),
                'cuadrada'      => $data['cuadrada'] ?? true,
                'legible'       => $data['legible'] ?? true,
                'estado'        => $data['estado'] ?? true,
                'user_add'      => $userId,
            ]);

            $inserted = 0;
            $updated  = 0;

            if (!empty($payload)) {
                foreach ($payload as &$p) {
                    $p['acta_consulta_id'] = $acta->id;
                }

                $ids = collect($payload)->pluck('pregunta_id')->all();
                $existentes = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                    ->whereIn('pregunta_id', $ids)
                    ->pluck('id', 'pregunta_id');

                $inserted = count(array_diff($ids, $existentes->keys()->all()));
                $updated  = count(array_intersect($ids, $existentes->keys()->all()));

                DB::table('acta_consulta_preguntas')->upsert(
                    $payload,
                    ['acta_consulta_id', 'pregunta_id'],
                    ['votos_blancos', 'votos_nulos', 'votos_si', 'votos_no', 'updated_at']
                );
            }

            return [
                'acta_id'       => $acta->id,
                'votos_validos' => (int) $acta->votos_validos,
                'resumen' => [
                    'preguntas_enviadas' => count($payload),
                    'insertadas'         => $inserted,
                    'actualizadas'       => $updated,
                ],
            ];
        });
    }

    public function actualizarActaConsulta(int $id, array $data, array $payload, int $userId, bool $sync)
    {
        $acta = ActaConsulta::find($id);
        if (!$acta) {
            throw new Exception('Acta no encontrada.', 404);
        }

        return DB::transaction(function () use ($acta, $data, $payload, $userId, $sync) {
            $acta->update([
                'cod_cne'       => isset($data['cod_cne']) ? $data['cod_cne'] : $acta->cod_cne,
                'votos_validos' => isset($data['votos_validos']) ? (int) $data['votos_validos'] : $acta->votos_validos,
                'cuadrada'      => isset($data['cuadrada']) ? (bool) $data['cuadrada'] : $acta->cuadrada,
                'legible'       => isset($data['legible']) ? (bool) $data['legible'] : $acta->legible,
                'estado'        => isset($data['estado']) ? (bool) $data['estado'] : $acta->estado,
                'user_update'   => $userId,
            ]);

            $inserted        = 0;
            $updated         = 0;
            $synced_deleted  = 0;

            if (!empty($payload)) {
                foreach ($payload as &$p) {
                    $p['acta_consulta_id'] = $acta->id;
                }

                $ids = collect($payload)->pluck('pregunta_id')->all();
                $existentes = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                    ->whereIn('pregunta_id', $ids)
                    ->pluck('id', 'pregunta_id');

                $inserted = count(array_diff($ids, $existentes->keys()->all()));
                $updated  = count(array_intersect($ids, $existentes->keys()->all()));

                DB::table('acta_consulta_preguntas')->upsert(
                    $payload,
                    ['acta_consulta_id', 'pregunta_id'],
                    ['votos_blancos', 'votos_nulos', 'votos_si', 'votos_no', 'updated_at']
                );

                if ($sync) {
                    $synced_deleted = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)
                        ->whereNotIn('pregunta_id', $ids)
                        ->delete();
                }
            } else {
                if ($sync) {
                    $synced_deleted = ActaConsultaPregunta::where('acta_consulta_id', $acta->id)->delete();
                }
            }

            return [
                'acta_id'       => $acta->id,
                'votos_validos' => (int) $acta->votos_validos,
                'resumen'       => [
                    'preguntas_enviadas'   => count($payload),
                    'insertadas'           => $inserted,
                    'actualizadas'         => $updated,
                    'eliminadas_por_sync'  => $synced_deleted,
                ],
            ];
        });
    }

    public function eliminarActaConsulta(int $id)
    {
        $acta = ActaConsulta::find($id);
        if (!$acta) {
            throw new Exception('Acta no encontrada.', 404);
        }
        $acta->delete();
        return $id;
    }

    public function obtenerResumenVotos(int $id, ?int $juntaId)
    {
        if ($juntaId) {
            $acta = ActaConsulta::with([
                'preguntas.pregunta', 'preguntas.actaConsulta',
                'provincia', 'canton', 'parroquia', 'zona', 'junta',
            ])
            ->activas()
            ->where('junta_id', $juntaId)
            ->firstOrFail();
        } else {
            $acta = ActaConsulta::with([
                'preguntas.pregunta', 'preguntas.actaConsulta',
                'provincia', 'canton', 'parroquia', 'zona', 'junta',
            ])->findOrFail($id);
        }

        $detalles = $acta->preguntas->sortBy(function ($p) {
            return $p->pregunta->casillero_pregunta ?? $p->pregunta_id;
        })->values();

        $resumen = $detalles->map(function (ActaConsultaPregunta $p) {
            return [
                'acta_consulta_pregunta_id' => $p->id,
                'pregunta_id'               => $p->pregunta_id,
                'casillero_pregunta'        => $p->pregunta->casillero_pregunta ?? null,
                'texto_pregunta'            => $p->pregunta->texto_pregunta ?? null,
                'votos_si'      => (int) $p->votos_si,
                'votos_no'      => (int) $p->votos_no,
                'votos_blancos' => (int) $p->votos_blancos,
                'votos_nulos'   => (int) $p->votos_nulos,
                'porcentaje_si' => $p->porcentaje_si,
                'porcentaje_no' => $p->porcentaje_no,
            ];
        });

        return [
            'acta_id'  => $acta->id,
            'junta_id' => $acta->junta_id,
            'ubicacion' => [
                'provincia_id' => $acta->provincia_id,
                'canton_id'    => $acta->canton_id,
                'parroquia_id' => $acta->parroquia_id,
                'zona_id'      => $acta->zona_id,
            ],
            'totales' => [
                'validos' => (int) $acta->votos_validos,
                'blancos' => (int) $detalles->sum('votos_blancos'),
                'nulos'   => (int) $detalles->sum('votos_nulos'),
            ],
            'resumen_preguntas' => $resumen,
        ];
    }

    public function obtenerEstadisticas(array $filtros)
    {
        $encabezadosQuery = ActaConsulta::query()->activas();

        if (isset($filtros['provincia_id'])) {
            $encabezadosQuery->porProvincia((int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $encabezadosQuery->porCanton((int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $encabezadosQuery->porParroquia((int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $encabezadosQuery->porZona((int) $filtros['zona_id']);
        }

        $totalActasEncabezado = (clone $encabezadosQuery)->count();
        $totalJuntasConActa   = (clone $encabezadosQuery)->distinct('junta_id')->count('junta_id');
        $actasCuadradas       = (clone $encabezadosQuery)->cuadrada()->count();
        $actasLegibles        = (clone $encabezadosQuery)->legible()->count();

        $totalVotosValidos = (int) (clone $encabezadosQuery)->sum('votos_validos');

        $detalleQuery = DB::table('acta_consulta_preguntas as d')
            ->join('actas_consulta as a', 'd.acta_consulta_id', '=', 'a.id')
            ->where('a.estado', true);

        if (isset($filtros['provincia_id'])) {
            $detalleQuery->where('a.provincia_id', (int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $detalleQuery->where('a.canton_id', (int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $detalleQuery->where('a.parroquia_id', (int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $detalleQuery->where('a.zona_id', (int) $filtros['zona_id']);
        }

        $totalesDetalle = (clone $detalleQuery)
            ->selectRaw('
                COUNT(d.id) as filas_preguntas,
                SUM(d.votos_blancos) as sum_votos_blancos,
                SUM(d.votos_nulos)   as sum_votos_nulos
            ')
            ->first();

        $totalFilasPreguntas = (int) ($totalesDetalle->filas_preguntas ?? 0);
        $totalVotosBlancos   = (int) ($totalesDetalle->sum_votos_blancos ?? 0);
        $totalVotosNulos     = (int) ($totalesDetalle->sum_votos_nulos ?? 0);

        $electoresQuery = DB::table('juntas as j')
            ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
            ->join('zonas as z', 'z.id', '=', 'j.zona_id')
            ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
            ->join('cantones as c', 'p.canton_id', '=', 'c.id')
            ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id');

        if (isset($filtros['provincia_id'])) {
            $electoresQuery->where('pr.id', (int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $electoresQuery->where('c.id', (int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $electoresQuery->where('p.id', (int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $electoresQuery->where('z.id', (int) $filtros['zona_id']);
        }

        $totalNumElectores = (int) $electoresQuery->sum('r.num_electores');
        $porcentajeValidosSobreElectores = $totalNumElectores > 0
            ? round(($totalVotosValidos / $totalNumElectores) * 100, 2)
            : 0.0;

        $porProvincia = [];
        if (!isset($filtros['provincia_id'])) {
            $porProvincia = DB::table('actas_consulta as a')
                ->selectRaw('
                    pr.id as provincia_id,
                    pr.nombre_provincia,
                    COUNT(DISTINCT a.id) as total_actas_encabezado,
                    COUNT(DISTINCT a.junta_id) as total_juntas,
                    SUM(a.votos_validos) as total_votos_validos,
                    SUM(d.votos_blancos) as total_votos_blancos,
                    SUM(d.votos_nulos) as total_votos_nulos
                ')
                ->join('provincias as pr', 'a.provincia_id', '=', 'pr.id')
                ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                ->where('a.estado', true)
                ->groupBy('pr.id', 'pr.nombre_provincia')
                ->get();

            $electoresPorProvincia = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id')
                ->select('pr.id as provincia_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                ->groupBy('pr.id')
                ->pluck('total_num_electores', 'provincia_id');

            $porProvincia = $porProvincia->map(function ($row) use ($electoresPorProvincia) {
                $den = (int) ($electoresPorProvincia[$row->provincia_id] ?? 0);
                $row->total_num_electores = $den;
                $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                return $row;
            });
        }

        $porCanton = [];
        if (isset($filtros['provincia_id']) && !isset($filtros['canton_id'])) {
            $porCanton = DB::table('actas_consulta as a')
                ->selectRaw('
                    c.id as canton_id,
                    c.nombre_canton,
                    COUNT(DISTINCT a.id) as total_actas_encabezado,
                    COUNT(DISTINCT a.junta_id) as total_juntas,
                    SUM(a.votos_validos) as total_votos_validos,
                    SUM(d.votos_blancos) as total_votos_blancos,
                    SUM(d.votos_nulos) as total_votos_nulos
                ')
                ->join('cantones as c', 'a.canton_id', '=', 'c.id')
                ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                ->where('a.estado', true)
                ->where('a.provincia_id', (int) $filtros['provincia_id'])
                ->groupBy('c.id', 'c.nombre_canton')
                ->get();

            $electoresPorCanton = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->join('cantones as c', 'p.canton_id', '=', 'c.id')
                ->select('c.id as canton_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                ->where('c.provincia_id', (int) $filtros['provincia_id'])
                ->groupBy('c.id')
                ->pluck('total_num_electores', 'canton_id');

            $porCanton = $porCanton->map(function ($row) use ($electoresPorCanton) {
                $den = (int) ($electoresPorCanton[$row->canton_id] ?? 0);
                $row->total_num_electores = $den;
                $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                return $row;
            });
        }

        $porParroquia = [];
        if (isset($filtros['canton_id']) && !isset($filtros['parroquia_id'])) {
            $porParroquia = DB::table('actas_consulta as a')
                ->selectRaw('
                    p.id as parroquia_id,
                    p.nombre_parroquia,
                    p.tipo,
                    COUNT(DISTINCT a.id) as total_actas_encabezado,
                    COUNT(DISTINCT a.junta_id) as total_juntas,
                    SUM(a.votos_validos) as total_votos_validos,
                    SUM(d.votos_blancos) as total_votos_blancos,
                    SUM(d.votos_nulos) as total_votos_nulos
                ')
                ->join('parroquias as p', 'a.parroquia_id', '=', 'p.id')
                ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                ->where('a.estado', true)
                ->where('a.canton_id', (int) $filtros['canton_id'])
                ->groupBy('p.id', 'p.nombre_parroquia', 'p.tipo')
                ->get();

            $electoresPorParroquia = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
                ->select('p.id as parroquia_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                ->where('p.canton_id', (int) $filtros['canton_id'])
                ->groupBy('p.id')
                ->pluck('total_num_electores', 'parroquia_id');

            $porParroquia = $porParroquia->map(function ($row) use ($electoresPorParroquia) {
                $den = (int) ($electoresPorParroquia[$row->parroquia_id] ?? 0);
                $row->total_num_electores = $den;
                $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                return $row;
            });
        }

        $porZona = [];
        if (isset($filtros['parroquia_id']) && !isset($filtros['zona_id'])) {
            $porZona = DB::table('actas_consulta as a')
                ->selectRaw('
                    z.id as zona_id,
                    z.nombre_zona,
                    COUNT(DISTINCT a.id) as total_actas_encabezado,
                    COUNT(DISTINCT a.junta_id) as total_juntas,
                    SUM(a.votos_validos) as total_votos_validos,
                    SUM(d.votos_blancos) as total_votos_blancos,
                    SUM(d.votos_nulos) as total_votos_nulos
                ')
                ->join('zonas as z', 'a.zona_id', '=', 'z.id')
                ->leftJoin('acta_consulta_preguntas as d', 'd.acta_consulta_id', '=', 'a.id')
                ->where('a.estado', true)
                ->where('a.parroquia_id', (int) $filtros['parroquia_id'])
                ->groupBy('z.id', 'z.nombre_zona')
                ->get();

            $electoresPorZona = DB::table('juntas as j')
                ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
                ->join('zonas as z', 'z.id', '=', 'j.zona_id')
                ->select('z.id as zona_id', DB::raw('SUM(r.num_electores) as total_num_electores'))
                ->where('z.parroquia_id', (int) $filtros['parroquia_id'])
                ->groupBy('z.id')
                ->pluck('total_num_electores', 'zona_id');

            $porZona = $porZona->map(function ($row) use ($electoresPorZona) {
                $den = (int) ($electoresPorZona[$row->zona_id] ?? 0);
                $row->total_num_electores = $den;
                $row->porcentaje_validos = $den > 0 ? round(($row->total_votos_validos / $den) * 100, 2) : 0.0;
                return $row;
            });
        }

        return [
            'filtros_aplicados' => $filtros,
            'resumen_general' => [
                'total_actas_encabezado'  => $totalActasEncabezado,
                'total_filas_preguntas'   => $totalFilasPreguntas,
                'total_juntas_con_acta'   => $totalJuntasConActa,
                'actas_cuadradas'         => $actasCuadradas,
                'actas_legibles'          => $actasLegibles,
                'porcentaje_cuadradas'    => $totalActasEncabezado > 0 ? round(($actasCuadradas / $totalActasEncabezado) * 100, 2) : 0,
                'porcentaje_legibles'     => $totalActasEncabezado > 0 ? round(($actasLegibles / $totalActasEncabezado) * 100, 2) : 0,
            ],
            'resumen_votos' => [
                'total_votos_validos'            => $totalVotosValidos,
                'total_votos_blancos'            => $totalVotosBlancos,
                'total_votos_nulos'              => $totalVotosNulos,
                'total_num_electores'            => $totalNumElectores,
                'porcentaje_validos_sobre_electores' => $porcentajeValidosSobreElectores,
                'porcentaje_blancos'             => $totalVotosValidos > 0 ? round(($totalVotosBlancos / $totalVotosValidos) * 100, 2) : 0,
                'porcentaje_nulos'               => $totalVotosValidos > 0 ? round(($totalVotosNulos / $totalVotosValidos) * 100, 2) : 0,
            ],
            'por_provincia' => $porProvincia,
            'por_canton'    => $porCanton,
            'por_parroquia' => $porParroquia,
            'por_zona'      => $porZona,
        ];
    }

    public function obtenerResultadosPorPregunta(array $filtros)
    {
        $detalle = DB::table('acta_consulta_preguntas as d')
            ->join('actas_consulta as a', 'd.acta_consulta_id', '=', 'a.id')
            ->join('preguntas_consulta as q', 'd.pregunta_id', '=', 'q.id')
            ->where('a.estado', true);

        if (isset($filtros['provincia_id'])) {
            $detalle->where('a.provincia_id', (int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $detalle->where('a.canton_id', (int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $detalle->where('a.parroquia_id', (int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $detalle->where('a.zona_id', (int) $filtros['zona_id']);
        }

        $resultados = (clone $detalle)
            ->select(
                'q.id as pregunta_id',
                'q.casillero_pregunta',
                'q.texto_pregunta',
                DB::raw('SUM(d.votos_si) as total_votos_si'),
                DB::raw('SUM(d.votos_no) as total_votos_no'),
                DB::raw('SUM(d.votos_blancos) as total_votos_blancos'),
                DB::raw('SUM(d.votos_nulos) as total_votos_nulos'),
                DB::raw('SUM(a.votos_validos) as total_votos_validos'),
                DB::raw('COUNT(DISTINCT a.junta_id) as juntas_con_acta'),
                DB::raw('COUNT(d.id) as filas')
            )
            ->groupBy('q.id', 'q.casillero_pregunta', 'q.texto_pregunta')
            ->orderBy('q.casillero_pregunta')
            ->get()
            ->map(function ($item) {
                $validos = (int) $item->total_votos_validos;
                return [
                    'pregunta_id'         => (int) $item->pregunta_id,
                    'casillero_pregunta'  => $item->casillero_pregunta,
                    'texto_pregunta'      => $item->texto_pregunta,
                    'total_votos_si'      => (int) $item->total_votos_si,
                    'total_votos_no'      => (int) $item->total_votos_no,
                    'total_votos_blancos' => (int) $item->total_votos_blancos,
                    'total_votos_nulos'   => (int) $item->total_votos_nulos,
                    'total_votos_validos' => $validos,
                    'porcentaje_si'       => $validos > 0 ? round(($item->total_votos_si / $validos) * 100, 2) : 0,
                    'porcentaje_no'       => $validos > 0 ? round(($item->total_votos_no / $validos) * 100, 2) : 0,
                    'juntas_con_acta'     => (int) $item->juntas_con_acta,
                    'filas'               => (int) $item->filas,
                ];
            });

        $acumGlobal = (clone $detalle)
            ->selectRaw('
                SUM(d.votos_blancos) as total_votos_blancos,
                SUM(d.votos_nulos)   as total_votos_nulos
            ')
            ->first();

        $totalVotosValidosGlobal = (int) ActaConsulta::query()
            ->activas()
            ->when(isset($filtros['provincia_id']), fn($q) => $q->porProvincia((int) $filtros['provincia_id']))
            ->when(isset($filtros['canton_id']), fn($q) => $q->porCanton((int) $filtros['canton_id']))
            ->when(isset($filtros['parroquia_id']), fn($q) => $q->porParroquia((int) $filtros['parroquia_id']))
            ->when(isset($filtros['zona_id']), fn($q) => $q->porZona((int) $filtros['zona_id']))
            ->sum('votos_validos');

        $electoresQuery = DB::table('recintos as r')
            ->join('zonas as z', 'z.id', '=', 'r.zona_id')
            ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
            ->join('cantones as c', 'p.canton_id', '=', 'c.id')
            ->join('provincias as pr', 'c.provincia_id', '=', 'pr.id');

        if (isset($filtros['provincia_id'])) {
            $electoresQuery->where('pr.id', (int) $filtros['provincia_id']);
        }
        if (isset($filtros['canton_id'])) {
            $electoresQuery->where('c.id', (int) $filtros['canton_id']);
        }
        if (isset($filtros['parroquia_id'])) {
            $electoresQuery->where('p.id', (int) $filtros['parroquia_id']);
        }
        if (isset($filtros['zona_id'])) {
            $electoresQuery->where('z.id', (int) $filtros['zona_id']);
        }

        $totalNumElectores = (int) $electoresQuery->sum('r.num_electores');

        return [
            'filtros_aplicados' => $filtros,
            'resultados' => $resultados,
            'acumulado_simple' => [
                'total_votos_blancos' => (int) ($acumGlobal->total_votos_blancos ?? 0),
                'total_votos_nulos'   => (int) ($acumGlobal->total_votos_nulos ?? 0),
                'total_votos_validos' => $totalVotosValidosGlobal,
            ],
            'poblacion_electoral' => [
                'total_num_electores' => $totalNumElectores,
            ],
        ];
    }

    public function obtenerResultadosAgrupados()
    {
        $resultados = ActaConsulta::from('actas_consulta as ac')
            ->join('zonas as z', 'ac.zona_id', '=', 'z.id')
            ->join('parroquias as p', 'z.parroquia_id', '=', 'p.id')
            ->join('cantones as c', 'ac.canton_id', '=', 'c.id')
            ->join('provincias as prov', 'ac.provincia_id', '=', 'prov.id')
            ->select(
                'prov.nombre_provincia',
                'c.id as canton_id',
                'c.nombre_canton',
                'z.id as zona_id',
                'z.nombre_zona',
                DB::raw('SUM(ac.votos_validos) as total_votos_validos')
            )
            ->where('ac.estado', 1)
            ->groupBy('prov.nombre_provincia', 'c.id', 'c.nombre_canton', 'z.id', 'z.nombre_zona')
            ->orderBy('c.nombre_canton')
            ->orderBy('z.nombre_zona')
            ->get();

        $resultadosAgrupados = [];

        foreach ($resultados as $resultado) {
            $cantonId = $resultado->canton_id;

            if (!isset($resultadosAgrupados[$cantonId])) {
                $resultadosAgrupados[$cantonId] = [
                    'provincia' => $resultado->nombre_provincia,
                    'canton' => $resultado->nombre_canton,
                    'zonas' => [],
                    'total_votos_canton' => 0
                ];
            }

            $preguntas = $this->obtenerPreguntasPorZona($resultado->zona_id);

            $resultadosAgrupados[$cantonId]['zonas'][] = [
                'zona_id' => $resultado->zona_id,
                'nombre_zona' => $resultado->nombre_zona,
                'total_votos_validos' => $resultado->total_votos_validos,
                'preguntas' => $preguntas
            ];

            $resultadosAgrupados[$cantonId]['total_votos_canton'] += $resultado->total_votos_validos;
        }

        return $resultadosAgrupados;
    }

    private function obtenerPreguntasPorZona($zonaId)
    {
        return DB::table('actas_consulta as ac')
            ->join('acta_consulta_preguntas as acp', 'ac.id', '=', 'acp.acta_consulta_id')
            ->join('preguntas_consulta as pc', 'acp.pregunta_id', '=', 'pc.id')
            ->select(
                'pc.casillero_pregunta',
                'pc.texto_pregunta',
                DB::raw('SUM(acp.votos_si) as total_votos_si'),
                DB::raw('SUM(acp.votos_no) as total_votos_no'),
                DB::raw('SUM(acp.votos_blancos) as total_votos_blancos'),
                DB::raw('SUM(acp.votos_nulos) as total_votos_nulos')
            )
            ->where('ac.zona_id', $zonaId)
            ->where('ac.estado', 1)
            ->groupBy('pc.id', 'pc.casillero_pregunta', 'pc.texto_pregunta')
            ->orderBy('pc.casillero_pregunta')
            ->get();
    }

    public function obtenerTendenciasConsulta(?int $zonaId, ?int $preguntaId)
    {
        return DB::table('juntas')
            ->leftJoin('recintos', 'juntas.recinto_id', '=', 'recintos.id')
            ->crossJoin('preguntas_consulta')
            ->leftJoin('actas_consulta', function ($join) {
                $join->on('juntas.id', '=', 'actas_consulta.junta_id');
            })
            ->leftJoin('acta_consulta_preguntas', function ($join) {
                $join->on('actas_consulta.id', '=', 'acta_consulta_preguntas.acta_consulta_id')
                    ->on('acta_consulta_preguntas.pregunta_id', '=', 'preguntas_consulta.id');
            })
            ->select(
                'juntas.junta_nombre',
                'recintos.nombre_recinto',
                'preguntas_consulta.casillero_pregunta',
                'preguntas_consulta.texto_pregunta',
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_si), 0) as votos_si'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_no), 0) as votos_no'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_blancos), 0) as votos_blancos'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_nulos), 0) as votos_nulos'),
                DB::raw('COALESCE(SUM(acta_consulta_preguntas.votos_si + acta_consulta_preguntas.votos_no), 0) as total_votos')
            )
            ->when($zonaId, function ($query) use ($zonaId) {
                return $query->where('juntas.zona_id', $zonaId);
            })
            ->where('preguntas_consulta.activo', 1)
            ->when($preguntaId, function ($query) use ($preguntaId) {
                return $query->where('preguntas_consulta.id', $preguntaId);
            })
            ->groupBy(
                'juntas.id',
                'juntas.junta_nombre',
                'recintos.nombre_recinto',
                'preguntas_consulta.id',
                'preguntas_consulta.casillero_pregunta',
                'preguntas_consulta.texto_pregunta'
            )
            ->orderBy('juntas.num_junta', 'asc')
            ->orderByRaw('COALESCE(SUM(acta_consulta_preguntas.votos_si + acta_consulta_preguntas.votos_no), 0) DESC')
            ->get()
            ->map(function ($item) {
                $item->votos_si = (int) $item->votos_si;
                $item->votos_no = (int) $item->votos_no;
                $item->votos_blancos = (int) $item->votos_blancos;
                $item->votos_nulos = (int) $item->votos_nulos;
                $item->total_votos = (int) $item->total_votos;
                return $item;
            });
    }
}
