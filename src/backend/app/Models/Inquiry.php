<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inquiry extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'salon_name',
        'name',
        'prefecture_id',
        'tel',
        'mail',
        'inquiry_type',
        'inquiry_note',
        'status',
    ];

    const INQUIRY_TYPE = [
        1 => '今すぐ掲載を希望する',
        2 => '料金体系など詳細を知りたい',
        3 => '掲載中の求人を編集したい',
        4 => '掲載を停止したい',
        5 => 'その他',
    ];

    const STATUS = [
        0 => '未対応',
        1 => '対応済',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function conversionHistories() {
        return $this->hasMany('App\Models\ConversionHistory');
    }
}
