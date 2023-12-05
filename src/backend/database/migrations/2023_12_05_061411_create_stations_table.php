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
        Schema::create('stations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('permalink');
            $table->integer('station_group_id');
            $table->integer('line_id')->unsigned();
            $table->integer('prefecture_id')->unsigned();
            $table->integer('city_id')->unsigned();
            $table->integer('status');
            $table->integer('sort');
            $table->float('lat');
            $table->float('lng');
            $table->timestamps();

            $table->foreign('line_id')->references('id')->on('lines');
            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stations');
    }
};
