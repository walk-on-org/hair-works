<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\CustomLp;
use Illuminate\Http\Request;

class CustomLpController extends Controller
{
    /**
     * 専用LP設定全件取得
     */
    public function index(Request $request)
    {
        $query = CustomLp::where('status', 1);
        if ($request->permalink) {
            $query = $query->where('permalink', $request->permalink);
        }
        $custom_lps = $query->select(
                'id',
                'title',
                'permalink',
                'point1',
                'point2',
                'point3',
                'logo',
            )
            ->get();
        foreach ($custom_lps as $custom_lp) {
            $custom_lp->logo = [
                'url' => config('uploadimage.custom_lp_logo_relative_path') . $custom_lp->id . '/' . $custom_lp->logo,
            ];
        }
        return self::responseSuccess(['custom_lps' => $custom_lps]);
    }
}