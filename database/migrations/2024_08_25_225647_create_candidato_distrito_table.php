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
        Schema::create('candidato_distrito', function (Blueprint $table) {
            //$table->id();
            $table->unsignedBigInteger('candidato_id');
            $table->unsignedBigInteger('distrito_id');
            $table->unsignedBigInteger('provincia_id');
            $table->unsignedBigInteger('canton_id')->nullable();
            $table->unsignedBigInteger('parroquia_id')->nullable();
            //$table->timestamps();

            $table->primary(['candidato_id', 'distrito_id']);

            // Definir relaciones foráneas
            $table->foreign('candidato_id')->references('id')->on('candidatos')->onDelete('cascade');
            $table->foreign('distrito_id')->references('id')->on('distritos')->onDelete('cascade');
            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade');
            $table->foreign('canton_id')->references('id')->on('cantones')->onDelete('cascade');
            $table->foreign('parroquia_id')->references('id')->on('parroquias')->onDelete('cascade');

            // Añadir índices
            $table->index('candidato_id');
            $table->index('distrito_id');
            $table->index('provincia_id');
            $table->index('canton_id');
            $table->index('parroquia_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidato_distrito');
    }
};
