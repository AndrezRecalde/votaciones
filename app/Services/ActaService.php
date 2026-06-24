<?php

namespace App\Services;

use App\Interfaces\ActaInterface;
use App\Models\Acta;
use Illuminate\Support\Facades\DB;

class ActaService
{
    private ActaInterface $actaRepository;

    public function __construct(ActaInterface $actaRepository)
    {
        $this->actaRepository = $actaRepository;
    }

    /**
     * @param array $datosActa Datos validados del Request
     * @param array|null $votos Arreglo de votos
     */
    public function procesarNuevaActa(array $datosActa, ?array $votos)
    {
        return DB::transaction(function () use ($datosActa, $votos) {
            $acta = Acta::create($datosActa);
            $this->sincronizarCandidatos($acta, $votos);
            return $acta;
        });
    }

    /**
     * @param Acta $acta
     * @param array $datosActa
     * @param array|null $votos
     * @param int $userId
     */
    public function actualizarActa(Acta $acta, array $datosActa, ?array $votos, int $userId)
    {
        return DB::transaction(function () use ($acta, $datosActa, $votos, $userId) {
            $acta->fill($datosActa);
            $acta->user_update = $userId;
            $acta->save();
            
            $acta->candidatos()->detach();
            $this->sincronizarCandidatos($acta, $votos);
            return $acta;
        });
    }

    private function sincronizarCandidatos(Acta $acta, ?array $votos)
    {
        $dignidad = (int)$acta->dignidad_id;
        $candidatos = [];

        if (in_array($dignidad, [1, 2, 3, 4])) {
            $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, 0, 0);
        } else if (in_array($dignidad, [5, 6, 7])) {
            $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, 0);
        } else if ($dignidad === 8) {
            $candidatos = $this->actaRepository->getDignidadesForActa($acta->dignidad_id, $acta->provincia_id, $acta->canton_id, $acta->parroquia_id);
        }

        $votos = $votos ?? [];
        $index = 0;

        $candidatosSync = [];
        foreach ($candidatos as $candidato) {
            $num_voto = $votos[$index] ?? 0;
            $candidatosSync[$candidato->id] = ['num_votos' => $num_voto];
            $index++;
        }

        if (!empty($candidatosSync)) {
            $acta->candidatos()->attach($candidatosSync);
        }
    }
}
