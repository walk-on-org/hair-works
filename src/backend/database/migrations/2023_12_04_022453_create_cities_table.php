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
        Schema::create('cities', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('permalink');
            $table->integer('prefecture_id')->unsigned();
            $table->integer('government_city_id')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('government_city_id')->references('id')->on('government_cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
