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
        Schema::create('articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('description');
            $table->integer('article_category_id')->unsigned();
            $table->string('permalink');
            $table->integer('status');
            $table->string('main_image');
            $table->text('content')->nullable();
            $table->tinyInteger('add_cta')->default(0);
            $table->integer('commitment_term_id')->nullable()->unsigned();
            $table->integer('position_id')->nullable()->unsigned();
            $table->integer('m_salary_lower')->nullable();
            $table->timestamps();

            $table->foreign('article_category_id')->references('id')->on('article_categories');
            $table->foreign('commitment_term_id')->references('id')->on('commitment_terms');
            $table->foreign('position_id')->references('id')->on('positions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
