<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class OrganizacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('organizaciones')->delete();

        $organizaciones = [
            [
                'nombre_organizacion' => 'Centro Democrático',
                'numero_organizacion' => '1',
                'sigla' => 'CD',
                'color' => '#f3982d'
            ],
        ];

        DB::table('organizaciones')->insert($organizaciones);
    }
}
