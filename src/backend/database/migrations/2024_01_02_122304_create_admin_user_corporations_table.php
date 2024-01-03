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
        Schema::create('admin_user_corporations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('admin_user_id')->unsigned();
            $table->bigInteger('corporation_id')->unsigned();
            $table->timestamps();

            $table->foreign('admin_user_id')->references('id')->on('admin_users');
            $table->foreign('corporation_id')->references('id')->on('corporations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_user_corporations');
    }
};
