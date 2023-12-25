<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keep extends Model
{
    use HasFactory;
    protected $fillable = [
        'unique_id',
        'job_id',
        'member_id',
    ];

    const STATUS = [
        1 => 'お気に入り済',
        2 => 'お気に入り解除',
    ];

    public function job() {
        return $this->belongsTo('App\Models\Job');
    }

    public function member() {
        return $this->belongsTo('App\Models\Member')->withDefault();
    }
}
