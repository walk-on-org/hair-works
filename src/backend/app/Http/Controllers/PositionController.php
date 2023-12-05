<?php

namespace App\Http\Controllers;

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
}
