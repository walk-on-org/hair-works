<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\LpJobCategory;

class LpJobCategoryController extends Controller
{
    /**
     * LP職種マスタ全件取得
     */
    public function index()
    {
        $lp_job_categories = LpJobCategory::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
            )
            ->get();
        return self::responseSuccess(['lp_job_categories' => $lp_job_categories]);
    }

    /**
     * LP職種マスタ1件取得
     */
    public function show($id)
    {
        $lp_job_category = LpJobCategory::where('status', 1)
            ->where('id', $id)
            ->select(
                'id',
                'name',
            )
            ->first();
        return self::responseSuccess(['lp_job_category' => $lp_job_category]);
    }
}
