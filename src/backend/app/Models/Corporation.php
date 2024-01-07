<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Corporation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected  $fillable = [
        'name',
        'name_private',
        'postcode',
        'prefecture_id',
        'city_id',
        'address',
        'tel',
        'fax',
        'salon_num',
        'employee_num',
        'yearly_turnover',
        'average_age',
        'drug_maker',
        'homepage',
        'higher_display',
        'owner_image',
        'owner_message',
    ];

    const NAME_PRIVATE = [
        0 => '公開',
        1 => '非公開',
    ];

    const HIGHER_DISPLAY = [
        0 => '通常表示',
        1 => '優先表示',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function city() {
        return $this->belongsTo('App\Models\City');
    }

    public function corporationImages() {
        return $this->hasMany('App\Models\CorporationImage');
    }

    public function corporationFeatures() {
        return $this->hasMany('App\Models\CorporationFeature');
    }

    public function contracts() {
        return $this->hasMany('App\Models\Contract');
    }

    public function offices() {
        return $this->hasMany('App\Models\Office');
    }

    public function adminUsers() {
        return $this->belongsToMany('App\Models\AdminUser', 'admin_user_corporations');
    }
}
