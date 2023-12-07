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
        Schema::create('custom_lps', function (Blueprint $table) {
            $table->increments('id');
            $table->string('permalink');
            $table->string('title');
            $table->string('logo')->nullable();
            $table->string('point1');
            $table->string('point2');
            $table->string('point3');
            $table->integer('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_lps');
    }
};
