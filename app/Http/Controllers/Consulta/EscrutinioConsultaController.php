<?php

namespace App\Http\Controllers\Consulta;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EscrutinioConsultaController extends Controller
{
    public function drill(Request $request): JsonResponse
    {
        $request->validate([
            'nivel'         => 'required|string|in:provincia,canton,parroquia,zona,recinto,junta',
            'provincia_id'  => 'nullable|integer|exists:provincias,id',
            'canton_id'     => 'nullable|integer|exists:cantones,id',
            'parroquia_id'  => 'nullable|integer|exists:parroquias,id',
            'zona_id'       => 'nullable|integer|exists:zonas,id',
            'recinto_id'    => 'nullable|integer|exists:recintos,id',
            'solo_activas'  => 'nullable|boolean',
            'incluir_acta'  => 'nullable|boolean',
        ]);

        $nivel        = $request->get('nivel');
        $soloActivas  = $request->boolean('solo_activas', false);
        $incluirActa  = $request->boolean('incluir_acta', false);

        $provinciaId  = $request->integer('provincia_id');
        $cantonId     = $request->integer('canton_id');
        $parroquiaId  = $request->integer('parroquia_id');
        $zonaId       = $request->integer('zona_id');
        $recintoId    = $request->integer('recinto_id');

        // Viene el nivel actual y devolvemos la colección del siguiente.
        switch ($nivel) {
            case 'provincia':
                return $this->drillProvincias($soloActivas);

            case 'canton':
                if (!$provinciaId) {
                    return $this->error("Debe enviar provincia_id para nivel canton");
                }
                return $this->drillCantones($provinciaId, $soloActivas);

            case 'parroquia':
                if (!$cantonId) {
                    return $this->error("Debe enviar canton_id para nivel parroquia");
                }
                return $this->drillParroquias($cantonId, $soloActivas);

            case 'zona':
                if (!$parroquiaId) {
                    return $this->error("Debe enviar parroquia_id para nivel zona");
                }
                return $this->drillZonas($parroquiaId, $soloActivas);

            case 'recinto':
                if (!$zonaId) {
                    return $this->error("Debe enviar zona_id para nivel recinto");
                }
                return $this->drillRecintos($zonaId, $soloActivas);

            case 'junta':
                if (!$recintoId) {
                    return $this->error("Debe enviar recinto_id para nivel junta");
                }
                return $this->drillJuntas($recintoId, $soloActivas, $incluirActa);

            default:
                return $this->error("Nivel no soportado");
        }
    }

