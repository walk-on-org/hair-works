<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\HtmlAddContent;
use App\Models\Prefecture;
use App\Models\GovernmentCity;
use App\Models\City;
use App\Models\Line;
use App\Models\Station;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HtmlAddContentController extends Controller
{
    /**
     * HTML追加コンテント取得
     */
    public function getContent(Request $request)
    {
        // 都道府県IDが存在しない、または各パラメータが2つ以上指定している場合は、取得しない
        if (!$request->prefecture_id) {
            return self::responseSuccess(['setting' => (object)[], 'average_salary' => (object)[]]);
        }
        if ($request->government_city_id && count(explode(',', $request->government_city_id)) > 1) {
            return self::responseSuccess(['setting' => (object)[], 'average_salary' => (object)[]]);
        }
        if ($request->city_id && count(explode(',', $request->city_id)) > 1) {
            return self::responseSuccess(['setting' => (object)[], 'average_salary' => (object)[]]);
        }
        if ($request->line_id && count(explode(',', $request->line_id)) > 1) {
            return self::responseSuccess(['setting' => (object)[], 'average_salary' => (object)[]]);
        }
        if ($request->station_id && count(explode(',', $request->station_id)) > 1) {
            return self::responseSuccess(['setting' => (object)[], 'average_salary' => (object)[]]);
        }

        // HTML追加コンテンツ取得
        $query = HtmlAddContent::join('prefectures', 'html_add_contents.prefecture_id', '=', 'prefectures.id')
            ->leftJoin('government_cities', 'html_add_contents.government_city_id', '=', 'government_cities.id')
            ->leftJoin('cities', 'html_add_contents.city_id', '=', 'cities.id')
            ->leftJoin('stations', 'html_add_contents.station_id', '=', 'stations.id')
            ->where('html_add_contents.prefecture_id', $request->prefecture_id);
        if ($request->government_city_id) {
            $query = $query->where('html_add_contents.government_city_id', $request->government_city_id);
        } else {
            $query = $query->whereNull('html_add_contents.government_city_id');
        }
        if ($request->city_id) {
            $query = $query->where('html_add_contents.city_id', $request->city_id);
        } else {
            $query = $query->whereNull('html_add_contents.city_id');
        }
        if ($request->line_id) {
            // 路線ページはHTML追加コンテンツはなし
            $query = $query->whereRaw('1 = 0');
        }
        if ($request->station_id) {
            $query = $query->where('html_add_contents.station_id', $request->station_id);
        } else {
            $query = $query->whereNull('html_add_contents.station_id');
        }
        $setting = $query->select(
                'html_add_contents.prefecture_id',
                'html_add_contents.government_city_id',
                'html_add_contents.city_id',
                'html_add_contents.station_id',
                'prefectures.name as prefecture_name',
                'government_cities.name as government_city_name',
                'cities.name as city_name',
                DB::raw('\'\' as line_name'),
                'stations.name as station_name',
                'html_add_contents.display_average_salary',
                'html_add_contents.display_feature',
                'html_add_contents.feature',
            )
            ->first();
        // 取得できなかった場合、空のオブジェクトで設定
        if (!$setting) {
            $prefecture = Prefecture::where('id', $request->prefecture_id)->first();
            $government_city = null;
            if ($request->government_city_id) {
                $government_city = GovernmentCity::where('id', $request->government_city_id)->first();
            }
            $city = null;
            if ($request->city_id) {
                $city = City::where('id', $request->city_id)->first();
            }
            $line = null;
            if ($request->line_id) {
                $line = Line::where('id', $request->line_id)->where('status', 0)-first();
            }
            $station = null;
            if ($request->station_id) {
                $station = Station::where('id', $request->station_id)->where('status', 0)-first();
            }
            $setting = (object) [
                'prefecture_id' => $request->prefecture_id,
                'government_city_id' => $request->government_city_id,
                'city_id' => $request->city_id,
                'station_id' => $request->station_id,
                'prefecture_name' => $prefecture ? $prefecture->name : '',
                'government_city_name' => $government_city ? $government_city->name : '',
                'city_name' => $city ? $city->name : '',
                'line_name' => $line ? $line->name : '',
                'station_name' => $station ? $station->name : '',
                'display_average_salary' => 1,
                'display_feature' => 0,
                'feature' => '',
            ];
        }

        // 平均給与
        $query = Job::join('offices', 'jobs.office_id', '=', 'offices.id')
            ->where('jobs.status', 10);
        if ($request->prefecture_id) {
            $query = $query->where('offices.prefecture_id', $request->prefecture_id);
        }
        if ($request->government_city_id) {
            $query = $query->leftJoin('cities', 'offices.city_id', '=', 'cities.id')
                ->where('cities.government_city_id', $request->government_city_id);
        }
        if ($request->city_id) {
            $query = $query->where('offices.city_id', $request->city_id);
        }
        if ($request->line_id) {
            $query = $query->leftJoin('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->leftJoin('lines', 'office_accesses.line_id', '=', 'lines.id')
                ->where('lines.id', $request->line_id);
        }
        if ($request->station_id) {
            $query = $query->leftJoin('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->leftJoin('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->where('stations.station_group_id', $request->station_id);
        }
        $average_salary_result = $query->select(
                DB::raw('COUNT(jobs.id) as job_count'),
                DB::raw('ROUND(AVG(jobs.m_salary_lower)) as avg_m_salary'),
                DB::raw('MIN(jobs.m_salary_lower) as min_m_salary'),
                DB::raw('MAX(jobs.m_salary_lower) as max_m_salary'),
                DB::raw('ROUND(AVG(jobs.t_salary_lower)) as avg_t_salary'),
                DB::raw('MIN(jobs.t_salary_lower) as min_t_salary'),
                DB::raw('MAX(jobs.t_salary_lower) as max_t_salary'),
                DB::raw('COUNT(jobs.m_salary_lower < 180000 or null) as m_salary_18'),
                DB::raw('COUNT((jobs.m_salary_lower >= 180000 and jobs.m_salary_lower < 200000) or null) as m_salary_18_20'),
                DB::raw('COUNT((jobs.m_salary_lower >= 200000 and jobs.m_salary_lower < 240000) or null) as m_salary_20_24'),
                DB::raw('COUNT((jobs.m_salary_lower >= 240000 and jobs.m_salary_lower < 270000) or null) as m_salary_24_27'),
                DB::raw('COUNT((jobs.m_salary_lower >= 270000 and jobs.m_salary_lower < 300000) or null) as m_salary_27_30'),
                DB::raw('COUNT(jobs.m_salary_lower >= 300000 or null) as m_salary_30'),
                DB::raw('COUNT(jobs.t_salary_lower < 1000 or null) as t_salary_1000'),
                DB::raw('COUNT((jobs.t_salary_lower >= 1000 and jobs.t_salary_lower < 1200) or null) as t_salary_1000_1200'),
                DB::raw('COUNT((jobs.t_salary_lower >= 1200 and jobs.t_salary_lower < 1400) or null) as t_salary_1200_1400'),
                DB::raw('COUNT((jobs.t_salary_lower >= 1400 and jobs.t_salary_lower < 1600) or null) as t_salary_1400_1600'),
                DB::raw('COUNT((jobs.t_salary_lower >= 1600 and jobs.t_salary_lower < 2000) or null) as t_salary_1600_2000'),
                DB::raw('COUNT(jobs.t_salary_lower >= 2000 or null) as t_salary_2000'),
            )
            ->first();
        if ($average_salary_result) {
            $average_salary = (object) [
                'job_count' => $average_salary_result->job_count,
                'avg_m_salary' => $average_salary_result->avg_m_salary,
                'min_m_salary' => $average_salary_result->min_m_salary,
                'max_m_salary' => $average_salary_result->max_m_salary,
                'avg_t_salary' => $average_salary_result->avg_t_salary,
                'min_t_salary' => $average_salary_result->min_t_salary,
                'max_t_salary' => $average_salary_result->max_t_salary,
                'm_salary_chart' => [
                    (object) ['label' => '〜18万円', 'count' => $average_salary_result->m_salary_18],
                    (object) ['label' => '', 'count' => $average_salary_result->m_salary_18_20],
                    (object) ['label' => '', 'count' => $average_salary_result->m_salary_20_24],
                    (object) ['label' => '', 'count' => $average_salary_result->m_salary_24_27],
                    (object) ['label' => '', 'count' => $average_salary_result->m_salary_27_30],
                    (object) ['label' => '30万円〜', 'count' => $average_salary_result->m_salary_30],
                ],
                't_salary_chart' => (object) [
                    (object) ['label' => '〜1,000円', 'count' => $average_salary_result->t_salary_1000],
                    (object) ['label' => '', 'count' => $average_salary_result->t_salary_1000_1200],
                    (object) ['label' => '', 'count' => $average_salary_result->t_salary_1200_1400],
                    (object) ['label' => '', 'count' => $average_salary_result->t_salary_1400_1600],
                    (object) ['label' => '', 'count' => $average_salary_result->t_salary_1600_2000],
                    (object) ['label' => '2,000円〜', 'count' => $average_salary_result->t_salary_2000],
                ],
            ];
        } else {
            $average_salary = (object)[];
        }

        return self::responseSuccess(['setting' => $setting, 'average_salary' => $average_salary]);
    }
}