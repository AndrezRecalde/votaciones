<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Resultados</title>
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

        .canton {
            margin-bottom: 3rem;
        }

        .zona {
            background: #fff;
            padding: 1rem 2rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
                <h3>REPORTE DE RESULTADO POR ZONAS</h3>
                <hr>
                <h3>{{ $fecha }}</h3>
            </td>
        </tr>
    </table>
    @foreach ($resultados as $canton)
        <div class="canton">
            <h4>Canton: {{ $canton['nombre_canton'] }}</h4>

            @foreach ($canton['zonas'] as $zona)
                <div class="zona">
                    <h5>{{ $zona['nombre_zona'] }}</h5>
                    <div class="total-votos"><strong>Total votos válidos:</strong> {{ $zona['total_votos_validos'] }}
                    </div>

                    @foreach ($zona['dignidades'] as $dignidad)
                        <h4>{{ $dignidad['dignidad'] }}</h4>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Candidato</th>
                                    <th>Total de Votos</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($dignidad['candidatos'] as $candidato)
                                    <tr>
                                        <td>{{ $candidato['nombre_candidato'] }}</td>
                                        <td>{{ $candidato['total_votos'] }}</td>
                                        <td>{{ number_format(($candidato['total_votos'] * 100) / $zona['total_votos_validos'],2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endforeach

                </div>
            @endforeach

        </div>
    @endforeach

</body>

</html>
