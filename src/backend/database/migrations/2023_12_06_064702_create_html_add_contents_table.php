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
        Schema::create('html_add_contents', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('prefecture_id')->unsigned();
            $table->integer('government_city_id')->unsigned()->nullable();
            $table->integer('city_id')->unsigned()->nullable();
            $table->integer('station_id')->unsigned()->nullable();
            $table->tinyInteger('display_average_salary');
            $table->tinyInteger('display_feature');
            $table->text('feature');
            $table->timestamps();

            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('government_city_id')->references('id')->on('government_cities');
            $table->foreign('city_id')->references('id')->on('cities');
            $table->foreign('station_id')->references('id')->on('stations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('html_add_contents');
    }
};
