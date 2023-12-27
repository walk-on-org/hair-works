<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class PositionController extends Controller
{
    /**
     * 役職/役割マスタ一覧取得
     */
    public function index()
    {
        $positions = Position::all();
        foreach ($positions as $p) {
            $p['status_name'] = Position::STATUS[$p->status];
        }
        return response()->json(['positions' => $positions]);
    }

    /**
     * 役職/役割マスタ取得
     */
    public function show($id)
    {
        try {
            $position = Position::find($id);
            if (!$position) {
                throw new ModelNotFoundException();
            }
            $position['status_name'] = Position::STATUS[$position->status];
            return response()->json(['position' => $position]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Position not found'], 404);
        }
    }

    /**
     * 役職/役割マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            Position::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 役職/役割マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            $position = Position::findOrFail($id);
            $position->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 役職/役割マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $position = Position::find($id);
            if (!$position) {
                throw new ModelNotFoundException();
            }
            $position->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Position not found'], 404);
        }
    }

    /**
     * 役職/役割マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = Position::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more positions not found'], 404);
        }
    }
}
