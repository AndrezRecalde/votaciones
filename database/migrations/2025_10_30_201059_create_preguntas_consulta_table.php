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
        Schema::create('preguntas_consulta', function (Blueprint $table) {
            $table->id();
            $table->string('casillero_pregunta', 5)->unique()->comment('Número o Letra correlativo de la pregunta');
            $table->text('texto_pregunta')->comment('Texto completo de la pregunta');
            $table->text('descripcion')->nullable()->comment('Descripción adicional de la pregunta');
            $table->tinyInteger('activo')->default(1)->comment('Estado activo/inactivo de la pregunta');
            $table->timestamps();

            // Índices
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preguntas_consulta');
    }
};
