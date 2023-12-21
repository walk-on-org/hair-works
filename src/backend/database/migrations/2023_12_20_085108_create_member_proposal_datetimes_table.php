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
        Schema::create('member_proposal_datetimes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('member_id')->unsigned();
            $table->integer('number');
            $table->date('date');
            $table->tinyInteger('time_am')->default(0);
            $table->tinyInteger('time_12_14')->default(0);
            $table->tinyInteger('time_14_16')->default(0);
            $table->tinyInteger('time_16_18')->default(0);
            $table->tinyInteger('time_18_20')->default(0);
            $table->tinyInteger('time_all')->default(0);
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_proposal_datetimes');
    }
};
