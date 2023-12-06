<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Qualification extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'status',
        'sort',
    ];

    const STATUS = [
        1 => '有効',
        0 => '無効',
    ];
}
