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
        Schema::create('multiple_process_managements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('process_type');
            $table->string('upload_file')->nullable();
            $table->string('error_file')->nullable();
            $table->integer('status')->default(0);
            $table->integer('total_count')->default(0);
            $table->integer('processed_count')->default(0);
            $table->integer('error_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('multiple_process_managements');
    }
};
