<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    /**
     * 休日マスタ一覧取得
     */
    public function index()
    {
        $holidays = Holiday::all();
        foreach ($holidays as $h) {
            $h['status_name'] = Holiday::STATUS[$h->status];
        }
        return response()->json(['holidays' => $holidays]);
    }

    /**
     * 休日マスタ取得
     */
    public function show($id)
    {
        try {
            $holiday = Holiday::find($id);
            if (!$holiday) {
                throw new ModelNotFoundException();
            }
            $holiday['status_name'] = Holiday::STATUS[$holiday->status];
            return response()->json(['holiday' => $holiday]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Holiday not found'], 404);
        }
    }

    /**
     * 休日マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            Holiday::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 休日マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            $holiday = Holiday::findOrFail($id);
            $holiday->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
