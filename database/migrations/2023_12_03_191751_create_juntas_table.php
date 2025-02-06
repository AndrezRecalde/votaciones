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
        Schema::create('juntas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zona_id');
            $table->string('cne_cod_junta')->nullable();
            $table->unsignedBigInteger('num_junta')->nullable();
            $table->string('genero', 1)->nullable();
            $table->string('´junta_nombre', 4)->nullable();
            $table->unsignedBigInteger('num_electores_cne')->nullable();
            $table->unsignedBigInteger('num_votaron')->nullable();
            $table->unsignedBigInteger('num_no_votaron')->nullable();
            $table->unsignedBigInteger('num_total_votaron')->nullable();
            $table->unsignedBigInteger('recinto_id')->nullable();
            $table->timestamps();

            $table->foreign('zona_id')->references('id')->on('zonas')->onDelete('cascade');
            $table->foreign('recinto_id')->references('id')->on('recintos')->onDelete('cascade');

            $table->index('zona_id');
            $table->index('recinto_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juntas');
    }
};
