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
        Schema::create('cantidad_concejales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('provincia_id');
            $table->unsignedBigInteger('canton_id');
            $table->integer('cantidad_urbanos');
            $table->integer('cantidad_rurales');
            $table->timestamps();

            // Definir relaciones foráneas
            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade');
            $table->foreign('canton_id')->references('id')->on('cantones')->onDelete('cascade');


            // Añadir índices
            $table->index('provincia_id');
            $table->index('canton_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cantidad__concejales');
    }
};
