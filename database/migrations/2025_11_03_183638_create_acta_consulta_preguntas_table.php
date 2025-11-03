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
            $table->unsignedBigInteger('acta_consulta_id')->comment('Referencia al acta de consulta');
            $table->unsignedBigInteger('pregunta_id')->comment('Referencia a la pregunta de consulta');
            $table->integer('votos_si')->default(0);
            $table->integer('votos_no')->default(0);
            $table->timestamps();

            $table->foreign('acta_consulta_id')->references('id')->on('actas_consulta')->onDelete('cascade');
            $table->foreign('pregunta_id')->references('id')->on('preguntas_consulta')->onDelete('cascade');

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
