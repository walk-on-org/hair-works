<?php

namespace App\Http\Controllers;

use App\Models\CustomLp;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class CustomLpController extends Controller
{
    /**
     * 専用LP設定一覧取得
     */
    public function index()
    {
        $custom_lps = CustomLp::all();
        foreach ($custom_lps as $l) {
            $l['status_name'] = CustomLp::STATUS[$l->status];
        }
        return response()->json(['custom_lps' => $custom_lps]);
    }

    /**
     * 専用LP設定取得
     */
    public function show($id)
    {
        try {
            $custom_lp = CustomLp::find($id);
            if (!$custom_lp) {
                throw new ModelNotFoundException();
            }
            $custom_lp['status_name'] = CustomLp::STATUS[$custom_lp->status];
            return response()->json(['custom_lp' => $custom_lp]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Line not found'], 404);
        }
    }

    /**
     * 専用LP設定登録
     */
    public function create(Request $request)
    {
        try {
            // TODO 画像アップロード処理を追加
            Log::info($request);
            $data = $request->validate([
                'title' => 'required|string',
                'permalink' => 'required|string',
                'point1' => 'required|string',
                'point2' => 'required|string',
                'point3' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
            ]);
            CustomLp::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 専用LP設定更新
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info($request);
            $data = $request->validate([
                'title' => 'required|string',
                'permalink' => 'required|string',
                'point1' => 'required|string',
                'point2' => 'required|string',
                'point3' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
            ]);
            $custom_lp = CustomLp::findOrFail($id);
            $custom_lp->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 専用LP設定削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $custom_lp = CustomLp::find($id);
            if (!$custom_lp) {
                throw new ModelNotFoundException();
            }
            $custom_lp->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'CustomLp not found'], 404);
        }
    }

    /**
     * 専用LP設定複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = CustomLp::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more custom lps not found'], 404);
        }
    }
}
