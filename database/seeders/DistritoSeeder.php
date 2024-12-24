<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DistritoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('distritos')->delete();

        $distritos = [
            [
                'tipo_distrito' => 'PROVINCIAL',
            ],
            [
                'tipo_distrito' => 'CANTONAL',
            ],
            [
                'tipo_distrito' => 'PARROQUIAL',
            ],
        ];
        DB::table('distritos')->insert($distritos);
    }
}
