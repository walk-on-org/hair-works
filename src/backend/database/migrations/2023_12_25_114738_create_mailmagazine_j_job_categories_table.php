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
        Schema::create('mailmagazine_j_job_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('mailmagazine_config_id')->unsigned();
            $table->integer('job_category_id')->unsigned();
            $table->timestamps();

            $table->foreign('mailmagazine_config_id')->references('id')->on('mailmagazine_configs');
            $table->foreign('job_category_id')->references('id')->on('job_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailmagazine_j_job_categories');
    }
};
