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
        Schema::create('mailmagazine_m_employments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('mailmagazine_config_id')->unsigned();
            $table->integer('employment_id')->unsigned();
            $table->timestamps();

            $table->foreign('mailmagazine_config_id')->references('id')->on('mailmagazine_configs');
            $table->foreign('employment_id')->references('id')->on('employments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailmagazine_m_employments');
    }
};
