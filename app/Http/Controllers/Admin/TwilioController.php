<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Models\Acta;
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
        if ($request->message) {
            return $this->sendCustomWhatsAppMessage($request->phone, $request->message);
        }

        $resultados = $this->fetchResultados($request);
        $totalIngresadas = $this->fetchTotalIngresadas($request)->digitadas;

        $mensaje = $request->dignidad_id == 2 || $request->dignidad_id == 3
            ? $this->generateWebsterResultsMessage($resultados, $totalIngresadas)
            : $this->generateResultadosMessage($resultados, $totalIngresadas);

        return $this->sendCustomWhatsAppMessage($request->phone, $mensaje);
    }

    private function sendCustomWhatsAppMessage(string $phone, string $message)
    {
        try {
            $response = $this->twilioService->sendWhatsAppMessage($phone, $message);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg' => 'Mensaje enviado correctamente.',
                'data' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg' => 'Error al enviar el mensaje.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    function fetchTotalIngresadas(Request $request)  {
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

    private function fetchResultados(Request $request)
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

    private function generateWebsterResultsMessage($resultados, $totalIngresadas)
    {
        $totalEscanios = 5; // Número de escaños a asignar
        $divisores = [1, 3, 5, 7, 9]; // Divisores de Webster
        $tablaWebster = [];

        foreach ($resultados as $partido) {
            foreach ($divisores as $divisor) {
                $tablaWebster[] = [
                    'nombre_organizacion' => $partido['nombre_organizacion'],
                    'cociente' => $partido['total_votos'] / $divisor,
                ];
            }
        }

        usort($tablaWebster, fn($a, $b) => $b['cociente'] <=> $a['cociente']);

        $escaniosSeleccionados = array_slice($tablaWebster, 0, $totalEscanios);

        $conteoEscanios = [];
        foreach ($escaniosSeleccionados as $escanio) {
            $conteoEscanios[$escanio['nombre_organizacion']] = ($conteoEscanios[$escanio['nombre_organizacion']] ?? 0) + 1;
        }

        $mensaje = "*RESULTADOS: " . $resultados[0]['nombre_dignidad'] . "*\n";
        $mensaje .= "*ESCRUTADO: " . number_format(($totalIngresadas/1402) * 100, 2) . "%*\n\n";

        foreach ($resultados as $partido) {
            $mensaje .= "*_Candidato:_* " . $partido['nombre_organizacion'] . "\n";
            $mensaje .= "*_Total de votos:_* " . $partido['total_votos'] . "\n";
            $mensaje .= "*_Total de escaños:_* " . ($conteoEscanios[$partido['nombre_organizacion']] ?? 0) . "\n\n";
            $mensaje .= "-----------------------------------\n";
        }

        return $mensaje;
    }

    private function generateResultadosMessage($resultados, $totalIngresadas)
    {
        $mensaje = "*Resultados: " . $resultados[0]['nombre_dignidad'] . "*\n";
        $mensaje .= "*ESCRUTADO: " . number_format(($totalIngresadas/1402) * 100, 2) . "%*\n\n";

        foreach ($resultados as $resultado) {
            $mensaje .= "*_Candidato:_* " . $resultado['nombre_candidato'] . "\n";
            $mensaje .= "*_Total de votos:_* " . $resultado['total_votos'] . "\n\n";
            $mensaje .= "-----------------------------------\n";
        }

        return $mensaje;
    }
}
