<?php

namespace App\Http\Controllers;

use App\Models\Employment;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class EmploymentController extends Controller
{
    /**
     * 雇用形態マスタ一覧取得
     */
    public function index()
    {
        $employments = Employment::all();
        foreach ($employments as $e) {
            $e['status_name'] = Employment::STATUS[$e->status];
        }
        return response()->json(['employments' => $employments]);
    }

    /**
     * 雇用形態マスタ取得
     */
    public function show($id)
    {
        try {
            $employment = Employment::find($id);
            if (!$employment) {
                throw new ModelNotFoundException();
            }
            $employment['status_name'] = Employment::STATUS[$employment->status];
            return response()->json(['employment' => $employment]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Employment not found'], 404);
        }
    }

    /**
     * 雇用形態マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            Employment::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 雇用形態マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            $employment = Employment::findOrFail($id);
            $employment->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 雇用形態マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $employment = Employment::find($id);
            if (!$employment) {
                throw new ModelNotFoundException();
            }
            $employment->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Employment not found'], 404);
        }
    }

    /**
     * 雇用形態マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = Employment::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more employments not found'], 404);
        }
    }
}
