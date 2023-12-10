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
        Schema::create('employment_concern_points', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('employment_id')->unsigned();
            $table->integer('position_id')->unsigned()->nullable();
            $table->integer('commitment_term_id')->unsigned()->nullable();
            $table->string('title');
            $table->text('description');
            $table->integer('sort');
            $table->timestamps();

            $table->foreign('employment_id')->references('id')->on('employments');
            $table->foreign('position_id')->references('id')->on('positions');
            $table->foreign('commitment_term_id')->references('id')->on('commitment_terms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employment_concern_points');
    }
};
