<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        Role::truncate();

        $adminRole = Role::create(['name' => 'ADMIN']);
        $digitadorRole = Role::create(['name' => 'DIGITADOR']);
        $visualizadorRole = Role::create(['name' => 'VISUALIZADOR']);


        $admin = New User;
        $admin->nombres_completos = 'Cristhian Recalde';
        $admin->dni = '0802704171';
        $admin->provincia_id = 8;
        $admin->password = Hash::make('a123456');
        $admin->activo = 1;
        $admin->user_id = 1;
        $admin->save();
        $admin->assignRole($adminRole);

        $digitador_p = New User;
        $digitador_p->nombres_completos = 'Digitador Provincial';
        $digitador_p->dni = '0877446630';
        $digitador_p->provincia_id = 8;
        $digitador_p->password = Hash::make('123456');
        $digitador_p->activo = 1;
        $digitador_p->user_id = 1;
        $digitador_p->save();
        $digitador_p->assignRole($digitadorRole);

        $digitador_c = New User;
        $digitador_c->nombres_completos = 'Digitador Cantonal';
        $digitador_c->dni = '0811447788';
        $digitador_c->provincia_id = 8;
        $digitador_c->canton_id = 1;
        $digitador_c->password = Hash::make('123456');
        $digitador_c->activo = 1;
        $digitador_c->user_id = 1;
        $digitador_c->save();
        $digitador_c->assignRole($digitadorRole);

        $visualizador = New User;
        $visualizador->nombres_completos = 'Visualizador Prueba';
        $visualizador->dni = '0811445596';
        $visualizador->provincia_id = 8;
        $visualizador->password = Hash::make('123456');
        $visualizador->activo = 1;
        $visualizador->user_id = 1;
        $visualizador->save();
        $visualizador->assignRole($visualizadorRole);

    }
}
