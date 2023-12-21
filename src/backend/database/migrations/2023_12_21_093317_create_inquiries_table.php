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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('salon_name');
            $table->string('name');
            $table->integer('prefecture_id')->unsigned();
            $table->string('tel')->nullable();
            $table->string('mail')->nullable();
            $table->integer('inquiry_type');
            $table->text('inquiry_note')->nullable();
            $table->integer('status');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('prefecture_id')->references('id')->on('prefectures');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
