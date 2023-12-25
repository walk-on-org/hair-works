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
        Schema::create('conversion_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('unique_id');
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->bigInteger('utm_term')->nullable();
            $table->text('lp_url')->nullable();
            $table->dateTime('lp_date')->nullable();
            $table->string('cv_url')->nullable();
            $table->dateTime('cv_date')->nullable();
            $table->bigInteger('member_id')->nullable()->unsigned();
            $table->bigInteger('applicant_id')->nullable()->unsigned();
            $table->bigInteger('inquiry_id')->nullable()->unsigned();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members');
            $table->foreign('applicant_id')->references('id')->on('applicants');
            $table->foreign('inquiry_id')->references('id')->on('inquiries');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversion_histories');
    }
};
