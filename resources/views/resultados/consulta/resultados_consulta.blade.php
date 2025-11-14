<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de Consulta Popular</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 9px;
            color: #333;
            line-height: 1.4;
        }

        .header-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
            border: 2px solid #2d3748;
        }

        .header-table td {
            padding: 8px;
            vertical-align: middle;
        }

        .logo-cell {
            width: 15%;
            text-align: center;
            border-right: 1px solid #cbd5e0;
        }

        .logo-cell img {
            max-width: 60px;
            max-height: 60px;
            width: auto;
            height: auto;
        }

        .title-cell {
            width: 65%;
            text-align: center;
            border-right: 1px solid #cbd5e0;
        }

        .title-cell h1 {
            font-size: 14px;
            margin-bottom: 4px;
            font-weight: bold;
            color: #2d3748;
            text-transform: uppercase;
        }

        .title-cell h2 {
            font-size: 10px;
            font-weight: normal;
            margin-bottom: 4px;
            color: #4a5568;
        }

        .title-cell .fecha {
            font-size: 8px;
            margin-top: 4px;
            padding: 2px 8px;
            display: inline-block;
            border: 1px solid #cbd5e0;
            border-radius: 2px;
            background-color: #f7fafc;
            color: #2d3748;
        }

        .user-cell {
            width: 20%;
            text-align: center;
        }

        .user-cell strong {
            font-size: 9px;
            color: #2d3748;
            display: block;
            margin-bottom: 3px;
        }

        .user-cell span {
            font-size: 8px;
            color: #4a5568;
        }

        .separator-line {
            width: 100%;
            height: 2px;
            background-color: #2d3748;
            margin-bottom: 15px;
        }

        .canton-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .canton-header {
            background-color: #4a5568;
            color: white;
            padding: 10px 15px;
            border-radius: 0;
            margin-bottom: 0;
        }

        .canton-header h3 {
            font-size: 13px;
            margin-bottom: 3px;
        }

        .canton-header .total-canton {
            font-size: 10px;
        }

        .zona-container {
            border: 1px solid #cbd5e0;
            border-top: none;
            padding: 15px;
            background-color: #f7fafc;
            margin-bottom: 15px;
        }

        .zona-header {
            background-color: #edf2f7;
            padding: 8px 12px;
            border-left: 4px solid #4299e1;
            margin-bottom: 12px;
        }

        .zona-header h4 {
            font-size: 11px;
            color: #2d3748;
            margin-bottom: 3px;
        }

        .zona-header .votos-validos {
            font-size: 9px;
            color: #4a5568;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background-color: white;
        }

        table thead {
            background-color: #2d3748;
            color: white;
        }

        table thead th {
            padding: 8px 6px;
            text-align: left;
            font-size: 8px;
            font-weight: bold;
            border: 1px solid #1a202c;
        }

        table tbody td {
            padding: 7px 6px;
            border: 1px solid #e2e8f0;
            font-size: 8px;
        }

        table tbody tr:nth-child(even) {
            background-color: #f7fafc;
        }

        .pregunta-cell {
            width: 35%;
            font-weight: 500;
            color: #2d3748;
        }

        .casillero-cell {
            width: 8%;
            text-align: center;
            font-weight: bold;
            background-color: #e6fffa;
            color: #234e52;
        }

        .votos-cell {
            width: 12%;
            text-align: center;
            font-weight: bold;
        }

        .votos-si {
            background-color: #c6f6d5;
            color: #22543d;
        }

        .votos-no {
            background-color: #fed7d7;
            color: #742a2a;
        }

        .votos-blancos {
            background-color: #e2e8f0;
            color: #2d3748;
        }

        .votos-nulos {
            background-color: #feebc8;
            color: #7c2d12;
        }

        .total-row {
            background-color: #edf2f7 !important;
            font-weight: bold;
            border-top: 2px solid #4a5568;
        }

        .total-row td {
            padding: 10px 6px;
            font-size: 9px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 7px;
            color: #718096;
            padding-top: 15px;
            border-top: 2px solid #2d3748;
        }

        .footer p {
            margin: 3px 0;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    <!-- HEADER COMPACTO CON LOGO -->
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                <img src="{{ public_path('/images/LogoMediano.png') }}" alt="Logo CNE">
            </td>
            <td class="title-cell">
                <h1>RESULTADOS DE CONSULTA POPULAR</h1>
                <h2>Reporte de Votos por Cantón y Zona</h2>
                <div class="fecha">Generado el: {{ $fecha_generacion }}</div>
            </td>
            <td class="user-cell">
                <strong>Usuario:</strong>
                <span>{{ auth()->user()->nombres_completos ?? 'Sistema' }}</span>
            </td>
        </tr>
    </table>

    <div class="separator-line"></div>

    @foreach ($resultados as $canton)
        <div class="canton-section">
            <div class="canton-header">
                <h3>{{ $canton['provincia'] }} - {{ $canton['canton'] }}</h3>
                <div class="total-canton">
                    Total Votos Válidos del Cantón: {{ number_format($canton['total_votos_canton']) }}
                </div>
            </div>

            <div class="zona-container">
                @foreach ($canton['zonas'] as $zona)
                    <div class="zona-header">
                        <h4>{{ $zona['nombre_zona'] }}</h4>
                        <div class="votos-validos">
                            Votos Válidos: {{ number_format($zona['total_votos_validos']) }}
                        </div>
                    </div>

                    @if (count($zona['preguntas']) > 0)
                        <table>
                            <thead>
                                <tr>
                                    <th class="casillero-cell">Casillero</th>
                                    <th class="pregunta-cell">Pregunta</th>
                                    <th class="votos-cell">Votos SÍ</th>
                                    <th class="votos-cell">Votos NO</th>
                                    <th class="votos-cell">Votos Blancos</th>
                                    <th class="votos-cell">Votos Nulos</th>
                                    <th class="votos-cell">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @php
                                    $total_si = 0;
                                    $total_no = 0;
                                    $total_blancos = 0;
                                    $total_nulos = 0;
                                @endphp

                                @foreach ($zona['preguntas'] as $pregunta)
                                    @php
                                        $total_pregunta =
                                            $pregunta->total_votos_si +
                                            $pregunta->total_votos_no +
                                            $pregunta->total_votos_blancos +
                                            $pregunta->total_votos_nulos;
                                        $total_si += $pregunta->total_votos_si;
                                        $total_no += $pregunta->total_votos_no;
                                        $total_blancos += $pregunta->total_votos_blancos;
                                        $total_nulos += $pregunta->total_votos_nulos;
                                    @endphp
                                    <tr>
                                        <td class="casillero-cell">{{ $pregunta->casillero_pregunta }}</td>
                                        <td class="pregunta-cell">{{ $pregunta->texto_pregunta }}</td>
                                        <td class="votos-cell votos-si">{{ number_format($pregunta->total_votos_si) }}
                                        </td>
                                        <td class="votos-cell votos-no">{{ number_format($pregunta->total_votos_no) }}
                                        </td>
                                        <td class="votos-cell votos-blancos">
                                            {{ number_format($pregunta->total_votos_blancos) }}</td>
                                        <td class="votos-cell votos-nulos">
                                            {{ number_format($pregunta->total_votos_nulos) }}</td>
                                        <td class="votos-cell">{{ number_format($total_pregunta) }}</td>
                                    </tr>
                                @endforeach

                                <tr class="total-row">
                                    <td colspan="2" style="text-align: right; padding-right: 10px;">TOTALES DE LA
                                        ZONA:</td>
                                    <td class="votos-cell votos-si">{{ number_format($total_si) }}</td>
                                    <td class="votos-cell votos-no">{{ number_format($total_no) }}</td>
                                    <td class="votos-cell votos-blancos">{{ number_format($total_blancos) }}</td>
                                    <td class="votos-cell votos-nulos">{{ number_format($total_nulos) }}</td>
                                    <td class="votos-cell">
                                        {{ number_format($total_si + $total_no + $total_blancos + $total_nulos) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    @else
                        <p style="text-align: center; padding: 15px; color: #718096; font-style: italic;">
                            No hay preguntas registradas para esta zona
                        </p>
                    @endif

                    @if (!$loop->last)
                        <hr style="margin: 20px 0; border: none; border-top: 1px dashed #cbd5e0;">
                    @endif
                @endforeach
            </div>
        </div>

        @if (!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

    <div class="footer">
        <p><strong>Sistema de Gestión Electoral - Documento Generado Automáticamente</strong></p>
        <p>Generado por: {{ auth()->user()->nombres_completos ?? 'Sistema' }} | Fecha: {{ $fecha_generacion }}</p>
        <p>© {{ date('Y') }} - Todos los derechos reservados</p>
    </div>
</body>

</html>
