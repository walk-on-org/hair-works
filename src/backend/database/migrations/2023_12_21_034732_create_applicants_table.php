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
        Schema::create('applicants', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('job_id')->unsigned();
            $table->integer('status');
            $table->integer('proposal_type')->nullable();
            $table->string('name');
            $table->string('name_kana')->nullable();
            $table->integer('birthyear')->nullable();
            $table->string('postcode')->nullable();
            $table->integer('prefecture_id')->unsigned();
            $table->string('address')->nullable();
            $table->string('phone');
            $table->string('mail')->nullable();
            $table->integer('change_time')->nullable();
            $table->integer('retirement_time')->nullable();
            $table->integer('employment_id')->unsigned();
            $table->integer('emp_prefecture_id')->unsigned();
            $table->text('note')->nullable();
            $table->bigInteger('member_id')->nullable()->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('job_id')->references('id')->on('jobs');
            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('employment_id')->references('id')->on('employments');
            $table->foreign('emp_prefecture_id')->references('id')->on('prefectures');
            $table->foreign('member_id')->references('id')->on('members');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
