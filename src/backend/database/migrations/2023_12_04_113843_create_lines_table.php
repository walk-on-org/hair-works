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
        Schema::create('lines', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('permalink');
            $table->integer('train_company_id')->unsigned();
            $table->integer('status');
            $table->integer('sort');
            $table->timestamps();

            $table->foreign('train_company_id')->references('id')->on('train_companies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lines');
    }
};
