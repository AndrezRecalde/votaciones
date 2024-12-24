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
        Schema::create('recintos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parroquia_id');
            $table->string('nombre_recinto');
            $table->string('direccion_recinto');
            $table->unsignedBigInteger('zona_id');
            $table->unsignedBigInteger('num_jun_mas');
            $table->unsignedBigInteger('num_jun_fem');
            $table->unsignedBigInteger('num_juntas');
            $table->unsignedBigInteger('jun_ini_f');
            $table->unsignedBigInteger('jun_fin_f');
            $table->unsignedBigInteger('jun_ini_m');
            $table->unsignedBigInteger('jun_fin_m');
            $table->unsignedBigInteger('num_electores');
            $table->timestamps();

            $table->foreign('parroquia_id')->references('id')->on('parroquias')->onDelete('cascade');
            $table->foreign('zona_id')->references('id')->on('zonas')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recintos');
    }
};
