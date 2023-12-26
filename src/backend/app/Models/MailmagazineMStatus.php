<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMStatus extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'status',
    ];

    const STATUS = [
        0 => '未対応',
        1 => '連絡不通',
        2 => '辞退',
        3 => '連絡済',
        4 => '面接済',
        5 => '内定',
        6 => '入社済',
        7 => '該当求人なし',
        8 => '番号他人',
        9 => '応募済',
        10 => '重複',
        11 => '追客中',
        12 => '登録解除',
        13 => '面接設定済',
        14 => '日程調整中',
        15 => '時期先',
        16 => '見学設定済',
        17 => 'リリース（コンタクト有）',
        18 => 'リリース（コンタクト無）',
        19 => '追客中',
        20 => '面談済',
    ];
}
