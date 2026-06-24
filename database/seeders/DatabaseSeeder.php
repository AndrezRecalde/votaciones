<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            $this->call(RoleAndPermissionSeeder::class);
            // Data is imported via php artisan migrate:legacy-data command
            $this->call(UserSeeder::class);
            $this->call(ZonaSeeder::class);
            $this->call(RecintoSeeder::class);
        } else {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            $this->call(ProvinciaSeeder::class);
            $this->call(CantonSeeder::class);
            $this->call(ParroquiaSeeder::class);
            $this->call(ZonaSeeder::class);
            $this->call(RecintoSeeder::class);

            $this->call(DistritoSeeder::class);
            $this->call(DignidadSeeder::class);

            $this->call(CantidadConcejalSeeder::class);
            $this->call(CantidadAsambleistaSeeder::class);

            $this->call(OrganizacionSeeder::class);

            $this->call(UserSeeder::class);

            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
