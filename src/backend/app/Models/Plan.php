<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'term',
        'amount',
        'status',
    ];

    const STATUS = [
        1 => '有効',
        0 => '無効',
    ];

    public function contracts() {
        return $this->hasMany('App\Models\Contract');
    }
}
