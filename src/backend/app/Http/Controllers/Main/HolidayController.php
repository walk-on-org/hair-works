<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Holiday;

class HolidayController extends Controller
{
    /**
     * 休日マスタ全件取得
     */
    public function index()
    {
        $holidays = Holiday::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
            )
            ->get();
        return self::responseSuccess(['holidays' => $holidays]);
    }

    /**
     * 休日マスタ1件取得
     */
    public function show($id)
    {
        $holiday = Holiday::where('status', 1)
            ->where('id', $id)
            ->select(
                'id',
                'name',
            )
            ->first();
        return self::responseSuccess(['holiday' => $holiday]);
    }
}