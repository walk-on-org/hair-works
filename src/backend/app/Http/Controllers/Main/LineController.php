<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Line;
use Illuminate\Http\Request;

class LineController extends Controller
{
    /**
     * 路線マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = Line::join('stations', 'lines.id', '=', 'stations.line_id')
            ->where('lines.status', 0)
            ->where('stations.status', 0);
        if ($request->prefecture_id) {
            $query = $query->where('stations.prefecture_id', $request->prefecture_id);
        }
        if ($request->line_id) {
            $query = $query->whereIn('lines.id', explode(',', $request->line_id));
        }
        $lines = $query->orderBy('lines.sort')
            ->select(
                'lines.id',
                'lines.name',
                'lines.permalink as name_roma',
                'lines.sort',
            )
            ->distinct()
            ->get();
        return self::responseSuccess(['lines' => $lines]);
    }

    /**
     * 路線マスタ1件取得
     */
    public function show($id)
    {
        $line = Line::where('id', $id)
            ->where('status', 0)
            ->select(
                'id',
                'name',
                'permalink as name_roma'
            )
            ->first();
        return self::responseSuccess(['line' => $line]);
    }
}