    private function drillProvincias(bool $soloActivas): JsonResponse
    {
        // Total de juntas por provincia
        $totalJuntasSub = DB::table('juntas as j')
            ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
            ->join('zonas as z', 'z.id', '=', 'j.zona_id')
            ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
            ->join('cantones as c', 'c.id', '=', 'p.canton_id')
            ->select('c.provincia_id', DB::raw('COUNT(j.id) AS total_juntas'))
            ->groupBy('c.provincia_id');

        // Actas ingresadas por provincia
        $actasSub = DB::table('actas_consulta as ac')
            ->when($soloActivas, fn($q) => $q->where('ac.estado', true))
            ->select('ac.provincia_id', DB::raw('COUNT(DISTINCT ac.junta_id) AS actas_ingresadas'))
            ->groupBy('ac.provincia_id');

        $rows = DB::table('provincias as pr')
            ->leftJoinSub($totalJuntasSub, 'tj', fn($join) => $join->on('tj.provincia_id', '=', 'pr.id'))
            ->leftJoinSub($actasSub, 'ai', fn($join) => $join->on('ai.provincia_id', '=', 'pr.id'))
            ->selectRaw('
                pr.id AS provincia_id,
                pr.nombre_provincia AS provincia,
                COALESCE(tj.total_juntas,0) AS total_juntas,
                COALESCE(ai.actas_ingresadas,0) AS actas_ingresadas,
                CASE WHEN COALESCE(tj.total_juntas,0)=0 THEN 0
                     ELSE ROUND(COALESCE(ai.actas_ingresadas,0)*100/tj.total_juntas,2) END AS porcentaje_avance
            ')
            ->orderByDesc('porcentaje_avance')
            ->orderBy('pr.nombre_provincia')
            ->get();

        return $this->json('provincia', 'canton', [], $rows);
    }

    private function drillCantones(int $provinciaId, bool $soloActivas): JsonResponse
    {
        $totalJuntasSub = DB::table('juntas as j')
            ->join('zonas as z', 'z.id', '=', 'j.zona_id')
            ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
            ->join('cantones as c', 'c.id', '=', 'p.canton_id')
            ->where('c.provincia_id', $provinciaId)
            ->select('p.canton_id', DB::raw('COUNT(j.id) AS total_juntas'))
            ->groupBy('p.canton_id');

        $actasSub = DB::table('actas_consulta as ac')
            ->where('ac.provincia_id', $provinciaId)
            ->when($soloActivas, fn($q) => $q->where('ac.estado', true))
            ->select('ac.canton_id', DB::raw('COUNT(DISTINCT ac.junta_id) AS actas_ingresadas'))
            ->groupBy('ac.canton_id');

        $rows = DB::table('cantones as c')
            ->where('c.provincia_id', $provinciaId)
            ->leftJoinSub($totalJuntasSub, 'tj', fn($j) => $j->on('tj.canton_id', '=', 'c.id'))
            ->leftJoinSub($actasSub, 'ai', fn($j) => $j->on('ai.canton_id', '=', 'c.id'))
            ->selectRaw('
                c.id AS canton_id,
                c.nombre_canton AS canton,
                COALESCE(tj.total_juntas,0) AS total_juntas,
                COALESCE(ai.actas_ingresadas,0) AS actas_ingresadas,
                CASE WHEN COALESCE(tj.total_juntas,0)=0 THEN 0
                     ELSE ROUND(COALESCE(ai.actas_ingresadas,0)*100/tj.total_juntas,2) END AS porcentaje_avance
            ')
            ->orderByDesc('porcentaje_avance')
            ->orderBy('c.nombre_canton')
            ->get();

        return $this->json('canton', 'parroquia', ['provincia_id' => $provinciaId], $rows);
    }

    private function drillParroquias(int $cantonId, bool $soloActivas): JsonResponse
    {
        $totalJuntasSub = DB::table('juntas as j')
            ->join('zonas as z', 'z.id', '=', 'j.zona_id')
            ->join('parroquias as p', 'p.id', '=', 'z.parroquia_id')
            ->where('p.canton_id', $cantonId)
            ->select('p.id AS parroquia_id', DB::raw('COUNT(j.id) AS total_juntas'))
            ->groupBy('p.id');

        $actasSub = DB::table('actas_consulta as ac')
            ->where('ac.canton_id', $cantonId)
            ->when($soloActivas, fn($q) => $q->where('ac.estado', true))
            ->select('ac.parroquia_id', DB::raw('COUNT(DISTINCT ac.junta_id) AS actas_ingresadas'))
            ->groupBy('ac.parroquia_id');

        $rows = DB::table('parroquias as p')
            ->where('p.canton_id', $cantonId)
            ->leftJoinSub($totalJuntasSub, 'tj', fn($j) => $j->on('tj.parroquia_id', '=', 'p.id'))
            ->leftJoinSub($actasSub, 'ai', fn($j) => $j->on('ai.parroquia_id', '=', 'p.id'))
            ->selectRaw('
                p.id AS parroquia_id,
                p.nombre_parroquia AS parroquia,
                COALESCE(tj.total_juntas,0) AS total_juntas,
                COALESCE(ai.actas_ingresadas,0) AS actas_ingresadas,
                CASE WHEN COALESCE(tj.total_juntas,0)=0 THEN 0
                     ELSE ROUND(COALESCE(ai.actas_ingresadas,0)*100/tj.total_juntas,2) END AS porcentaje_avance
            ')
            ->orderByDesc('porcentaje_avance')
            ->orderBy('p.nombre_parroquia')
            ->get();

        return $this->json('parroquia', 'zona', ['canton_id' => $cantonId], $rows);
    }

    private function drillZonas(int $parroquiaId, bool $soloActivas): JsonResponse
    {
        $totalJuntasSub = DB::table('juntas as j')
            ->join('zonas as z', 'z.id', '=', 'j.zona_id')
            ->where('z.parroquia_id', $parroquiaId)
            ->select('z.id AS zona_id', DB::raw('COUNT(j.id) AS total_juntas'))
            ->groupBy('z.id');

        $actasSub = DB::table('actas_consulta as ac')
            ->where('ac.parroquia_id', $parroquiaId)
            ->when($soloActivas, fn($q) => $q->where('ac.estado', true))
            ->select('ac.zona_id', DB::raw('COUNT(DISTINCT ac.junta_id) AS actas_ingresadas'))
            ->groupBy('ac.zona_id');

        $rows = DB::table('zonas as z')
            ->where('z.parroquia_id', $parroquiaId)
            ->leftJoinSub($totalJuntasSub, 'tj', fn($j) => $j->on('tj.zona_id', '=', 'z.id'))
            ->leftJoinSub($actasSub, 'ai', fn($j) => $j->on('ai.zona_id', '=', 'z.id'))
            ->selectRaw('
                z.id AS zona_id,
                z.codigo AS zona_codigo,
                COALESCE(tj.total_juntas,0) AS total_juntas,
                COALESCE(ai.actas_ingresadas,0) AS actas_ingresadas,
                CASE WHEN COALESCE(tj.total_juntas,0)=0 THEN 0
                     ELSE ROUND(COALESCE(ai.actas_ingresadas,0)*100/tj.total_juntas,2) END AS porcentaje_avance
            ')
            ->orderByDesc('porcentaje_avance')
            ->orderBy('zona_codigo')
            ->get();

        return $this->json('zona', 'recinto', ['parroquia_id' => $parroquiaId], $rows);
    }

    private function drillRecintos(int $zonaId, bool $soloActivas): JsonResponse
    {
        $totalJuntasSub = DB::table('juntas as j')
            ->join('recintos as r', 'r.id', '=', 'j.recinto_id')
            ->where('r.zona_id', $zonaId)
            ->select('r.id AS recinto_id', DB::raw('COUNT(j.id) AS total_juntas'))
            ->groupBy('r.id');

        $actasSub = DB::table('actas_consulta as ac')
            ->where('ac.zona_id', $zonaId)
            ->when($soloActivas, fn($q) => $q->where('ac.estado', true))
            ->select('ac.recinto_id', DB::raw('COUNT(DISTINCT ac.junta_id) AS actas_ingresadas'))
            ->groupBy('ac.recinto_id');

        $rows = DB::table('recintos as r')
            ->where('r.zona_id', $zonaId)
            ->leftJoinSub($totalJuntasSub, 'tj', fn($j) => $j->on('tj.recinto_id', '=', 'r.id'))
            ->leftJoinSub($actasSub, 'ai', fn($j) => $j->on('ai.recinto_id', '=', 'r.id'))
            ->selectRaw('
                r.id AS recinto_id,
                r.nombre_recinto AS recinto,
                COALESCE(tj.total_juntas,0) AS total_juntas,
                COALESCE(ai.actas_ingresadas,0) AS actas_ingresadas,
                CASE WHEN COALESCE(tj.total_juntas,0)=0 THEN 0
                     ELSE ROUND(COALESCE(ai.actas_ingresadas,0)*100/tj.total_juntas,2) END AS porcentaje_avance
            ')
            ->orderByDesc('porcentaje_avance')
            ->orderBy('r.nombre_recinto')
            ->get();

        return $this->json('recinto', 'junta', ['zona_id' => $zonaId], $rows);
    }

    private function drillJuntas(int $recintoId, bool $soloActivas, bool $incluirActa): JsonResponse
    {
        // Lista de juntas del recinto con flag de si tiene acta válida
        $base = DB::table('juntas as j')
            ->where('j.recinto_id', $recintoId)
            ->leftJoin('actas_consulta as ac', function ($join) use ($soloActivas) {
                $join->on('ac.junta_id', '=', 'j.id');
                if ($soloActivas) {
                    $join->where('ac.estado', true);
                }
            })
            ->selectRaw('
                j.id AS junta_id,
                j.numero AS numero_junta,
                CASE WHEN ac.id IS NULL THEN 0 ELSE 1 END AS acta_ingresada
            ')
            ->orderBy('numero_junta');

        $rows = $base->get();

        // Opcional: incluir datos del acta (última activa)
        $actasDetalle = [];
        if ($incluirActa) {
            $ids = $rows->pluck('junta_id')->filter()->all();
            if ($ids) {
                $actasDetalle = DB::table('actas_consulta')
                    ->select('id', 'junta_id', 'votos_validos', 'estado', 'created_at')
                    ->whereIn('junta_id', $ids)
                    ->when($soloActivas, fn($q) => $q->where('estado', true))
                    ->orderBy('junta_id')
                    ->get()
                    ->groupBy('junta_id');
            }
        }

        // Empaque final juntas
        $juntas = $rows->map(function ($r) use ($incluirActa, $actasDetalle) {
            $item = [
                'junta_id'       => $r->junta_id,
                'numero_junta'   => $r->numero_junta,
                'acta_ingresada' => (bool) $r->acta_ingresada,
            ];
            if ($incluirActa) {
                $item['acta'] = $actasDetalle[$r->junta_id]->first() ?? null;
            }
            return $item;
        });

        // Métricas del nivel
        $totalJuntas = $juntas->count();
        $actasIngresadas = $juntas->where('acta_ingresada', true)->count();
        $porcentaje = $totalJuntas > 0 ? round($actasIngresadas * 100 / $totalJuntas, 2) : 0;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'nivel_actual'    => 'junta',
                'nivel_siguiente' => null,
                'filtros'         => [
                    'recinto_id'    => $recintoId,
                    'solo_activas'  => $soloActivas,
                    'incluir_acta'  => $incluirActa,
                ],
                'resumen' => [
                    'total_juntas'      => $totalJuntas,
                    'actas_ingresadas'  => $actasIngresadas,
                    'porcentaje_avance' => $porcentaje,
                ],
                'juntas' => $juntas,
            ],
        ], 200);
    }

    private function json(string $nivelActual, ?string $nivelSiguiente, array $filtros, $rows): JsonResponse
    {
        // Resumen global
        $sumJuntas = (int) $rows->sum('total_juntas');
        $sumActas  = (int) $rows->sum('actas_ingresadas');
        $avanceGlobal = $sumJuntas > 0 ? round(($sumActas * 100) / $sumJuntas, 2) : 0.0;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'nivel_actual'    => $nivelActual,
                'nivel_siguiente' => $nivelSiguiente,
                'filtros'         => $filtros,
                'resumen'         => [
                    'entidades'         => $rows->count(),
                    'sum_juntas'        => $sumJuntas,
                    'sum_actas'         => $sumActas,
                    'avance_global_%'   => $avanceGlobal,
                ],
                'items' => $rows,
            ],
        ], 200);
    }

    private function error(string $msg): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $msg,
        ], 422);
    }
}
