<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    use HasFactory;
    protected  $fillable = [
        'id',
        'name',
        'permalink',
        'station_group_id',
        'line_id',
        'prefecture_id',
        'city_id',
        'status',
        'sort',
        'lat',
        'lng',
    ];

    const STATUS = [
        0 => '運用中',
        1 => '運用前',
        2 => '廃止',
    ];

    public function line() {
        return $this->belongsTo('App\Models\Line');
    }

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function city() {
        return $this->belongsTo('App\Models\City');
    }
}
