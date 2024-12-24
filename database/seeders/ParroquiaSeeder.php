<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ParroquiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('parroquias')->delete();
        $parroquias = [
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'CAMARONES',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'CRNL.CARLOS CONCHA TORRES',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'CHINCA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'MAJUA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'SAN MATEO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'TABIAZO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'TACHINA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  6,
                'nombre_parroquia'  => 'VUELTA LARGA',
                'tipo'              =>  'R'
            ],

            [
                'canton_id'         =>  4,
                'nombre_parroquia'  => 'BARTOLOME RUIZ',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  5,
                'nombre_parroquia'  => '5 DE AGOSTO',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  4,
                'nombre_parroquia'  => 'ESMERALDAS',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  4,
                'nombre_parroquia'  => 'LUIS TELLO/LAS PALMAS',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  5,
                'nombre_parroquia'  => 'SIMÓN PLATA TORRES',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'CHONTADURO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'CHUMUNDE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'LAGARTO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'MONTALVO/HORQUETA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'ROCAFUERTE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  9,
                'nombre_parroquia'  => 'RIOVERDE',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'ANCHAYACU',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'ATAHUALPA/CAMARONES',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'BORBON',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'SAN JOSE DE CAYAPAS',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'COLON ELOY DE MARIA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'TIMBIRE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'LA TOLA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'LUIS VARGAS TORRES',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'MALDONADO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'PAMPANAL DE BOLIVAR',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'SAN FRANCISCO DE ONZOLE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'SELVA ALEGRE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'TELEMBI',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'SANTO DOMINGO DE ONZOLE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'SANTA LUCIA DE LAS PEÑAS',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  2,
                'nombre_parroquia'  => 'VALDEZ/LIMONES',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'BOLIVAR',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'DAULE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'GALERA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'QUINGUE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'SALIMA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'SAN FRANCISCO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'SAN GREGORIO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'SAN JOSE DE CHAMANGA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  7,
                'nombre_parroquia'  => 'MUISNE',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'CUBE/CHANCAMA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'CHURA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'LA UNION',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'MALIMPIA/GUAYLLABAMBA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'VICHE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  8,
                'nombre_parroquia'  => 'ROSA ZARATE',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'ALTO TAMBO/GUADAL',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'ANCON/PALMA REAL',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'CALDERON',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'CARONDELET',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => '5 DE JUNIO/HUIMBI',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'CONCEPCION',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'MATAJE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'SAN JAVIER DE CACHABI',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'SANTA RITA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'TAMBILLO',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'TULULBI /RICAURTE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'URBINA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  10,
                'nombre_parroquia'  => 'SAN LORENZO',
                'tipo'              =>  'U'
            ],
            [
                'canton_id'         =>  1,
                'nombre_parroquia'  => 'TONSUPA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  1,
                'nombre_parroquia'  => 'LA UNION',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  1,
                'nombre_parroquia'  => 'SUA/BOCANA',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  1,
                'nombre_parroquia'  => 'TONCHIGUE',
                'tipo'              =>  'R'
            ],
            [
                'canton_id'         =>  1,
                'nombre_parroquia'  => 'ATACAMES',
                'tipo'              =>  'U'
            ],
        ];
        DB::table('parroquias')->insert($parroquias);
    }
}
