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
        Schema::create('acta_candidato', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('acta_id');
            $table->unsignedBigInteger('candidato_id');
            $table->unsignedInteger('num_votos')->default(0);
            $table->timestamps();

            $table->foreign('acta_id')->references('id')->on('actas')->onDelete('cascade');
            $table->foreign('candidato_id')->references('id')->on('candidatos')->onDelete('cascade');

            $table->index('acta_id');
            $table->index('candidato_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acta_candidato');
    }
};
