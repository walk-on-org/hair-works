<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeImage extends Model
{
    use HasFactory;
    protected  $fillable = [
        'office_id',
        'image',
        'alttext',
        'sort',
    ];

    public function office() {
        return $this->belongsTo('App\Models\Office');
    }
}
