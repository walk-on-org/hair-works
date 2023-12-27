<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdKeyword;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class AdKeywordController extends Controller
{
    /**
     * 広告キーワードマスタ一覧取得
     */
    public function index()
    {
        $ad_keywords = AdKeyword::all();
        foreach ($ad_keywords as $k) {
            $k['match_type_name'] = AdKeyword::MATCH_TYPE[$k->match_type];
        }
        return response()->json(['ad_keywords' => $ad_keywords]);
    }

    /**
     * 広告キーワードマスタ取得
     */
    public function show($id)
    {
        try {
            $ad_keyword = AdKeyword::find($id);
            if (!$ad_keyword) {
                throw new ModelNotFoundException();
            }
            $ad_keyword['match_type_name'] = AdKeyword::MATCH_TYPE[$ad_keyword->match_type];
            return response()->json(['ad_keyword' => $ad_keyword]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Ad Keyword not found'], 404);
        }
    }

    /**
     * 広告キーワードマスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'utm_source' => 'required|string',
                'utm_medium' => 'required|string',
                'utm_campaign' => 'required|string',
                'keyword_id' => 'required|numeric',
                'ad_group' => 'required|string',
                'keyword' => 'required|string',
                'match_type' => 'numeric',
            ]);
            AdKeyword::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 広告キーワードマスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'utm_source' => 'required|string',
                'utm_medium' => 'required|string',
                'utm_campaign' => 'required|string',
                'keyword_id' => 'required|numeric',
                'ad_group' => 'required|string',
                'keyword' => 'required|string',
                'match_type' => 'numeric',
            ]);
            $ad_keyword = AdKeyword::findOrFail($id);
            $ad_keyword->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 広告キーワードマスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $ad_keyword = AdKeyword::find($id);
            if (!$ad_keyword) {
                throw new ModelNotFoundException();
            }
            $ad_keyword->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'AdKeyword not found'], 404);
        }
    }

    /**
     * 広告キーワードマスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = AdKeyword::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more ad keywords not found'], 404);
        }
    }
}
