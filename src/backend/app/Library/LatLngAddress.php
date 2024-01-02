<?php

namespace App\Library;

use App\Models\Prefecture;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;

class LatLngAddress extends Facade
{
    public static function getLatLngInfoByAddress($prefecture_id ,$address)
    {
        try {
            $prefecture = Prefecture::find($prefecture_id);
            if (!$prefecture) {
                return [
                    'lat' => null,
                    'lng' => null,
                ];
            }

            // APIで緯度経度取得
        } catch (\Exception $ex) {
            return [
                'lat' => null,
                'lng' => null,
            ];
        }
    }
}