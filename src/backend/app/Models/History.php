<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;
    protected $fillable = [
        'unique_id',
        'job_id',
        'member_id',
    ];

    public function job() {
        return $this->belongsTo('App\Models\Job');
    }

    public function member() {
        return $this->belongsTo('App\Models\Member')->withDefault();
    }
}
