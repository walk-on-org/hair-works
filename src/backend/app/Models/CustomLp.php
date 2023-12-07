<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomLp extends Model
{
    use HasFactory;
    protected  $fillable = [
        'permalink',
        'title',
        'logo',
        'point1',
        'point2',
        'point3',
        'status',
    ];

    const STATUS = [
        0 => '準備中',
        1 => '公開中',
        2 => '停止中',
    ];
}
