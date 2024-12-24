<?php

namespace App\Repositories;

use App\Interfaces\ActaInterface;
use App\Models\Candidato;

class ActaRepository implements ActaInterface
{
    public function getDignidadesForActaWithId($dignidad_id, $provincia_id, $canton_id, $parroquia_id, $acta_id)
    {

        $candidatos = Candidato::from('candidatos as c')
            ->selectRaw('c.id, c.nombre_candidato, org.nombre_organizacion,
                         org.numero_organizacion, org.sigla, org.color, org.logo_url, ac.num_votos')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('provincias as prov', 'prov.id', 'cd.provincia_id')
            ->leftJoin('cantones as cant', 'cant.id', 'cd.canton_id')
            ->leftJoin('parroquias as parr', 'parr.id', 'cd.parroquia_id')
            ->leftJoin('acta_candidato as ac', 'ac.candidato_id', 'c.id')
            ->dignidadId($dignidad_id)
            ->provinciaId($provincia_id)
            ->cantonId($canton_id)
            ->parroquiaId($parroquia_id)
            ->acta($acta_id)
            ->orderBy('org.numero_organizacion', 'ASC')
            ->get();

        return $candidatos;
    }

    public function getDignidadesForActa($dignidad_id, $provincia_id, $canton_id, $parroquia_id)
    {

        $candidatos = Candidato::from('candidatos as c')
            ->selectRaw('c.id, c.nombre_candidato, org.nombre_organizacion,
                         org.numero_organizacion, org.sigla, org.color, org.logo_url')
            ->join('organizaciones as org', 'org.id', 'c.organizacion_id')
            ->join('candidato_distrito as cd', 'cd.candidato_id', 'c.id')
            ->join('provincias as prov', 'prov.id', 'cd.provincia_id')
            ->leftJoin('cantones as cant', 'cant.id', 'cd.canton_id')
            ->leftJoin('parroquias as parr', 'parr.id', 'cd.parroquia_id')
            ->dignidadId($dignidad_id)
            ->provinciaId($provincia_id)
            ->cantonId($canton_id)
            ->parroquiaId($parroquia_id)
            ->orderBy('org.numero_organizacion', 'ASC')
            ->get();

        return $candidatos;
    }
}
