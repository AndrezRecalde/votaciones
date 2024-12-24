<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CantonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cantones')->delete();
        $cantones = [
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ATACAMES'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ELOY ALFARO'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ESMERALDAS'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ESMERALDAS CIRCUNSC. 1'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ESMERALDAS CIRCUNSC. 2'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'ESMERALDAS RURAL'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'MUISNE'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'QUININDE'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'RIOVERDE'
            ],
            [
                'provincia_id'  => 8,
                'nombre_canton' => 'SAN LORENZO'
            ],
        ];
        DB::table('cantones')->insert($cantones);
    }
}
