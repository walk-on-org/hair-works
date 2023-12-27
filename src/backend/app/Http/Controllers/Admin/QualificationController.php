<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Qualification;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class QualificationController extends Controller
{
    /**
     * 資格マスタ一覧取得
     */
    public function index()
    {
        $qualifications = Qualification::all();
        foreach ($qualifications as $q) {
            $q['status_name'] = Qualification::STATUS[$q->status];
        }
        return response()->json(['qualifications' => $qualifications]);
    }

    /**
     * 資格マスタ取得
     */
    public function show($id)
    {
        try {
            $qualification = Qualification::find($id);
            if (!$qualification) {
                throw new ModelNotFoundException();
            }
            $qualification['status_name'] = Qualification::STATUS[$qualification->status];
            return response()->json(['qualification' => $qualification]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Qualification not found'], 404);
        }
    }

    /**
     * 資格マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'status' => 'required',
                'sort' => 'numeric',
            ]);
            Qualification::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 資格マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'status' => 'required',
                'sort' => 'numeric',
            ]);
            $qualification = Qualification::findOrFail($id);
            $qualification->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 資格マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $qualification = Qualification::find($id);
            if (!$qualification) {
                throw new ModelNotFoundException();
            }
            $qualification->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Qualification not found'], 404);
        }
    }

    /**
     * 資格マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = Qualification::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more qualifications not found'], 404);
        }
    }
}
