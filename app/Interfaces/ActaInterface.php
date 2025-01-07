<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;


interface ActaInterface {

    public function getDignidadesForActaWithId($dignidad_id, $provincia_id, $canton_id, $parroquia_id, $acta_id): Collection;
    public function getDignidadesForActa($dignidad_id, $provincia_id, $canton_id, $parroquia_id): Collection;


}


