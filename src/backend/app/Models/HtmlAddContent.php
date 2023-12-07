<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HtmlAddContent extends Model
{
    use HasFactory;
    protected  $fillable = [
        'prefecture_id',
        'government_city_id',
        'city_id',
        'station_id',
        'display_average_salary',
        'display_feature',
        'feature',
    ];

    const DISPLAY_AVERAGE_SALARY = [
        1 => 'はい',
        0 => 'いいえ',
    ];

    const DISPLAY_FEATURE = [
        1 => 'はい',
        0 => 'いいえ',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function governmentCity() {
        return $this->belongsTo('App\Models\GovernmentCity');
    }

    public function city() {
        return $this->belongsTo('App\Models\City');
    }

    public function station() {
        return $this->belongsTo('App\Models\Station');
    }
}
