<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdKeyword extends Model
{
    use HasFactory;
    protected  $fillable = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'keyword_id',
        'ad_group',
        'keyword',
        'match_type',
    ];

    const MATCH_TYPE = [
        1 => '部分一致',
        2 => 'フレーズ一致',
        3 => '完全一致',
    ];
}
