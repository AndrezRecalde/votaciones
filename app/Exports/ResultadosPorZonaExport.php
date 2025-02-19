<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class ResultadosPorZonaExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize, WithColumnWidths
{

    protected $dignidad_id;

    public function __construct($dignidad_id)
    {
        $this->dignidad_id = $dignidad_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return DB::table('acta_candidato')
            ->join('actas', 'acta_candidato.acta_id', '=', 'actas.id')
            ->join('juntas', 'actas.junta_id', '=', 'juntas.id')
            ->join('zonas', 'juntas.zona_id', '=', 'zonas.id')
            ->join('parroquias', 'zonas.parroquia_id', '=', 'parroquias.id')
            ->join('cantones', 'parroquias.canton_id', '=', 'cantones.id')
            ->join('dignidades', 'actas.dignidad_id', '=', 'dignidades.id')
            ->join('candidatos', 'acta_candidato.candidato_id', '=', 'candidatos.id')
            ->join('organizaciones', 'candidatos.organizacion_id', '=', 'organizaciones.id')
            ->select(
                'dignidades.nombre_dignidad',
                'cantones.nombre_canton',
                'parroquias.nombre_parroquia',
                'candidatos.nombre_candidato',
                'zonas.nombre_zona',
                DB::raw('SUM(acta_candidato.num_votos) as total_votos'),
                DB::raw('SUM(juntas.num_junta) as total_juntas') // 🔹 Sumamos num_junta en vez de contar
            )
            ->where('actas.dignidad_id', $this->dignidad_id) // 🔹 Filtrar por dignidad_id
            ->groupBy(
                'dignidades.nombre_dignidad',
                'cantones.nombre_canton',
                'parroquias.nombre_parroquia',
                'candidatos.nombre_candidato',
                'zonas.nombre_zona'
            )
            ->orderBy('cantones.nombre_canton', 'asc') // 🔹 Ordenar primero por nombre_canton
            ->orderBy('organizaciones.numero_organizacion', 'asc') // 🔹 Luego por numero_organizacion
            ->get();
    }

    public function headings(): array
    {
        return [
            "Dignidad",
            "Cantón",
            "Parroquia",
            "Candidato",
            "Nombre Zona",
            "Total Votos",
            "Total Juntas"
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para los headings (negrita y fondo gris)
            1 => ['font' => ['bold' => true], 'fill' => ['fillType' => 'solid', 'color' => ['rgb' => 'D9D9D9']]],

            // Alineación de las celdas
            'A:Z' => ['alignment' => ['horizontal' => 'left', 'vertical' => 'left']],

            // Bordes para todas las celdas
            'A1:G1000' => ['borders' => ['allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => '000000']]]]
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 35, // Dignidad
            'B' => 35, // Cantón
            'C' => 40, // Parroquia
            'D' => 45, // Candidato
            'E' => 40, // Nombre Zona
            'F' => 15, // Total Votos
            'G' => 15, // Total Juntas
        ];
    }
}
