<?php

namespace App\Services;

use App\Models\Candidato;
use App\Interfaces\ActaInterface;

class CandidatoService
{
    private ActaInterface $actaRepository;

    public function __construct(ActaInterface $actaRepository)
    {
        $this->actaRepository = $actaRepository;
    }

    public function crearCandidato(array $data, int $distritoId, array $distritoData)
    {
        $candidato = Candidato::create($data);
        $candidato->distritos()->attach($distritoId, $distritoData);
        return $candidato;
    }

    public function actualizarCandidato(Candidato $candidato, array $data, ?int $distritoId, ?array $distritoData)
    {
        $candidato->update($data);

        if ($distritoId && $distritoData) {
            $candidato->distritos()->detach();
            $candidato->distritos()->sync([$distritoId => $distritoData]);
        }

        return $candidato;
    }

    public function eliminarCandidato(Candidato $candidato)
    {
        $candidato->distritos()->detach();
        return $candidato->delete();
    }

    public function obtenerCandidatosParaActa(
        int $dignidad, 
        int $provincia, 
        int $canton, 
        int $parroquia, 
        ?int $acta = null
    ) {
        $niveles = match (true) {
            in_array($dignidad, [1, 2, 3, 4]) => [$provincia, 0, 0],
            in_array($dignidad, [5, 6, 7]) => [$provincia, $canton, 0],
            $dignidad === 8 => [$provincia, $canton, $parroquia],
            default => throw new \InvalidArgumentException('Dignidad no válida')
        };

        [$nivelProvincia, $nivelCanton, $nivelParroquia] = $niveles;

        if ($acta !== null) {
            return $this->actaRepository->getDignidadesForActaWithId(
                $dignidad,
                $nivelProvincia,
                $nivelCanton,
                $nivelParroquia,
                $acta
            );
        }

        return $this->actaRepository->getDignidadesForActa(
            $dignidad,
            $nivelProvincia,
            $nivelCanton,
            $nivelParroquia
        );
    }
}
