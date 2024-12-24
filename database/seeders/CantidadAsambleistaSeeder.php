<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CantidadAsambleistaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cantidad_asambleistas')->delete();
        $asambleistas = [
            [
                'provincia_id' => 8,
                'cantidad'     => 5
            ]
        ];
        DB::table('cantidad_asambleistas')->insert($asambleistas);
    }
}
