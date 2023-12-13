<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeAccess extends Model
{
    use HasFactory;
    protected  $fillable = [
        'office_id',
        'line_id',
        'station_id',
        'move_type',
        'time',
        'note',
    ];

    const MOVE_TYPE = [
        1 => '徒歩',
        2 => '車',
        3 => 'バス',
    ];

    public function office() {
        return $this->belongsTo('App\Models\Office');
    }

    public function line() {
        return $this->belongsTo('App\Models\Line');
    }

    public function station() {
        return $this->belongsTo('App\Models\Station');
    }
}
