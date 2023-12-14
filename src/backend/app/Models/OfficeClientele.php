<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeClientele extends Model
{
    use HasFactory;
    protected  $fillable = [
        'office_id',
        'clientele',
        'othertext',
    ];

    const CLIENTELE = [
        1 => '20代中心',
        2 => '30代中心',
        3 => '40代以降中心',
        9 => 'ALL年代',
        99 => 'その他',
    ];

    public function office() {
        return $this->belongsTo('App\Models\Office');
    }
}
