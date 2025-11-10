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
        Schema::create('acta_consulta_preguntas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('acta_consulta_id');
            $table->unsignedBigInteger('pregunta_id');
            $table->unsignedBigInteger('votos_blancos')->default(0)->comment('Votos en blanco');
            $table->unsignedBigInteger('votos_nulos')->default(0)->comment('Votos nulos');
            $table->unsignedBigInteger('votos_si')->default(0)->comment('Votos a favor (SÍ)');
            $table->unsignedBigInteger('votos_no')->default(0)->comment('Votos en contra (NO)');
            $table->timestamps();

            $table->foreign('acta_consulta_id')
                ->references('id')
                ->on('actas_consulta')
                ->onDelete('cascade');

            $table->foreign('pregunta_id')
                ->references('id')
                ->on('preguntas_consulta')
                ->onDelete('cascade');

            $table->unique(['acta_consulta_id', 'pregunta_id'], 'unique_acta_pregunta');

            $table->index('acta_consulta_id');
            $table->index('pregunta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acta_consulta_preguntas');
    }
};
