<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'permalink',
        'prefecture_id',
        'government_city_id',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function governmentCity() {
        return $this->belongsTo('App\Models\GovernmentCity');
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
