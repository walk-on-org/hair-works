<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\GovernmentCity;
use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CityController extends Controller
{
    /**
     * 市区町村マスタ一覧取得
     */
    public function index()
    {
        $cities = DB::table('cities')
            ->join('prefectures', 'cities.prefecture_id', '=', 'prefectures.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->select(
                'cities.id',
                'cities.name',
                'cities.permalink',
                'cities.prefecture_id',
                'prefectures.name as prefecture_name',
                'cities.government_city_id',
                'government_cities.name as government_city_name',
            )
            ->get();
        return response()->json(['cities' => $cities]);
    }

    /**
     * 市区町村マスタ取得
     */
    public function show($id)
    {
        try {
            $city = CIty::find($id);
            if (!$city) {
                throw new ModelNotFoundException();
            }
            $city['prefecture_name'] = $city->prefecture->name;
            $city['government_city_name'] = $city->governmentCity ? $city->governmentCity->name : '';
            return response()->json(['city' => $city]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'City not found'], 404);
        }
    }

    /**
     * 市区町村マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'prefecture_id' => 'numeric',
                'government_city_id' => '',
            ]);

            // 都道府県マスタ存在チェック
            $prefecture = Prefecture::find($data['prefecture_id']);
            if (!$prefecture) {
                throw new ModelNotFoundException();
            }
            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ModelNotFoundException();
                }
            }

            City::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'PrefectureId Not Found'], 422);
        }
    }

    /**
     * 市区町村マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'prefecture_id' => 'numeric',
                'government_city_id' => '',
            ]);

            // 都道府県マスタ存在チェック
            $prefecture = Prefecture::find($data['prefecture_id']);
            if (!$prefecture) {
                throw new ModelNotFoundException();
            }
            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ModelNotFoundException();
                }
            }

            $city = City::findOrFail($id);
            $city->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'PrefectureId Not Found'], 422);
        }
    }
}
