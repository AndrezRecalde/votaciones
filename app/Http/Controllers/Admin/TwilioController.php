<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActaCandidato;
use App\Services\TwilioService;
use Illuminate\Http\Request;

class TwilioController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function sendWhatsApp(Request $request)
    {
        /* $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
        ]); */

        $resultados = ActaCandidato::from('acta_candidato as ac')
            ->selectRaw('d.nombre_dignidad, c.nombre_candidato,
                org.nombre_organizacion, org.numero_organizacion, org.sigla, org.color,
                SUM(ac.num_votos) as total_votos')
            ->join('actas as a', 'a.id', 'ac.acta_id')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('candidatos as c', 'c.id', 'ac.candidato_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('juntas as j', 'j.id', 'a.junta_id')
            ->join('zonas as z', 'z.id', 'a.zona_id')
            ->join('parroquias as parr', 'parr.id', 'a.parroquia_id')
            ->join('cantones as cant', 'cant.id', 'parr.canton_id')
            ->join('recintos as re', 're.id', 'j.recinto_id')
            ->dignidad($request->dignidad_id)
            ->provincia($request->provincia_id)
            ->canton($request->canton_id)
            ->parroquia($request->parroquia_id)
            ->recinto($request->recinto_id)
            ->cuadrada($request->cuadrada)
            ->legible($request->legible)
            ->groupBy('ac.candidato_id', 'd.nombre_dignidad')
            ->orderBy('total_votos', 'DESC')
            ->get();


        if ($request->dignidad_id == 2 || $request->dignidad_id == 3) {
            $totalEscanios = 5; // Número de escaños a asignar
            $divisores = [1, 3, 5, 7, 9]; // Divisores de Webster
            $tablaWebster = [];

            // Generar tabla con los cocientes
            foreach ($resultados as $partido) {
                foreach ($divisores as $divisor) {
                    $tablaWebster[] = [
                        'nombre_organizacion' => $partido['nombre_organizacion'],
                        'cociente' => $partido['total_votos'] / $divisor,
                    ];
                }
            }

            // Ordenar la tabla de mayor a menor por cociente
            usort($tablaWebster, function ($a, $b) {
                return $b['cociente'] <=> $a['cociente'];
            });

            // Seleccionar los 5 cocientes más altos
            $escaniosSeleccionados = array_slice($tablaWebster, 0, $totalEscanios);

            // Contar cuántos escaños recibe cada partido
            $conteoEscanios = [];
            foreach ($escaniosSeleccionados as $escanio) {
                if (!isset($conteoEscanios[$escanio['nombre_organizacion']])) {
                    $conteoEscanios[$escanio['nombre_organizacion']] = 0;
                }
                $conteoEscanios[$escanio['nombre_organizacion']]++;
            }
            // Formatear el resultado
            $resultadoFinal = [];
            foreach ($resultados as $partido) {
                $resultadoFinal[] = [
                    'nombre_organizacion' => $partido['nombre_organizacion'],
                    'escanios' => $conteoEscanios[$partido['nombre_organizacion']] ?? 0,
                ];
            }

            $mensaje = "Resultados: " . $resultados[0]['nombre_dignidad'] . "\n\n"; // Encabezado del mensaje
            foreach ($resultadoFinal as $resultado) {
                $mensaje .= "Candidato: " . $resultado['nombre_organizacion'] . "\n";
                $mensaje .= "Total de escanios: " . $resultado['escanios'] . "\n\n";
                $mensaje .= "-----------------------------------\n";
            }
        } else {
            $mensaje = "Resultados: " . $resultados[0]['nombre_dignidad'] . "\n\n"; // Encabezado del mensaje

            foreach ($resultados as $resultado) {
                $mensaje .= "Candidato: " . $resultado['nombre_candidato'] . "\n";
                $mensaje .= "Total de votos: " . $resultado['total_votos'] . "\n\n";
                $mensaje .= "-----------------------------------\n";
            }
        }

        try {
            $response = $this->twilioService->sendWhatsAppMessage(
                $request->phone,
                $mensaje
            );

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente.',
                'data' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
