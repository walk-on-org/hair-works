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
        Schema::create('member_lp_job_categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('member_id')->unsigned();
            $table->integer('lp_job_category_id')->unsigned();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members');
            $table->foreign('lp_job_category_id')->references('id')->on('lp_job_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_lp_job_categories');
    }
};
