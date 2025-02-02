<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\Acta;
use App\Models\ActaCandidato;
use App\Models\Guess;
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
        // Si el request tiene un mensaje, solo lo envía a los teléfonos de Guess
        if ($request->message) {
            return $this->sendBulkWhatsAppMessage(
                Guess::pluck('telefono')->toArray(),
                $request->message
            );
        }

        // Realiza la consulta si hay una dignidad_id
        $resultados = $this->getElectionResults($request);
        $totalIngresadas = $this->fetchTotalIngresadas($request)->digitadas;

        if (!$resultados->isEmpty()) {
            $mensaje = $this->formatElectionResults($request->dignidad_id, $resultados, $totalIngresadas);
            return $this->sendBulkWhatsAppMessage(
                Guess::pluck('telefono')->toArray(),
                $mensaje
            );
        }

        return response()->json([
            'success' => false,
            'message' => 'No se encontraron resultados para los filtros proporcionados.',
        ]);
    }

    /**
     * Envía un mensaje de WhatsApp a múltiples números de teléfono.
     */
    private function sendBulkWhatsAppMessage(array $phones, string $message)
    {
        try {
            $responses = [];
            foreach ($phones as $phone) {
                $responses[] = $this->twilioService->sendWhatsAppMessage($phone, $message);
            }

            return response()->json([
                'success' => true,
                'message' => 'Mensajes enviados correctamente.',
                'data' => $responses,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar los mensajes.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    function fetchTotalIngresadas(Request $request)
    {
        return Acta::from('actas as a')
            ->selectRaw('COUNT(a.id) AS digitadas')
            ->join('dignidades as d', 'd.id', 'a.dignidad_id')
            ->join('provincias as prov', 'prov.id', 'a.provincia_id')
            ->join('cantones as cant', 'cant.id', 'a.canton_id')
            ->join('parroquias as parr', 'parr.id', 'a.parroquia_id')
            ->dignidad($request->dignidad_id)
            ->provincia($request->provincia_id)
            //->canton($request->canton_id)
            //->parroquia($request->parroquia_id)
            ->first();
    }

    /**
     * Realiza la consulta de resultados electorales.
     */
    private function getElectionResults(Request $request)
    {
        return ActaCandidato::from('acta_candidato as ac')
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
            ->limit(5)
            ->get();
    }

    /**
     * Formatea los resultados de la elección en un mensaje de WhatsApp.
     */
    private function formatElectionResults($dignidadId, $resultados, $totalIngresadas)
    {
        if (in_array($dignidadId, [2, 3])) {
            return $this->calculateWebsterSeats($resultados, $totalIngresadas);
        }

        // Formato para dignidades normales
        $mensaje = "*RESULTADOS: " . $resultados[0]->nombre_dignidad . "*\n\n";
        $mensaje .= "*ESCRUTADO: " . number_format(($totalIngresadas / 1413) * 100, 2) . "%*\n\n";

        foreach ($resultados as $resultado) {
            $mensaje .= "*_Candidato:_* " . $resultado->nombre_candidato . "\n";
            $mensaje .= "*_Total de votos:_* " . $resultado->total_votos . "\n\n";
            $mensaje .= "-----------------------------------\n";
        }

        return $mensaje;
    }

    /**
     * Aplica el método de Webster para calcular los escaños y formatea el mensaje.
     */
    private function calculateWebsterSeats($resultados, $totalIngresadas)
    {
        $totalEscanios = 5;
        $divisores = [1, 3, 5, 7, 9];
        $tablaWebster = [];

        foreach ($resultados as $partido) {
            foreach ($divisores as $divisor) {
                $tablaWebster[] = [
                    'nombre_organizacion' => $partido->nombre_organizacion,
                    'cociente' => $partido->total_votos / $divisor,
                ];
            }
        }

        usort($tablaWebster, fn($a, $b) => $b['cociente'] <=> $a['cociente']);
        $escaniosSeleccionados = array_slice($tablaWebster, 0, $totalEscanios);

        $conteoEscanios = [];
        foreach ($escaniosSeleccionados as $escanio) {
            $conteoEscanios[$escanio['nombre_organizacion']] = ($conteoEscanios[$escanio['nombre_organizacion']] ?? 0) + 1;
        }

        $mensaje = "*RESULTADOS: " . $resultados[0]->nombre_dignidad . "*\n\n";
        $mensaje .= "*ESCRUTADO: " . number_format(($totalIngresadas / 1413) * 100, 2) . "%*\n\n";
        foreach ($resultados as $partido) {
            $mensaje .= "*_Candidato:_* " . $partido->nombre_organizacion . "\n";
            $mensaje .= "*_Total de votos:_* " . $partido['total_votos'] . "\n";
            $mensaje .= "*_Total de escanios:_* " . ($conteoEscanios[$partido->nombre_organizacion] ?? 0) . "\n\n";
            $mensaje .= "-----------------------------------\n";
        }

        return $mensaje;
    }
}
