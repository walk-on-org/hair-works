<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeFeature extends Model
{
    use HasFactory;
    protected  $fillable = [
        'office_id',
        'feature',
        'image',
    ];

    public function office() {
        return $this->belongsTo('App\Models\Office');
    }
}
