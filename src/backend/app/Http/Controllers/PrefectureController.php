<?php

namespace App\Http\Controllers;

use App\Models\Prefecture;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class PrefectureController extends Controller
{
    /**
     * 都道府県マスタ一覧取得
     */
    public function index()
    {
        $prefectures = Prefecture::all();
        foreach ($prefectures as $p) {
            $p['region_name'] = Prefecture::REGION[$p->region];
        }
        return response()->json(['prefectures' => $prefectures]);
    }

    /**
     * 都道府県マスタ取得
     */
    public function show($id)
    {
        try {
            $prefecture = Prefecture::find($id);
            if (!$prefecture) {
                throw new ModelNotFoundException();
            }
            $prefecture['region_name'] = Prefecture::REGION[$prefecture->region];
            return response()->json(['prefecture' => $prefecture]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Prefecture not found'], 404);
        }
    }

    /**
     * 都道府県マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_kana' => 'required|string',
                'permalink' => 'required|string',
                'minimum_wage' => 'numeric',
                'region' => 'numeric|regex:/^[1-8]{1}$/',
            ]);
            Prefecture::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 都道府県マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_kana' => 'required|string',
                'permalink' => 'required|string',
                'minimum_wage' => 'numeric',
                'region' => 'numeric|regex:/^[1-8]{1}$/',
            ]);
            $prefecture = Prefecture::findOrFail($id);
            $prefecture->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
