<?php

namespace App\Exports;

use App\Models\Acta;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ActasExport implements FromCollection, WithHeadings, WithColumnWidths, WithStyles, WithColumnFormatting
{
    protected $dignidad_id, $canton_id, $parroquia_id, $tipo_acta;

    public function __construct(int $dignidad_id, int $canton_id, int $parroquia_id, int $tipo_acta)
    {
        $this->dignidad_id = $dignidad_id;
        $this->canton_id = $canton_id;
        $this->parroquia_id = $parroquia_id;
        $this->tipo_acta = $tipo_acta;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 22,
            'B' => 30,
            'C' => 27,
            'D' => 50,
            'E' => 15,
            'F' => 20,
            'G' => 20,
            'H' => 20,
            'I' => 20,
            'J' => 20,
            'K' => 30,
            'L' => 25,
            'M' => 20
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getStyle('B1')->getFont()->setBold(true);
        $sheet->getStyle('C1')->getFont()->setBold(true);
        $sheet->getStyle('D1')->getFont()->setBold(true);
        $sheet->getStyle('E1')->getFont()->setBold(true);
        $sheet->getStyle('F1')->getFont()->setBold(true);
        $sheet->getStyle('G1')->getFont()->setBold(true);
        $sheet->getStyle('H1')->getFont()->setBold(true);
        $sheet->getStyle('I1')->getFont()->setBold(true);
        $sheet->getStyle('J1')->getFont()->setBold(true);
        $sheet->getStyle('K1')->getFont()->setBold(true);
        $sheet->getStyle('L1')->getFont()->setBold(true);
        $sheet->getStyle('M1')->getFont()->setBold(true);
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_TEXT,
            'M' => NumberFormat::FORMAT_TEXT,
        ];
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function headings(): array
    {
        return [
            'Canton',
            'Parroquia',
            'Zona',
            'Recinto',
            'Junta',
            'Dignidad',
            'Total Huellas',
            'Votos Blancos',
            'Votos Nulos',
            'Cuadrada',
            'Partido',
            'Número de votos'
        ];
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $actas = Acta::from('actas as a')
            ->selectRaw('cant.nombre_canton,
                            parr.nombre_parroquia,
                            z.nombre_zona,
                            r.nombre_recinto,
                            j.junta_nombre,
                            d.nombre_dignidad,
                            a.votos_validos,
                            a.votos_blancos,
                            a.votos_nulos,
                            a.cuadrada,
                            ca.nombre_candidato,
                            ac.num_votos')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('juntas as j', 'j.id', 'a.junta_id')
            ->join('zonas as z', 'z.id', 'j.zona_id')
            ->join('parroquias as parr', 'parr.id', 'z.parroquia_id')
            ->join('cantones as cant', 'cant.id', 'parr.canton_id')
            ->join('users as u', 'u.id', 'a.user_add')
            ->leftJoin('recintos as r', 'r.id', 'j.recinto_id')
            ->join('acta_candidato as ac', 'ac.acta_id', 'a.id')
            ->join('candidatos as ca', 'ca.id', 'ac.candidato_id')
            ->join('organizaciones as org', 'org.id', 'ca.organizacion_id')
            ->dignidad($this->dignidad_id)
            ->canton($this->canton_id)
            ->parroquia($this->parroquia_id)
            ->cuadrada($this->tipo_acta)
            ->orderBy('cant.nombre_canton', 'ASC')
            ->get();

        return $actas;
    }
}
