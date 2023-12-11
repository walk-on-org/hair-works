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
        Schema::create('corporations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->tinyInteger('name_private')->default(0);
            $table->string('postcode');
            $table->integer('prefecture_id')->unsigned();
            $table->integer('city_id')->unsigned();
            $table->string('address');
            $table->string('tel')->nullable();
            $table->string('fax')->nullable();
            $table->integer('salon_num')->nullable();
            $table->integer('employee_num')->nullable();
            $table->string('yearly_turnover')->nullable();
            $table->string('average_age')->nullable();
            $table->string('drug_maker')->nullable();
            $table->string('homepage')->nullable();
            $table->integer('higher_display')->default(0);
            $table->string('owner_image')->nullable();
            $table->text('owner_message')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('corporations');
    }
};
