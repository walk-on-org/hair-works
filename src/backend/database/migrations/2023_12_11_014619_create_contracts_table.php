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
        Schema::create('contracts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('corporation_id')->unsigned();
            $table->integer('plan_id')->unsigned();
            $table->date('start_date')->nullable();
            $table->date('end_plan_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('expire')->default(0);
            $table->timestamps();

            $table->foreign('corporation_id')->references('id')->on('corporations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
