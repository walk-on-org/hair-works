<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class JobCategoryController extends Controller
{
    /**
     * 職種マスタ一覧取得
     */
    public function index()
    {
        $job_categories = JobCategory::all();
        foreach ($job_categories as $j) {
            $j['status_name'] = JobCategory::STATUS[$j->status];
        }
        return response()->json(['job_categories' => $job_categories]);
    }

    /**
     * 職種マスタ取得
     */
    public function show($id)
    {
        try {
            $job_category = JobCategory::find($id);
            if (!$job_category) {
                throw new ModelNotFoundException();
            }
            $job_category['status_name'] = JobCategory::STATUS[$job_category->status];
            return response()->json(['job_category' => $job_category]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Job category not found'], 404);
        }
    }

    /**
     * 職種マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            JobCategory::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 職種マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            $job_category = JobCategory::findOrFail($id);
            $job_category->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
