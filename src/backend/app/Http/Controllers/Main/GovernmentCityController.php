<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\GovernmentCity;
use Illuminate\Http\Request;

class GovernmentCityController extends Controller
{
    /**
     * 政令指定都市マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = GovernmentCity::orderBy('id');
        if ($request->prefecture_id) {
            $query = $query->where('prefecture_id', $request->prefecture_id);
        }
        if ($request->government_city_id) {
            $query = $query->whereIn('id', explode(',', $request->government_city_id));
        }
        $government_cities = $query->select(
                'id',
                'name',
                'permalink as name_roma'
            )
            ->get();
        return self::responseSuccess(['government_cities' => $government_cities]);
    }

    /**
     * 政令指定都市マスタ1件取得
     */
    public function show($id)
    {
        $government_city = GovernmentCity::where('id', $id)
            ->select(
                'id',
                'name',
                'permalink as name_roma'
            )
            ->first();
        return self::responseSuccess(['government_city' => $government_city]);
    }
}