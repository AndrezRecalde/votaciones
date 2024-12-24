<?php

namespace App\Interfaces;
use Illuminate\Http\Request;


interface ActaInterface {

    public function getDignidadesForActaWithId($dignidad_id, $provincia_id, $canton_id, $parroquia_id, $acta_id);
    public function getDignidadesForActa($dignidad_id, $provincia_id, $canton_id, $parroquia_id);


}


