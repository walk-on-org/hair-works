<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LpJobCategory extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'status',
    ];

    const STATUS = [
        1 => '有効',
        0 => '無効',
    ];
}
