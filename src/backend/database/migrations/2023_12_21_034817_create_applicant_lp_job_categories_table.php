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
        Schema::create('applicant_lp_job_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('applicant_id')->unsigned();
            $table->integer('lp_job_category_id')->unsigned();
            $table->timestamps();

            $table->foreign('applicant_id')->references('id')->on('applicants');
            $table->foreign('lp_job_category_id')->references('id')->on('lp_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_lp_job_categories');
    }
};
