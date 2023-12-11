<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporationFeature extends Model
{
    use HasFactory;
    protected  $fillable = [
        'corporation_id',
        'feature',
        'image',
    ];

    public function corporation() {
        return $this->belongsTo('App\Models\Corporation');
    }
}
