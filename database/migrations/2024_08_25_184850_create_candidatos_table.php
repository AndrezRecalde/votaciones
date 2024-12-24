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
        Schema::create('candidatos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organizacion_id');
            $table->unsignedBigInteger('dignidad_id');
            $table->string('nombre_candidato');
            $table->boolean('activo')->default(false);
            $table->timestamps();

            // Definir relaciones foráneas
            $table->foreign('organizacion_id')->references('id')->on('organizaciones')->onDelete('cascade');
            $table->foreign('dignidad_id')->references('id')->on('dignidades')->onDelete('cascade');



            // Añadir índices
            $table->index('organizacion_id');
            $table->index('dignidad_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidatos');
    }
};
