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
        Schema::create('mailmagazine_configs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->integer('deliver_job_type');
            $table->string('job_keyword')->nullable();
            $table->integer('member_birthyear_from')->nullable();
            $table->integer('member_birthyear_to')->nullable();
            $table->tinyInteger('job_match_lp_job_category')->default(0);
            $table->tinyInteger('job_match_employment')->default(0);
            $table->integer('job_match_distance')->nullable();
            $table->integer('job_count_limit');
            $table->tinyInteger('search_other_corporation')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mailmagazine_configs');
    }
};
