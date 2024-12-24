<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CantidadConcejalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cantidad_concejales')->delete();

        $concejales = [
            [
                'provincia_id'  => 8,
                'canton_id'     => 1,
                'cantidad_urbanos' => 2,
                'cantidad_rurales' => 3
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 2,
                'cantidad_urbanos' => 1,
                'cantidad_rurales' => 4
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 4,
                'cantidad_urbanos' => 4,
                'cantidad_rurales' => 0
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 5,
                'cantidad_urbanos' => 4,
                'cantidad_rurales' => 0
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 6,
                'cantidad_urbanos' => 0,
                'cantidad_rurales' => 1
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 7,
                'cantidad_urbanos' => 1,
                'cantidad_rurales' => 2
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 8,
                'cantidad_urbanos' => 5,
                'cantidad_rurales' => 4
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 9,
                'cantidad_urbanos' => 1,
                'cantidad_rurales' => 4
            ],
            [
                'provincia_id' => 8,
                'canton_id'    => 10,
                'cantidad_urbanos' => 3,
                'cantidad_rurales' => 2
            ],
        ];

        DB::table('cantidad_concejales')->insert($concejales);
    }
}
