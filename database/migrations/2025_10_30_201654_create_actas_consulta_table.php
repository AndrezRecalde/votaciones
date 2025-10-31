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
        Schema::create('actas_consulta', function (Blueprint $table) {
            $table->id();
            // Relaciones geográficas
            $table->unsignedBigInteger('provincia_id');
            $table->unsignedBigInteger('canton_id');
            $table->unsignedBigInteger('parroquia_id');
            $table->unsignedBigInteger('zona_id');
            $table->unsignedBigInteger('junta_id');

            // Relación con pregunta
            $table->unsignedBigInteger('pregunta_id');

            // Código CNE
            $table->string('cod_cne')->nullable()->comment('Código del CNE para identificación');

            // Votos
            $table->unsignedBigInteger('votos_si')->default(0)->comment('Votos a favor (SÍ)');
            $table->unsignedBigInteger('votos_no')->default(0)->comment('Votos en contra (NO)');
            $table->unsignedBigInteger('votos_validos')->default(0)->comment('Total de votos válidos (SI + NO)');
            $table->unsignedBigInteger('votos_blancos')->default(0)->comment('Votos en blanco');
            $table->unsignedBigInteger('votos_nulos')->default(0)->comment('Votos nulos');

            // Estado del acta
            $table->boolean('cuadrada')->default(true)->comment('Indica si el acta cuadra');
            $table->boolean('legible')->default(true)->comment('Indica si el acta es legible');

            // Auditoría
            $table->unsignedBigInteger('user_add')->comment('Usuario que registró el acta');
            $table->unsignedBigInteger('user_update')->nullable()->comment('Usuario que actualizó el acta');
            $table->boolean('estado')->default(true)->comment('Estado activo/inactivo del acta');

            $table->timestamps();

            // Índices para mejorar el rendimiento de consultas
            $table->index('provincia_id');
            $table->index('canton_id');
            $table->index('parroquia_id');
            $table->index('zona_id');
            $table->index('junta_id');
            $table->index('pregunta_id');
            $table->index('estado');

            // Restricción única: una junta no puede tener dos actas para la misma pregunta
            $table->unique(['junta_id', 'pregunta_id'], 'unique_junta_pregunta');

            // Claves foráneas con cascade
            $table->foreign('provincia_id')
                ->references('id')
                ->on('provincias')
                ->onDelete('cascade');

            $table->foreign('canton_id')
                ->references('id')
                ->on('cantones')
                ->onDelete('cascade');

            $table->foreign('parroquia_id')
                ->references('id')
                ->on('parroquias')
                ->onDelete('cascade');

            $table->foreign('zona_id')
                ->references('id')
                ->on('zonas')
                ->onDelete('cascade');

            $table->foreign('junta_id')
                ->references('id')
                ->on('juntas')
                ->onDelete('cascade');

            $table->foreign('pregunta_id')
                ->references('id')
                ->on('preguntas_consulta')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actas_consulta');
    }
};
