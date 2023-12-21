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
        Schema::create('members', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('salesforce_id')->nullable();
            $table->string('name');
            $table->string('name_kana')->nullable();
            $table->integer('birthyear')->nullable();
            $table->string('postcode')->nullable();
            $table->integer('prefecture_id')->unsigned();
            $table->string('address')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('password');
            $table->string('auth_token');
            $table->integer('change_time')->nullable();
            $table->integer('retirement_time')->nullable();
            $table->integer('employment_id')->unsigned();
            $table->integer('emp_prefecture_id')->unsigned();
            $table->integer('status');
            $table->integer('register_site')->default(1);
            $table->integer('register_form')->default(1);
            $table->bigInteger('job_id')->nullable()->unsigned();
            $table->string('introduction_name')->nullable();
            $table->bigInteger('introduction_member_id')->nullable()->unsigned();
            $table->integer('introduction_gift_status')->default(0);
            $table->double('lat', 8, 5)->nullable();
            $table->double('lng', 8, 5)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('employment_id')->references('id')->on('employments');
            $table->foreign('emp_prefecture_id')->references('id')->on('prefectures');
            $table->foreign('job_id')->references('id')->on('jobs');
            $table->foreign('introduction_member_id')->references('id')->on('members');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
