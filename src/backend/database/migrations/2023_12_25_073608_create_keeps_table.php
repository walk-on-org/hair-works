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
        Schema::create('keeps', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('unique_id');
            $table->bigInteger('job_id')->unsigned();
            $table->bigInteger('member_id')->nullable()->unsigned();
            $table->integer('status');
            $table->dateTime('keeped_at');
            $table->dateTime('released_at')->nullable();
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs');
            $table->foreign('member_id')->references('id')->on('members');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keeps');
    }
};
