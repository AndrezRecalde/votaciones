<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class CantonSheet implements FromArray, WithHeadings, WithStyles, WithTitle, ShouldAutoSize, WithEvents
{
    protected $canton;

    public function __construct($canton)
    {
        $this->canton = $canton;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->canton['zonas'] as $zona) {
            if (count($zona['preguntas']) > 0) {
                foreach ($zona['preguntas'] as $pregunta) {
                    $total = $pregunta->total_votos_si + $pregunta->total_votos_no +
                        $pregunta->total_votos_blancos + $pregunta->total_votos_nulos;

                    $data[] = [
                        'zona' => $zona['nombre_zona'],
                        'votos_validos_zona' => $zona['total_votos_validos'],
                        'casillero' => $pregunta->casillero_pregunta,
                        'pregunta' => $pregunta->texto_pregunta,
                        'votos_si' => $pregunta->total_votos_si,
                        'votos_no' => $pregunta->total_votos_no,
                        'votos_blancos' => $pregunta->total_votos_blancos,
                        'votos_nulos' => $pregunta->total_votos_nulos,
                        'total' => $total,
                    ];
                }
            } else {
                $data[] = [
                    'zona' => $zona['nombre_zona'],
                    'votos_validos_zona' => $zona['total_votos_validos'],
                    'casillero' => 'N/A',
                    'pregunta' => 'Sin preguntas registradas',
                    'votos_si' => 0,
                    'votos_no' => 0,
                    'votos_blancos' => 0,
                    'votos_nulos' => 0,
                    'total' => 0,
                ];
            }
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Zona',
            'Votos Válidos Zona',
            'Casillero',
            'Pregunta',
            'Votos SÍ',
            'Votos NO',
            'Votos Blancos',
            'Votos Nulos',
            'Total',
        ];
    }

    public function title(): string
    {
        return substr($this->canton['canton'], 0, 31); // Excel limit 31 chars
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 11,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2d3748']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();

                // Título del cantón
                $sheet->insertNewRowBefore(1, 2);
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                $sheet->setCellValue('A1', strtoupper($this->canton['provincia'] . ' - ' . $this->canton['canton']));
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 13,
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '4a5568']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension(1)->setRowHeight(25);

                // Total del cantón
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                $sheet->setCellValue('A2', 'Total Votos Válidos del Cantón: ' . number_format($this->canton['total_votos_canton']));
                $sheet->getStyle('A2')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 11,
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'edf2f7']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension(2)->setRowHeight(20);

                // Encabezados
                $sheet->getStyle('A3:I3')->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                ]);

                // Datos
                $sheet->getStyle('A4:I' . ($highestRow + 2))->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'CCCCCC'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                // Colores para columnas de votos
                $sheet->getStyle('E4:E' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'c6f6d5'] // Verde claro para SÍ
                    ],
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                $sheet->getStyle('F4:F' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'fed7d7'] // Rojo claro para NO
                    ],
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                $sheet->getStyle('G4:G' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'e2e8f0'] // Gris para blancos
                    ],
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                $sheet->getStyle('H4:H' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'feebc8'] // Naranja claro para nulos
                    ],
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Centrar casillero y total
                $sheet->getStyle('C4:C' . ($highestRow + 2))->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('I4:I' . ($highestRow + 2))->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Ajustar altura de filas
                $sheet->getRowDimension(3)->setRowHeight(25);
            },
        ];
    }
}
