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
        Schema::create('ad_keywords', function (Blueprint $table) {
            $table->increments('id');
            $table->string('utm_source');
            $table->string('utm_medium');
            $table->string('utm_campaign');
            $table->bigInteger('keyword_id');
            $table->string('ad_group');
            $table->string('keyword');
            $table->integer('match_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_keywords');
    }
};
