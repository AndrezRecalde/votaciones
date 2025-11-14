<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
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

class ResumenGeneralSheet implements FromArray, WithHeadings, WithStyles, WithTitle, ShouldAutoSize, WithEvents
{
    protected $resultados;

    public function __construct($resultados)
    {
        $this->resultados = $resultados;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->resultados as $canton) {
            // Agrupar preguntas por casillero
            $preguntasAgrupadas = [];

            foreach ($canton['zonas'] as $zona) {
                foreach ($zona['preguntas'] as $pregunta) {
                    $casillero = $pregunta->casillero_pregunta;

                    if (!isset($preguntasAgrupadas[$casillero])) {
                        $preguntasAgrupadas[$casillero] = [
                            'casillero' => $casillero,
                            'texto_pregunta' => $pregunta->texto_pregunta,
                            'total_si' => 0,
                            'total_no' => 0,
                            'total_blancos' => 0,
                            'total_nulos' => 0,
                        ];
                    }

                    $preguntasAgrupadas[$casillero]['total_si'] += $pregunta->total_votos_si;
                    $preguntasAgrupadas[$casillero]['total_no'] += $pregunta->total_votos_no;
                    $preguntasAgrupadas[$casillero]['total_blancos'] += $pregunta->total_votos_blancos;
                    $preguntasAgrupadas[$casillero]['total_nulos'] += $pregunta->total_votos_nulos;
                }
            }

            // Si hay preguntas, agregar fila por cada pregunta
            if (!empty($preguntasAgrupadas)) {
                $firstRow = true;
                foreach ($preguntasAgrupadas as $pregunta) {
                    $total = $pregunta['total_si'] + $pregunta['total_no'] +
                        $pregunta['total_blancos'] + $pregunta['total_nulos'];

                    $data[] = [
                        'provincia' => $firstRow ? $canton['provincia'] : '',
                        'canton' => $firstRow ? $canton['canton'] : '',
                        'num_zonas' => $firstRow ? count($canton['zonas']) : '',
                        'casillero' => $pregunta['casillero'],
                        'pregunta' => $pregunta['texto_pregunta'],
                        'total_votos_si' => $pregunta['total_si'],
                        'total_votos_no' => $pregunta['total_no'],
                        'total_votos_blancos' => $pregunta['total_blancos'],
                        'total_votos_nulos' => $pregunta['total_nulos'],
                        'total_general' => $total,
                    ];

                    $firstRow = false;
                }

                // Fila de subtotal por cantón
                $total_canton_si = array_sum(array_column($preguntasAgrupadas, 'total_si'));
                $total_canton_no = array_sum(array_column($preguntasAgrupadas, 'total_no'));
                $total_canton_blancos = array_sum(array_column($preguntasAgrupadas, 'total_blancos'));
                $total_canton_nulos = array_sum(array_column($preguntasAgrupadas, 'total_nulos'));

                $data[] = [
                    'provincia' => '',
                    'canton' => 'SUBTOTAL ' . strtoupper($canton['canton']),
                    'num_zonas' => '',
                    'casillero' => '',
                    'pregunta' => '',
                    'total_votos_si' => $total_canton_si,
                    'total_votos_no' => $total_canton_no,
                    'total_votos_blancos' => $total_canton_blancos,
                    'total_votos_nulos' => $total_canton_nulos,
                    'total_general' => $total_canton_si + $total_canton_no + $total_canton_blancos + $total_canton_nulos,
                ];
            } else {
                // Cantón sin preguntas
                $data[] = [
                    'provincia' => $canton['provincia'],
                    'canton' => $canton['canton'],
                    'num_zonas' => count($canton['zonas']),
                    'casillero' => 'N/A',
                    'pregunta' => 'Sin preguntas registradas',
                    'total_votos_si' => 0,
                    'total_votos_no' => 0,
                    'total_votos_blancos' => 0,
                    'total_votos_nulos' => 0,
                    'total_general' => 0,
                ];
            }
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Provincia',
            'Cantón',
            'N° Zonas',
            'Casillero',
            'Pregunta',
            'Total Votos SÍ',
            'Total Votos NO',
            'Total Votos Blancos',
            'Total Votos Nulos',
            'Total General',
        ];
    }

    public function title(): string
    {
        return 'Resumen General';
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
                    'startColor' => ['rgb' => '4a5568']
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

                // Título de la hoja
                $sheet->insertNewRowBefore(1, 2);
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                $sheet->setCellValue('A1', 'RESULTADOS DE CONSULTA POPULAR - RESUMEN GENERAL POR PREGUNTA');
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 14,
                        'color' => ['rgb' => 'FFFFFF']
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '667eea']
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension(1)->setRowHeight(30);

                // Información adicional
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                $sheet->setCellValue('A2', 'Generado el: ' . now()->format('d/m/Y H:i:s') . ' | Usuario: Administrador');
                $sheet->getStyle('A2')->applyFromArray([
                    'font' => [
                        'size' => 10,
                        'italic' => true,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension(2)->setRowHeight(20);

                // Encabezado
                $sheet->getStyle('A3:J3')->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                ]);

                // Datos
                $sheet->getStyle('A4:J' . ($highestRow + 2))->applyFromArray([
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

                // Colores para las columnas de votos
                // Votos SÍ - Verde
                $sheet->getStyle('F4:F' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'c6f6d5']
                    ],
                    'font' => ['bold' => true, 'color' => ['rgb' => '22543d']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Votos NO - Rojo
                $sheet->getStyle('G4:G' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'fed7d7']
                    ],
                    'font' => ['bold' => true, 'color' => ['rgb' => '742a2a']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Votos Blancos - Gris
                $sheet->getStyle('H4:H' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'e2e8f0']
                    ],
                    'font' => ['bold' => true, 'color' => ['rgb' => '2d3748']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Votos Nulos - Naranja
                $sheet->getStyle('I4:I' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'feebc8']
                    ],
                    'font' => ['bold' => true, 'color' => ['rgb' => '7c2d12']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Total General - Azul oscuro
                $sheet->getStyle('J4:J' . ($highestRow + 2))->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'bee3f8']
                    ],
                    'font' => ['bold' => true, 'color' => ['rgb' => '1a365d']],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);

                // Centrar casillero y zonas
                $sheet->getStyle('C4:C' . ($highestRow + 2))->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('D4:D' . ($highestRow + 2))->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Identificar y estilizar filas de SUBTOTAL
                for ($i = 4; $i <= ($highestRow + 2); $i++) {
                    $cellValue = $sheet->getCell('B' . $i)->getValue();

                    if (strpos($cellValue, 'SUBTOTAL') !== false) {
                        // Estilo para filas de subtotal
                        $sheet->getStyle('A' . $i . ':J' . $i)->applyFromArray([
                            'font' => [
                                'bold' => true,
                                'size' => 10,
                                'color' => ['rgb' => 'FFFFFF']
                            ],
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['rgb' => '4a5568']
                            ],
                            'borders' => [
                                'top' => [
                                    'borderStyle' => Border::BORDER_MEDIUM,
                                    'color' => ['rgb' => '000000'],
                                ],
                                'bottom' => [
                                    'borderStyle' => Border::BORDER_MEDIUM,
                                    'color' => ['rgb' => '000000'],
                                ],
                            ],
                        ]);
                        $sheet->getRowDimension($i)->setRowHeight(22);
                    } else {
                        // Alternar colores en filas normales (solo columnas A-E)
                        if ($i % 2 == 0) {
                            $sheet->getStyle('A' . $i . ':E' . $i)->applyFromArray([
                                'fill' => [
                                    'fillType' => Fill::FILL_SOLID,
                                    'startColor' => ['rgb' => 'F7FAFC']
                                ],
                            ]);
                        }
                    }
                }

                // Ajustar altura de fila del encabezado
                $sheet->getRowDimension(3)->setRowHeight(25);

                // Agregar fila de TOTALES GENERALES al final
                $totalRow = $highestRow + 3;
                $sheet->setCellValue('A' . $totalRow, 'TOTALES GENERALES');
                $sheet->mergeCells('A' . $totalRow . ':E' . $totalRow);

                // Calcular totales de todas las columnas (excluyendo filas de SUBTOTAL)
                $sheet->setCellValue('F' . $totalRow, '=SUMIF(B4:B' . ($highestRow + 2) . ',"<>SUBTOTAL*",F4:F' . ($highestRow + 2) . ')');
                $sheet->setCellValue('G' . $totalRow, '=SUMIF(B4:B' . ($highestRow + 2) . ',"<>SUBTOTAL*",G4:G' . ($highestRow + 2) . ')');
                $sheet->setCellValue('H' . $totalRow, '=SUMIF(B4:B' . ($highestRow + 2) . ',"<>SUBTOTAL*",H4:H' . ($highestRow + 2) . ')');
                $sheet->setCellValue('I' . $totalRow, '=SUMIF(B4:B' . ($highestRow + 2) . ',"<>SUBTOTAL*",I4:I' . ($highestRow + 2) . ')');
                $sheet->setCellValue('J' . $totalRow, '=SUMIF(B4:B' . ($highestRow + 2) . ',"<>SUBTOTAL*",J4:J' . ($highestRow + 2) . ')');

                // Estilo para la fila de totales generales
                $sheet->getStyle('A' . $totalRow . ':J' . $totalRow)->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 12,
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
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_MEDIUM,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                ]);

                $sheet->getRowDimension($totalRow)->setRowHeight(28);

                // Ajustar ancho de columna de pregunta
                $sheet->getColumnDimension('E')->setWidth(50);
            },
        ];
    }
}
