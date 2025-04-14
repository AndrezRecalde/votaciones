<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Resultados</title>
    <style>
        @page {
            size: 21cm 29.7cm;
            margin: 20px;
        }

        body {
            font-family: Arial, sans-serif;
            background-repeat: no-repeat;
            background-size: cover;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 0.5px solid gray;
            /* Corrige el borde */
            table-layout: auto;
            /* Cambia a 'auto' para ajustar el ancho según el contenido */
            margin-bottom: 25px;
            margin-top: 25px;
        }

        th,
        td {
            padding: 3px;
            vertical-align: top;
            border: 1px solid black;
            font-size: 12px;
            /* Borde para celdas */
        }

        input {
            width: 98%;
            /* Ancho casi completo */
            box-sizing: border-box;
            /* Incluye padding y border en el ancho total */
            font-size: 14px;
            /* Tamaño de fuente */
            border: none;
            outline: none;
        }

        .header {
            text-align: center;
        }

        .header h4,
        .header h5 {
            margin: 15px 0;
            /* Reduce márgenes */
        }

        .img-container {
            text-align: center;
        }

        .img-fluid {
            display: block;
            margin: 15 auto;
            width: 50px;
            height: auto;
        }

        hr {
            border: 0.5px solid gray;
            height: 0.3px;
            margin-top: 1%;
            margin-bottom: 0%;
        }

        h4 {
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 5px;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <td class="img-container">
                <img class="img-fluid" alt="logo" src={{ public_path('/images/LogoMediano.png') }}>
            </td>
            <td colspan="3" class="header">
                <h3>{{ Str::upper($title) . $resultados[0]['dignidades'][0]['dignidad'] ?? 'Sin dignidad' }}</h3>
                <hr>
                <h3>{{ $fecha }}</h3>
            </td>
        </tr>
    </table>
    <h3>Resultados por Cantón</h3>
    @foreach ($resultados as $canton)
        <h4>Cantón: {{ $canton['nombre_canton'] }}</h4>
        <p><strong>Total votos:</strong> {{ number_format($canton['total_votos_validos']) }}</p>

        @foreach ($canton['dignidades'] as $dignidad)
            <h4>{{ $dignidad['dignidad'] }}</h4>

            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Nombre del Candidato</th>
                        <th>Total de Votos</th>
                        <th>Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($dignidad['candidatos'] as $candidato)
                        @php
                            // Evitar división por cero
                            $porcentaje =
                                $canton['total_votos_validos'] > 0
                                    ? ($candidato['total_votos'] / $canton['total_votos_validos']) * 100
                                    : 0;
                        @endphp
                        <tr>
                            <td>{{ $candidato['nombre_candidato'] }}</td>
                            <td>{{ number_format($candidato['total_votos']) }}</td>
                            <td>{{ number_format($porcentaje, 2) }}%</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endforeach

        <hr>
    @endforeach
</body>

</html>
