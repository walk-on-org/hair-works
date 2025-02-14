<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prefecture extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'name_kana',
        'permalink',
        'minimum_wage',
        'region',
    ];

    const REGION = [
        1 => '北海道・東北',
        2 => '関東',
        3 => '甲信越・北陸',
        4 => '東海',
        5 => '関西',
        6 => '中国',
        7 => '四国',
        8 => '九州・沖縄',
    ];

    const REGION_ROMAN = [
        1 => 'hokkaido_tohoku',
        2 => 'kanto',
        3 => 'koushinetsu_hokuriku',
        4 => 'toukai',
        5 => 'kansai',
        6 => 'chugoku',
        7 => 'sikoku',
        8 => 'kyusyu_okinawa',
    ];

    public function governmentCities() {
        return $this->hasMany('App\Models\GovernmentCity');
    }

    public function cities() {
        return $this->hasMany('App\Models\City');
    }

    public function stations() {
        return $this->hasMany('App\Models\Station');
    }

    public function htmlAddContents() {
        return $this->hasMany('App\Models\HtmlAddContent');
    }

    public function corporations() {
        return $this->hasMany('App\Models\Corporation');
    }

    public function offices() {
        return $this->hasMany('App\Models\Office');
    }
}
