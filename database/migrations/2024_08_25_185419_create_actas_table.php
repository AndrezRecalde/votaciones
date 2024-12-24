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
        Schema::create('actas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('provincia_id');
            $table->unsignedBigInteger('canton_id');
            $table->unsignedBigInteger('parroquia_id');
            $table->unsignedBigInteger('zona_id');
            $table->unsignedBigInteger('junta_id');
            $table->unsignedBigInteger('dignidad_id');
            $table->string('cod_cne')->nullable();
            $table->unsignedBigInteger('votos_validos')->default(0);
            $table->unsignedBigInteger('votos_blancos')->default(0);
            $table->unsignedBigInteger('votos_nulos')->default(0);
            $table->boolean('cuadrada')->default(true);
            $table->boolean('legible')->default(true);
            $table->unsignedBigInteger('user_add');
            $table->unsignedBigInteger('user_update')->nullable();
            $table->boolean('estado')->default(true);
            $table->timestamps();

            // Definir relaciones foráneas
            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade');
            $table->foreign('canton_id')->references('id')->on('cantones')->onDelete('cascade');
            $table->foreign('parroquia_id')->references('id')->on('parroquias')->onDelete('cascade');
            $table->foreign('zona_id')->references('id')->on('zonas')->onDelete('cascade');
            $table->foreign('junta_id')->references('id')->on('juntas')->onDelete('cascade');
            $table->foreign('dignidad_id')->references('id')->on('dignidades')->onDelete('cascade');



            // Añadir índices
            $table->index('provincia_id');
            $table->index('canton_id');
            $table->index('parroquia_id');
            $table->index('zona_id');
            $table->index('junta_id');
            $table->index('dignidad_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actas');
    }
};
