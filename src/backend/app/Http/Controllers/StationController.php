<?php

namespace App\Http\Controllers;

use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class StationController extends Controller
{
    /**
     * 駅マスタ一覧取得
     */
    public function index(Request $request)
    {
        $query = DB::table('stations')
            ->join('lines', 'stations.line_id', '=', 'lines.id')
            ->join('prefectures', 'stations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->select(
                'stations.id',
                'stations.name',
                'stations.permalink',
                'stations.station_group_id',
                'stations.line_id',
                'lines.name as line_name',
                'stations.prefecture_id',
                'prefectures.name as prefecture_name',
                'stations.city_id',
                'cities.name as city_name',
                'stations.status',
                'stations.sort',
                'stations.lat',
                'stations.lng',
            );
        if ($request->prefecture_id) {
            $query = $query->where('stations.prefecture_id', $request->prefecture_id)
                ->orderBy('stations.sort', 'asc');
        }
        $stations = $query->get();
        foreach ($stations as $s) {
            $s->status_name = Station::STATUS[$s->status];
        }
        return response()->json(['stations' => $stations]);
    }

    /**
     * 駅マスタ取得
     */
    public function show($id)
    {
        try {
            $station = Station::find($id);
            if (!$station) {
                throw new ModelNotFoundException();
            }
            $station['line_name'] = $station->line->name;
            $station['prefecture_name'] = $station->prefecture->name;
            $station['city_name'] = $station->city->name;
            $station['status_name'] = Station::STATUS[$station->status];
            return response()->json(['station' => $station]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Station not found'], 404);
        }
    }

    /**
     * 駅マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'id' => 'numeric|unique:stations,id',
                'name' => 'required|string',
                'permalink' => 'required|string',
                'station_group_id' => 'numeric',
                'line_id' => 'numeric|exists:lines,id',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
                'lat' => 'numeric',
                'lng' => 'numeric',
            ]);
            
            Station::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 駅マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'id' => 'numeric|unique:stations,id,' . $id . ',id',
                'name' => 'required|string',
                'permalink' => 'required|string',
                'station_group_id' => 'numeric',
                'line_id' => 'numeric|exists:lines,id',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
                'lat' => 'numeric',
                'lng' => 'numeric',
            ]);
            
            $station = Station::findOrFail($id);
            $station->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
