<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrefectureController extends Controller
{
    /**
     * 都道府県マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = Prefecture::orderBy('id');
        if ($request->name_roman) {
            $query->where('permalink', $request->name_roman);
        }
        $prefectures = $query->select(
                'id',
                'name',
                'permalink as name_roma',
                'region',
            )
            ->get();
        foreach ($prefectures as $prefecture) {
            $prefecture->region = Prefecture::REGION_ROMAN[$prefecture->region];
        }
        return self::responseSuccess(['prefectures' => $prefectures]);
    }

    /**
     * 都道府県マスタ1件取得
     */
    public function show($id)
    {
        $prefecture = Prefecture::where('id', $id)
            ->select(
                'id',
                'name',
                'permalink as name_roma',
                'region',
            )
            ->first();
        if ($prefecture) {
            $prefecture->region = Prefecture::REGION_ROMAN[$prefecture->region];
        }
        return self::responseSuccess(['prefecture' => $prefecture]);
    }
}