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
    public function destroy($id)
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
}
