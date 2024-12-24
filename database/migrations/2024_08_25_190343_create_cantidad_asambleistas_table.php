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
        Schema::create('cantidad_asambleistas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('provincia_id');
            $table->integer('cantidad');
            $table->timestamps();

            // Definir relaciones foráneas
            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade');



            // Añadir índices
            $table->index('provincia_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cantidad_asambleistas');
    }
};
