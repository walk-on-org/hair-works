<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMChangeTime extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'change_time',
    ];

    const CHANGE_TIME = [
        0 => '1ヶ月以内',
        1 => '3ヶ月以内',
        2 => '6ヶ月以内',
        3 => '12ヶ月以内',
        4 => '新卒での就職希望',
        5 => '求人が見たいだけ',
    ];
}
