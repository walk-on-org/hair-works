<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporationImage extends Model
{
    use HasFactory;
    protected  $fillable = [
        'corporation_id',
        'image',
        'alttext',
        'sort',
    ];

    public function corporation() {
        return $this->belongsTo('App\Models\Corporation');
    }
}
