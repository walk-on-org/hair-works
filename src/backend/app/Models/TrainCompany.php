<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainCompany extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'name_r',
        'status',
        'sort',
    ];

    const STATUS = [
        0 => '運用中',
        1 => '運用前',
        2 => '廃止',
    ];
}
