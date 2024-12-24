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
        Schema::create('parroquias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('canton_id');
            $table->string('nombre_parroquia');
            $table->char('tipo');
            $table->timestamps();

             // Definir relaciones foráneas
             $table->foreign('canton_id')->references('id')->on('cantones')->onDelete('cascade');


             // Añadir índices
             $table->index('canton_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parroquias');
    }
};
