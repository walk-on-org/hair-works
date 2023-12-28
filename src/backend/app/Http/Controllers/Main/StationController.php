<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Station;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StationController extends Controller
{
    /**
     * 駅マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = Station::join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('lines', 'stations.line_id', '=', 'lines.id')
            ->where('stations.status', 0)
            ->where('lines.status', 0);
        if ($request->prefecture_id) {
            $query = $query->where('stations.prefecture_id', $request->prefecture_id);
        }
        if ($request->line_id) {
            $query = $query->where('stations.line_id', $request->line_id);
        }
        if ($request->station_id) {
            $query = $query->whereIn('stations.id', explode(',', $request->station_id));
        }
        if ($request->station_name) {
            $query = $query->where('stations.name', 'LIKE', '%' . $request->station_name . '%');
        }
        $stations = $query->orderBy('lines.sort')
            ->orderBy('stations.sort')
            ->select(
                'stations.id',
                'stations.station_group_id',
                'stations.name',
                'stations.permalink as name_roma',
                'lines.id as line_id',
                'lines.name as line_name',
                'lines.permalink as line_name_roma',
                'cities.permalink as city_name_roma',
            )
            ->get();
        return self::responseSuccess(['stations' => $stations]);
    }

    /**
     * 駅マスタ1件取得
     */
    public function show($id)
    {
        $station = Station::join('cities', 'stations.city_id', '=', 'cities.id')
            ->where('stations.id', $id)
            ->where('stations.status', 0)
            ->select(
                'stations.id',
                'stations.station_group_id',
                'stations.name',
                'stations.permalink as name_roma',
                'cities.name as city_name',
                'cities.permalink as city_name_roma',
            )
            ->first();
        return self::responseSuccess(['station' => $station]);
    }

    /**
     * 駅マスタ全件取得（求人件数付き）
     */
    public function getWithJobCount(Request $request)
    {
        // 駅を取得
        $query = Station::join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('lines', 'stations.line_id', '=', 'lines.id')
            ->where('stations.status', 0)
            ->where('lines.status', 0);
        if ($request->prefecture_id) {
            $query = $query->where('stations.prefecture_id', $request->prefecture_id);
        }
        $stations = $query->orderBy('lines.sort')
            ->orderBy('stations.sort')
            ->select(
                'stations.id',
                'stations.station_group_id',
                'stations.name',
                'stations.permalink as name_roma',
                'lines.id as line_id',
                'lines.name as line_name',
                'lines.permalink as line_name_roma',
                'cities.permalink as city_name_roma',
            )
            ->get();

        // 条件に合う求人件数を取得
        $job_count_query = Job::join('offices', 'jobs.office_id', '=', 'offices.id')
            ->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->where('jobs.status', 10)
            ->whereNull('offices.deleted_at')
            ->groupBy('office_accesses.station_id')
            ->select(
                'office_accesses.station_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($request->prefecture_id) {
            $job_count_query = $job_count_query->where('stations.prefecture_id', $request->prefecture_id);
        }
        $job_count = $job_count_query->get()->toArray();

        // 取得したデータをマージ
        foreach ($stations as $station) {
            $index = array_search($station->id, array_column($job_count, 'station_id'));
            $station['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return self::responseSuccess(['stations' => $stations]);
    }
}