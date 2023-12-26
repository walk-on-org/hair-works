<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMArea extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'prefecture_id',
        'city_id',
    ];
    
    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function city() {
        return $this->belongsTo('App\Models\City')->withDefault();
    }
}
