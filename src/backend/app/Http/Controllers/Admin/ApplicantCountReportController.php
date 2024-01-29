<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApplicantCountReportController extends Controller
{
    /**
     * 応募件数取得
     */
    public function getApplicantCount(Request $request)
    {
        // 会員・応募者の住所起点
        // 会員数（累計）
        // 応募数
        // 市区町村別の応募数
        // 応募者の住所起点での件数取得クエリ
        $query = Applicant::join('prefectures', 'applicants.prefecture_id', '=', 'prefectures.id')
            ->leftJoin('cities', function($join) {
                $join->on('applicants.address', 'LIKE', DB::raw('concat(cities.name, \'%\')'))
                    ->on('applicants.prefecture_id', '=', 'cities.prefecture_id');
            })
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id');
        if ($request->prefecture_id) {
            $query = $query->where('applicants.prefecture_id', $request->prefecture_id);
        }
        if ($request->government_city_id) {
            $query = $query->where('government_cities.id', $request->government_city_id);
        }
        if ($request->city_id) {
            $query = $query->where('cities.id', $request->city_id);
        }
        if ($request->from) {
            $query = $query->whereRaw('concat(year(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\')), \'-\', lpad(month(convert_tz(applicants.created_at,  \'+00:00\', \'+09:00\')), 2, \'0\')) >= ?', [$request->from]);
        }
        if ($request->to) {
            $query = $query->whereRaw('concat(year(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\')), \'-\', lpad(month(convert_tz(applicants.created_at,  \'+00:00\', \'+09:00\')), 2, \'0\')) <= ?', [$request->to]);
        }
        $applicant_count_by_applicant_address = (clone $query)->groupBy('prefectures.id')
            ->groupBy('government_cities.id')
            ->groupBy('cities.id')
            ->select(
                'prefectures.name as prefecture_name',
                DB::raw('ifnull(government_cities.name, \'（不明）\') as government_city_name'),
                DB::raw('ifnull(cities.name, \'（不明）\') as city_name'),
                DB::raw('count(applicants.id) as count'),
            )
            ->get();

        // 全応募数取得
        $applicant_all_count_by_applicant_address = $query->count();

        // 事業所数
        $query = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id');
        if ($request->prefecture_id) {
            $query = $query->where('offices.prefecture_id', $request->prefecture_id);
        }
        if ($request->government_city_id) {
            $query = $query->where('government_cities.id', $request->government_city_id);
        }
        if ($request->city_id) {
            $query = $query->where('cities.id', $request->city_id);
        }
        $office_count = $query->count();

        // 事業所の住所起点
        // 応募数
        // 事業所の年齢、職種、役職/役割、雇用形態別の応募件数
        // 事業所の住所起点の件数取得クエリ
        $query = Office::join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('applicants', function ($join) {
                $join->on('jobs.id', '=', 'applicants.job_id')
                    ->whereNull('applicants.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id');
        if ($request->prefecture_id) {
            $query = $query->where('offices.prefecture_id', $request->prefecture_id);
        }
        if ($request->government_city_id) {
            $query = $query->where('government_cities.id', $request->government_city_id);
        }
        if ($request->city_id) {
            $query = $query->where('cities.id', $request->city_id);
        }
        if ($request->from) {
            $query = $query->whereRaw('concat(year(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\')), \'-\', lpad(month(convert_tz(applicants.created_at,  \'+00:00\', \'+09:00\')), 2, \'0\')) >= ?', [$request->from]);
        }
        if ($request->to) {
            $query = $query->whereRaw('concat(year(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\')), \'-\', lpad(month(convert_tz(applicants.created_at,  \'+00:00\', \'+09:00\')), 2, \'0\')) <= ?', [$request->to]);
        }
        $applicant_count_by_office_address = (clone $query)->groupBy('offices.id')
            ->select(
                'offices.name as office_name',
                'prefectures.name as prefecture_name',
                'government_cities.name as government_city_name',
                'cities.name as city_name',
                DB::raw('count(applicants.id) as count'),
            )
            ->orderBy('count', 'desc')
            ->get();

        // 全応募数取得
        $applicant_all_count_by_office_address = $query->count();

        return response()->json([
            'applicant_count_by_applicant_address' => $applicant_count_by_applicant_address,
            'applicant_all_count_by_applicant_address' => $applicant_all_count_by_applicant_address,
            'office_count' => $office_count,
            'applicant_count_by_office_address' => $applicant_count_by_office_address,
            'applicant_all_count_by_office_address' => $applicant_all_count_by_office_address,
        ]);
    }
}