<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DignidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('dignidades')->delete();
        $dignidades = [
            [
                'nombre_dignidad'   =>  'PRESIDENTES Y VICEPRESIDENTES',
                'tipo_dignidad'     =>  'T',
                'activo'            =>  1
            ],
            [
                'nombre_dignidad'   =>  'ASAMBLEISTAS NACIONALES',
                'tipo_dignidad'     =>  'W',
                'activo'            =>  1
            ],
            [
                'nombre_dignidad'   =>  'ASAMBLEISTAS PROVINCIALES',
                'tipo_dignidad'     =>  'W',
                'activo'            =>  1
            ],
            [
                'nombre_dignidad'   =>  'PREFECTOS Y VICEPREFECTOS',
                'tipo_dignidad'     =>  'T',
                'activo'            =>  0
            ],
            [
                'nombre_dignidad'   =>  'ALCALDES MUNICIPALES',
                'tipo_dignidad'     =>  'T',
                'activo'            =>  0
            ],
            [
                'nombre_dignidad'   =>  'CONCEJALES URBANOS',
                'tipo_dignidad'     =>  'W',
                'activo'            =>  0
            ],
            [
                'nombre_dignidad'   =>  'CONCEJALES RURALES',
                'tipo_dignidad'     =>  'W',
                'activo'            =>  0
            ],
            [
                'nombre_dignidad'   =>  'JUNTAS PARROQUIALES',
                'tipo_dignidad'     =>  'W',
                'activo'            =>  0
            ],
        ];
        DB::table('dignidades')->insert($dignidades);
    }
}
