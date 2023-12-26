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
        Schema::create('mailmagazine_m_areas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('mailmagazine_config_id')->unsigned();
            $table->integer('prefecture_id')->unsigned();
            $table->integer('city_id')->nullable()->unsigned();
            $table->timestamps();

            $table->foreign('mailmagazine_config_id')->references('id')->on('mailmagazine_configs');
            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailmagazine_m_areas');
    }
};
