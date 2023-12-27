<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobCategoryController extends Controller
{
    /**
     * 職種マスタ全件取得
     */
    public function index()
    {
        $job_categories = JobCategory::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        return self::responseSuccess(['job_categories' => $job_categories]);
    }

    /**
     * 職種マスタ1件取得
     */
    public function show($id)
    {
        $job_category = JobCategory::where('id', $id)
            ->where('status', 1)
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->first();
        return self::responseSuccess(['job_category' => $job_category]);
    }

    /**
     * 職種マスタ全件取得（求人件数付き）
     */
    public function getWithJobCount(Request $request)
    {
        // 職種を全件取得
        $job_categories = JobCategory::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        
        // 条件に合う求人件数を取得
        $job_count_query = Job::join('offices', 'jobs.office_id', '=', 'offices.id')
            ->where('jobs.status', 10)
            ->whereNull('offices.deleted_at')
            ->groupBy('jobs.job_category_id')
            ->select(
                'jobs.job_category_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($request->prefecture_id) {
            if ($request->government_city_id) {
                // 政令指定都市
                $job_count_query = $job_count_query->join('cities', 'offices.city_id', '=', 'cities.id')
                    ->where('offices.prefecture_id', $request->prefecture_id)
                    ->where('cities.government_city_id', $request->government_city_id);
            } else if ($request->city_id) {
                // 市区町村
                $job_count_query = $job_count_query->where('offices.prefecture_id', $request->prefecture_id)
                    ->where('offices.city_id', $request->city_id);
            } else if ($request->line_id) {
                // 路線
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->where('offices.prefecture_id', $request->prefecture_id)
                    ->where('office_accesses.line_id', $request->line_id);
            } else if ($request->station_id) {
                // 駅
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                    ->where('offices.prefecture_id', $request->prefecture_id)
                    ->where('stations.station_group_id', $request->station_id);
            } else {
                // 都道府県
                $job_count_query = $job_count_query->where('offices.prefecture_id', $request->prefecture_id);
            }
        }
        $job_count = $job_count_query->get()
            ->toArray();

        // 取得したデータをマージ
        foreach ($job_categories as $job_category) {
            $index = array_search($job_category->id, array_column($job_count, 'job_category_id'));
            $job_category['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return self::responseSuccess(['job_categories' => $job_categories]);
    }
}