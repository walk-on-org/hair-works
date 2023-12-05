<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommitmentTerm extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'permalink',
        'category',
        'recommend',
        'status',
    ];

    const CATEGORY = [
        1 => '待遇・条件',
        2 => '教育・研修',
        3 => '経験・資格',
        4 => '店舗の特徴',
        5 => '在籍スタッフ',
    ];

    const RECOMMEND = [
        1 => 'はい',
        0 => 'いいえ',
    ];
    
    const STATUS = [
        1 => '有効',
        0 => '無効',
    ];
}
