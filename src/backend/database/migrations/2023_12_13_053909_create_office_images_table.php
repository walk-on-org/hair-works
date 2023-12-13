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
        Schema::create('office_images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('office_id')->unsigned();
            $table->string('image');
            $table->string('alttext')->nullable();
            $table->integer('sort');
            $table->timestamps();

            $table->foreign('office_id')->references('id')->on('offices');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_images');
    }
};
