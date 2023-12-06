<?php

namespace App\Http\Controllers;

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
}
