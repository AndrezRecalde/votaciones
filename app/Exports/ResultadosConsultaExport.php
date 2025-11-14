<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;


class ResultadosConsultaExport implements WithMultipleSheets
{
    protected $resultados;

    public function __construct()
    {
        $this->resultados = $this->obtenerResultadosAgrupados();
    }

    public function sheets(): array
    {
        $sheets = [];

        // Hoja resumen general
        $sheets[] = new ResumenGeneralSheet($this->resultados);

        // Una hoja por cada cantón
        foreach ($this->resultados as $canton) {
            $sheets[] = new CantonSheet($canton);
        }

        return $sheets;
    }

    private function obtenerResultadosAgrupados()
    {
        $resultados = DB::table('actas_consulta as ac')
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
}
