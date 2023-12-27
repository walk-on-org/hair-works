<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomLp;
use App\Library\UploadImage;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            if ($custom_lp->logo) {
                $custom_lp->logo = config('uploadimage.custom_lp_logo_path') . $custom_lp->id . '/' . $custom_lp->logo;
            }
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
            $data = $request->validate([
                'title' => 'required|string',
                'permalink' => 'required|string',
                'point1' => 'required|string',
                'point2' => 'required|string',
                'point3' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'logo' => 'nullable|file|mimes:jpeg,jpg,png,webp',
            ]);

            if ($request->hasFile('logo')) {
                $uploaded_file = $request->file('logo');
                $filename = time() . '_' . $uploaded_file->getClientOriginalName();
                $data['logo'] = $filename;
            }

            $custom_lp = CustomLp::create($data);
            if ($request->hasFile('logo')) {
                $uploaded_file->storeAs(config('uploadimage.custom_lp_logo_storage') . $custom_lp->id, $filename);
            }

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
            $data = $request->validate([
                'title' => 'required|string',
                'permalink' => 'required|string',
                'point1' => 'required|string',
                'point2' => 'required|string',
                'point3' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'logo' => '',
            ]);

            $custom_lp = CustomLp::findOrFail($id);
            if ($request->hasFile('logo')) {
                // 画像設定
                $data['logo'] = UploadImage::uploadImageFile(
                    $request->file('logo'),
                    config('uploadimage.custom_lp_logo_storage'),
                    $custom_lp->id,
                    $custom_lp->logo
                );
            } else if (!isset($data['logo']) && $custom_lp->logo) {
                // 画像削除
                UploadImage::deleteImageFile(
                    $custom_lp->logo,
                    config('uploadimage.custom_lp_logo_storage'),
                    $custom_lp->id
                );
                $data['logo'] = null;
            } else {
                // 画像変更なし
                $data['logo'] = $custom_lp->logo;
            }
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
