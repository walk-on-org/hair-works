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
        Schema::create('applicant_contact_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('applicant_id')->unsigned();
            $table->date('contact_date');
            $table->text('contact_memo');
            $table->timestamps();

            $table->foreign('applicant_id')->references('id')->on('applicants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_contact_histories');
    }
};
