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
        $jobCategories = JobCategory::all();
        return response()->json($jobCategories);
    }

    /**
     * 職種マスタ取得
     */
    public function show($id)
    {
        try {
            $jobCategory = JobCategory::find($id);
            if (!$jobCategory) {
                throw new ModelNotFoundException();
            }
            return response()->json($jobCategory);
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
            $jobCategory = JobCategory::findOrFail($id);
            $jobCategory->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 職種マスタ削除
     */
    public function destroy($id)
    {
        try {
            $jobCategory = JobCategory::find($id);
            if (!$jobCategory) {
                throw new ModelNotFoundException();
            }
            $jobCategory->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Job category not found'], 404);
        }
    }
}
