<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;
    protected  $fillable = [
        'corporation_id',
        'plan_id',
        'start_date',
        'end_plan_date',
        'end_date',
        'expire',
    ];

    public function corporation() {
        return $this->belongsTo('App\Models\Corporation');
    }

    public function plan() {
        return $this->belongsTo('App\Models\Plan');
    }
}
