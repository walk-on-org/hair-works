<?php

namespace App\Http\Controllers;

use App\Models\LpJobCategory;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class LpJobCategoryController extends Controller
{
    /**
     * LP職種マスタ一覧取得
     */
    public function index()
    {
        $lp_job_categories = LpJobCategory::all();
        foreach ($lp_job_categories as $j) {
            $j['status_name'] = LpJobCategory::STATUS[$j->status];
        }
        return response()->json(['lp_job_categories' => $lp_job_categories]);
    }

    /**
     * LP職種マスタ取得
     */
    public function show($id)
    {
        try {
            $lp_job_category = LpJobCategory::find($id);
            if (!$lp_job_category) {
                throw new ModelNotFoundException();
            }
            $lp_job_category['status_name'] = LpJobCategory::STATUS[$lp_job_category->status];
            return response()->json(['lp_job_category' => $lp_job_category]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Lp Job category not found'], 404);
        }
    }

    /**
     * LP職種マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'status' => 'required',
            ]);
            LpJobCategory::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * LP職種マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'status' => 'required',
            ]);
            $lp_job_category = LpJobCategory::findOrFail($id);
            $lp_job_category->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
