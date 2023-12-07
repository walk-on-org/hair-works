<?php

namespace App\Http\Controllers;

use App\Models\NationalHoliday;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class NationalHolidayController extends Controller
{
    /**
     * 祝日マスタ一覧取得
     */
    public function index()
    {
        $national_holidays = NationalHoliday::all();
        return response()->json(['national_holidays' => $national_holidays]);
    }

    /**
     * 祝日マスタ取得
     */
    public function show($id)
    {
        try {
            $national_holiday = NationalHoliday::find($id);
            if (!$national_holiday) {
                throw new ModelNotFoundException();
            }
            return response()->json(['national_holiday' => $national_holiday]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'National Holiday not found'], 404);
        }
    }

    /**
     * 祝日マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'date' => 'required|date',
            ]);
            NationalHoliday::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 祝日マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'date' => 'required|date',
            ]);
            $national_holiday = NationalHoliday::findOrFail($id);
            $national_holiday->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
