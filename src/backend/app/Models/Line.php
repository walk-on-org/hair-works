<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Line extends Model
{
    use HasFactory;
    protected  $fillable = [
        'id',
        'name',
        'permalink',
        'train_company_id',
        'status',
        'sort',
    ];

    const STATUS = [
        0 => '運用中',
        1 => '運用前',
        2 => '廃止',
    ];

    public function trainCompany() {
        return $this->belongsTo('App\Models\TrainCompany');
    }

    public function stations() {
        return $this->hasMany('App\Models\Station');
    }

    public function officeAccesses() {
        return $this->hasMany('App\Models\OfficeAccess');
    }
}
