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
        Schema::create('jobs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->bigInteger('office_id')->unsigned();
            $table->integer('status')->default(0);
            $table->tinyInteger('pickup')->default(0);
            $table->tinyInteger('private')->default(0);
            $table->tinyInteger('recommend')->default(0);
            $table->tinyInteger('indeed_private')->default(0);
            $table->tinyInteger('minimum_wage_ok')->default(0);
            $table->integer('job_category_id')->unsigned();
            $table->integer('position_id')->unsigned();
            $table->integer('employment_id')->unsigned();
            $table->integer('m_salary_lower')->nullable();
            $table->integer('m_salary_upper')->nullable();
            $table->integer('t_salary_lower')->nullable();
            $table->integer('t_salary_upper')->nullable();
            $table->integer('d_salary_lower')->nullable();
            $table->integer('d_salary_upper')->nullable();
            $table->integer('commission_lower')->nullable();
            $table->integer('commission_upper')->nullable();
            $table->text('salary')->nullable();
            $table->text('work_time')->nullable();
            $table->text('job_description')->nullable();
            $table->text('holiday')->nullable();
            $table->text('welfare')->nullable();
            $table->text('entry_requirement')->nullable();
            $table->text('catch_copy')->nullable();
            $table->text('recommend_point')->nullable();
            $table->text('salon_message')->nullable();
            $table->dateTime('publish_start_date')->nullable();
            $table->dateTime('publish_end_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('office_id')->references('id')->on('offices');
            $table->foreign('job_category_id')->references('id')->on('job_categories');
            $table->foreign('position_id')->references('id')->on('positions');
            $table->foreign('employment_id')->references('id')->on('employments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
