<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateLegacyDataCommand extends Command
{
    protected $signature = 'migrate:legacy-data';
    protected $description = 'Migrate data from legacy MySQL to PostgreSQL';

    public function handle()
    {
        $this->info('Starting legacy data migration...');

        // Disable foreign key checks for Postgres
        DB::connection('pgsql')->statement('SET session_replication_role = replica;');

        $tables = [
            'provincias',
            'cantones',
            'parroquias',
            'zonas',
            'recintos',
            'juntas',
            'dignidades',
            'distritos',
            'organizaciones',
            'candidatos',
            'alianzas',
            'preguntas_consulta',
            'actas',
            'acta_candidato',
            'actas_consulta',
            'acta_consulta_preguntas'
        ];

        foreach ($tables as $table) {
            $this->info("Migrating table: $table");

            if (!Schema::connection('pgsql')->hasTable($table) || !Schema::connection('mysql_legacy')->hasTable($table)) {
                $this->warn("Skipping $table - does not exist in one of the databases");
                continue;
            }

            // Get columns of target table
            $targetColumns = Schema::connection('pgsql')->getColumnListing($table);
            
            // Get columns of source table
            $sourceColumns = Schema::connection('mysql_legacy')->getColumnListing($table);

            // Find matching columns
            $matchingColumns = array_intersect($targetColumns, $sourceColumns);

            // Fetch data from legacy
            $legacyData = DB::connection('mysql_legacy')->table($table)->get();

            $insertData = [];
            foreach ($legacyData as $row) {
                $item = [];
                foreach ($matchingColumns as $col) {
                    $item[$col] = $row->$col;
                }
                $insertData[] = $item;
            }

            // Insert in chunks to avoid memory issues
            $chunks = array_chunk($insertData, 500);
            $bar = $this->output->createProgressBar(count($chunks));

            DB::connection('pgsql')->table($table)->truncate(); // Clear existing data if any

            foreach ($chunks as $chunk) {
                DB::connection('pgsql')->table($table)->insert($chunk);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
        }

        // Re-enable foreign key checks
        DB::connection('pgsql')->statement('SET session_replication_role = DEFAULT;');

        $this->info('Data migration completed successfully!');
    }
}
