<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
    public function index(Request $request)
    {

        $query = DB::table('cities')
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
            );
        if ($request->prefecture_id) {
            $query = $query->where('cities.prefecture_id', $request->prefecture_id)
                ->orderBy('cities.id', 'asc');
        }
        $cities = $query->get();
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
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'government_city_id' => '',
            ]);
            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ValidationException();
                }
            }

            City::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
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
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'government_city_id' => '',
            ]);
            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ValidationException();
                }
            }

            $city = City::findOrFail($id);
            $city->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 市区町村マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $city = City::find($id);
            if (!$city) {
                throw new ModelNotFoundException();
            }
            $city->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'City not found'], 404);
        }
    }

    /**
     * 市区町村マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = City::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more cities not found'], 404);
        }
    }
}
