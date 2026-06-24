<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('zonas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parroquia_id')->nullable();
            $table->string('nombre_zona', 200)->nullable();
            $table->string('est_parroquia', 150)->nullable();
            $table->unsignedBigInteger('num_elec_zona')->nullable();
            $table->unsignedBigInteger('num_elec_hombres_zona')->nullable();
            $table->unsignedBigInteger('num_elec_mujeres_zona')->nullable();
            $table->unsignedBigInteger('num_juntas')->nullable();
            $table->unsignedBigInteger('num_junta_hombre')->nullable();
            $table->unsignedBigInteger('num_junta_mujeres')->nullable();
            $table->unsignedBigInteger('num_elec_zona_max')->nullable();
            $table->string('num_junta_mujeres_ini', 45)->nullable();
            $table->string('num_junta_mujeres_fin', 45)->nullable();
            $table->unsignedBigInteger('num_junta_hombre_ini')->nullable();
            $table->string('num_junta_hombre_fin', 45)->nullable();
            $table->timestamps();

            // Relacion con parroquias
            $table->foreign('parroquia_id')->references('id')->on('parroquias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zonas');
    }
};
