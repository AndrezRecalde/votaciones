<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'manage users',
            'view cantones',
            'digitize actas',
            'report incidences',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and assign created permissions
        
        // 1. ADMINISTRADOR
        $roleAdmin = Role::firstOrCreate(['name' => 'ADMINISTRADOR']);
        $roleAdmin->givePermissionTo(Permission::all());

        // 2. RESPONSABLE
        $roleResponsable = Role::firstOrCreate(['name' => 'RESPONSABLE']);
        $roleResponsable->givePermissionTo(['manage users', 'view cantones']);

        // 3. DIGITADOR
        $roleDigitador = Role::firstOrCreate(['name' => 'DIGITADOR']);
        $roleDigitador->givePermissionTo(['digitize actas']);

        // 4. COORDINADOR
        $roleCoordinador = Role::firstOrCreate(['name' => 'COORDINADOR']);
        $roleCoordinador->givePermissionTo(['manage users']);

        // 5. VEEDOR
        $roleVeedor = Role::firstOrCreate(['name' => 'VEEDOR']);
        $roleVeedor->givePermissionTo(['report incidences', 'digitize actas']);
    }
}
