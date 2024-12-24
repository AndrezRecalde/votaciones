<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('provincias')->delete();
        $provincias = [
            [
                'cod_cne_prov'      => 1,
                'nombre_provincia'  =>  'Azuay',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 2,
                'nombre_provincia'  =>  'Bolívar',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 3,
                'nombre_provincia'  =>  'Cañar',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 4,
                'nombre_provincia'  =>  'Carchi',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 5,
                'nombre_provincia'  =>  'Cotopaxi',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 6,
                'nombre_provincia'  =>  'Chimborazo',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 7,
                'nombre_provincia'  =>  'El Oro',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 8,
                'nombre_provincia'  =>  'Esmeraldas',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 9,
                'nombre_provincia'  =>  'Guayas',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 10,
                'nombre_provincia'  =>  'Imbabura',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 11,
                'nombre_provincia'  =>  'Loja',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 12,
                'nombre_provincia'  =>  'Los Ríos',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 13,
                'nombre_provincia'  =>  'Manabí',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 14,
                'nombre_provincia'  =>  'Morona Santiago',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 15,
                'nombre_provincia'  =>  'Napo',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 16,
                'nombre_provincia'  =>  'Pastaza',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 17,
                'nombre_provincia'  =>  'Pichincha',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 18,
                'nombre_provincia'  =>  'Tungurahua',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 19,
                'nombre_provincia'  =>  'Zamora Chinchipe',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 20,
                'nombre_provincia'  =>  'Galapagos',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 21,
                'nombre_provincia'  =>  'Sucumbios',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 22,
                'nombre_provincia'  =>  'Orellana',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 23,
                'nombre_provincia'  =>  'Santo Domingo de los Tsachilas',
                'activo'            =>  1
            ],
            [
                'cod_cne_prov'      => 24,
                'nombre_provincia'  =>  'Santa Elena',
                'activo'            =>  1
            ],
        ];
        DB::table('provincias')->insert($provincias);
    }
}
