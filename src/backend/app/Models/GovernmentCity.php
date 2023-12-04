<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GovernmentCity extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'permalink',
        'prefecture_id',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }
}
