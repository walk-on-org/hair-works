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
        Schema::create('offices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->bigInteger('corporation_id')->unsigned();
            $table->string('postcode');
            $table->integer('prefecture_id')->unsigned();
            $table->integer('city_id')->unsigned();
            $table->string('address');
            $table->string('tel')->nullable();
            $table->string('fax')->nullable();
            $table->date('open_date')->nullable();
            $table->string('business_time')->nullable();
            $table->string('regular_holiday')->nullable();
            $table->integer('floor_space')->nullable();
            $table->integer('seat_num')->nullable();
            $table->string('shampoo_stand')->nullable();
            $table->integer('staff')->nullable();
            $table->integer('new_customer_ratio')->nullable();
            $table->integer('cut_unit_price')->nullable();
            $table->integer('customer_unit_price')->nullable();
            $table->integer('passive_smoking');
            $table->double('lat', 8, 5)->nullable();
            $table->double('lng', 8, 5)->nullable();
            $table->string('external_url')->nullable();
            $table->string('sns_url')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('corporation_id')->references('id')->on('corporations');
            $table->foreign('prefecture_id')->references('id')->on('prefectures');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};
