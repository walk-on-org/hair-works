<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CityController extends Controller
{
    /**
     * 市区町村マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = City::leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id');
        if ($request->prefecture_id) {
            $query = $query->where('cities.prefecture_id', $request->prefecture_id);
        }
        if ($request->city_id) {
            $query = $query->whereIn('cities.id', explode(',', $request->city_id));
        }
        $cities = $query->select(
                'cities.id',
                'cities.name',
                'cities.permalink as name_roma',
                'government_cities.id as government_city_id',
                'government_cities.name as government_city_name',
                'government_cities.permalink as government_city_name_roma',
            )
            ->get();
        return self::responseSuccess(['cities' => $cities]);
    }

    /**
     * 市区町村マスタ1件取得
     */
    public function show($id)
    {
        $city = City::where('id', $id)
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->first();
        return self::responseSuccess(['city' => $city]);
    }

    /**
     * 市区町村マスタ全件取得（求人件数付き）
     */
    public function getWithJobCount(Request $request)
    {
        // 市区町村を取得
        $query = City::leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id');
        if ($request->prefecture_id) {
            $query = $query->where('cities.prefecture_id', $request->prefecture_id);
        }
        $cities = $query->select(
                'cities.id',
                'cities.name',
                'cities.permalink as name_roma',
                'government_cities.id as government_city_id',
                'government_cities.name as government_city_name',
                'government_cities.permalink as government_city_name_roma',
            )
            ->get();

        // 条件に合う求人件数を取得
        $job_count_query = Job::join('offices', 'jobs.office_id', '=', 'offices.id')
            ->where('jobs.status', 10)
            ->whereNull('offices.deleted_at')
            ->groupBy('offices.city_id')
            ->select(
                'offices.city_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($request->prefecture_id) {
            $job_count_query = $job_count_query->where('offices.prefecture_id', $request->prefecture_id);
        }
        $job_count = $job_count_query->get()->toArray();

        // 取得したデータをマージ
        foreach ($cities as $city) {
            $index = array_search($city->id, array_column($job_count, 'city_id'));
            $city['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return self::responseSuccess(['cities' => $cities]);
    }
}