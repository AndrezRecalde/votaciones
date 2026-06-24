<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PostgresMigrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $path = database_path('seeders/postgres_inserts.sql');

        if (File::exists($path)) {
            $sql = File::get($path);
            
            // Fix double quotes in values if they were accidentally escaped or just execute directly
            // Postgres uses single quotes for strings. The file generated from mysqldump uses single quotes for strings and escaped single quotes (\').
            // Postgres supports E'...' for escaping or '' for single quotes.
            // A simple replace of \' to '' is enough.
            $sql = str_replace("\'", "''", $sql);
            
            // Disable foreign key checks for Postgres during import
            DB::statement('SET session_replication_role = replica;');
            
            // Also backslashes in Postgres strings might act as escape if standard_conforming_strings is off, but modern Postgres it is on.
            // We'll execute the statements.
            
            DB::unprepared($sql);
            
            // Re-enable foreign key checks
            DB::statement('SET session_replication_role = DEFAULT;');
            
            $this->command->info('Base catalog data imported to PostgreSQL successfully.');
        } else {
            $this->command->error('File postgres_inserts.sql not found.');
        }
    }
}
