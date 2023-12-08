<?php

namespace App\Http\Controllers;

use App\Models\GovernmentCity;
use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class GovernmentCityController extends Controller
{
    /**
     * 政令指定都市マスタ一覧取得
     */
    public function index()
    {
        $government_cities = DB::table('government_cities')
            ->join('prefectures', 'government_cities.prefecture_id', '=', 'prefectures.id')
            ->select(
                'government_cities.id',
                'government_cities.name',
                'government_cities.permalink',
                'government_cities.prefecture_id',
                'prefectures.name as prefecture_name',
            )
            ->get();
        return response()->json(['government_cities' => $government_cities]);
    }

    /**
     * 政令指定都市マスタ取得
     */
    public function show($id)
    {
        try {
            $government_city = GovernmentCity::find($id);
            if (!$government_city) {
                throw new ModelNotFoundException();
            }
            $government_city['prefecture_name'] = $government_city->prefecture->name;
            return response()->json(['government_city' => $government_city]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'GovernmentCity not found'], 404);
        }
    }

    /**
     * 政令指定都市マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
            ]);

            GovernmentCity::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 政令指定都市マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
            ]);

            $government_city = GovernmentCity::findOrFail($id);
            $government_city->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 政令指定都市マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $government_city = GovernmentCity::find($id);
            if (!$government_city) {
                throw new ModelNotFoundException();
            }
            $government_city->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'GovernmentCity not found'], 404);
        }
    }

    /**
     * 政令指定都市マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = GovernmentCity::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more government cities not found'], 404);
        }
    }
}
