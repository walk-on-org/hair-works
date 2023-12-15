<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobImage extends Model
{
    use HasFactory;
    protected  $fillable = [
        'job_id',
        'image',
        'alttext',
        'sort',
    ];

    public function job() {
        return $this->belongsTo('App\Models\Job');
    }
}
