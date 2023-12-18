<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Office extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected  $fillable = [
        'name',
        'corporation_id',
        'postcode',
        'prefecture_id',
        'city_id',
        'address',
        'tel',
        'fax',
        'open_date',
        'business_time',
        'regular_holiday',
        'floor_space',
        'seat_num',
        'shampoo_stand',
        'staff',
        'new_customer_ratio',
        'cut_unit_price',
        'customer_unit_price',
        'passive_smoking',
        'lat',
        'lng',
        'external_url',
        'sns_url',
    ];

    const PASSIVE_SMOKING = [
        1 => '屋内禁煙（屋外に喫煙場所設置あり）',
        2 => '敷地内禁煙',
        3 => '受動喫煙対策あり（敷地内完全禁煙）',
        4 => '全面禁煙',
    ];

    public function corporation() {
        return $this->belongsTo('App\Models\Corporation');
    }

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function city() {
        return $this->belongsTo('App\Models\City');
    }

    public function officeAccesses() {
        return $this->hasMany('App\Models\OfficeAccess');
    }

    public function officeClienteles() {
        return $this->hasMany('App\Models\OfficeClientele');
    }

    public function officeFeatures() {
        return $this->hasMany('App\Models\OfficeFeature');
    }

    public function officeImages() {
        return $this->hasMany('App\Models\OfficeImage');
    }

    public function jobs() {
        return $this->hasMany('App\Models\Job');
    }
}
