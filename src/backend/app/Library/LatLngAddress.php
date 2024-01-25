<?php

namespace App\Library;

use App\Models\Prefecture;
use App\Models\Job;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class LatLngAddress extends Facade
{
    /**
     * 都道府県ID、住所から緯度経度を取得する
     * 
     * @param integer $prefecture_id    都道府県ID
     * @param string $address           市区町村以降の住所
     * @param boolean $is_sleep         呼び出し前にスリープするか
     */
    public static function getLatLngInfoByAddress($prefecture_id ,$address, $is_sleep = true)
    {
        try {
            $prefecture = Prefecture::find($prefecture_id);
            if (!$prefecture) {
                return false;
            }

            // APIで緯度経度取得
            if ($is_sleep) {
                sleep(5);
            }
            $response = Http::get('https://msearch.gsi.go.jp/address-search/AddressSearch', [
                'q' => $prefecture->name . $address,
            ]);
            if (!$response->successful()) {
                return false;
            }

            // 結果より緯度経度を取得
            $result = $response->json();
            if (count($result) == 0
                || !isset($result[0]['geometry'])
                || !isset($result[0]['geometry']['coordinates'])
                || count($result[0]['geometry']['coordinates']) <> 2) {
                return false;
            }

            return [
                'lat' => $result[0]['geometry']['coordinates'][1],
                'lng' => $result[0]['geometry']['coordinates'][0],
            ];
        } catch (\Exception $e) {
            \Log::error($e);
            return false;
        }
    }

    /**
     * 緯度経度より近い順から求人を取得
     * ・緯度、経度がない場合は以下のソート順
     * 　①人材紹介ではない
     * 　②掲載開始日の降順（新しい順）
     * 　③非公開ではない
     * 　④求人IDの降順
     * 
     * @param integer $prefecture_id    都道府県ID
     * @param integer $position_id      役職/役割ID
     * @param integer $employment_id    雇用形態ID
     * @param float $lat                緯度
     * @param float $lat                経度
     * @param integer $limit            件数
     */
    public static function getJobsByLatLng($prefecture_id, $position_id, $employment_id, $lat, $lng, $limit)
    {
        if (!$prefecture_id || !$position_id || !$employment_id) {
            return [];
        }

        $query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('jobs.status', 10)
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1);
        // 都道府県
        if ($prefecture_id) {
            $query = $query->where('offices.prefecture_id', $prefecture_id);
        }
        // 役職/役割
        if ($position_id) {
            $query = $query->where('jobs.position_id', $position_id);
        }
        // 雇用形態
        if ($employment_id) {
            $query = $query->where('jobs.employment_id', $employment_id);
        }
        // 緯度経度
        if ($lat && $lng) {
            $query = $query->whereRaw("ST_Distance_Sphere(POINT(offices.lng, offices.lat), POINT({$lng}, {$lat})) <= 20000");
        }
        $query = $query->select(
                'jobs.id as job_id',
                'jobs.name as job_name',
                'job_categories.name as job_category_name',
                'positions.name as position_name',
                'employments.name as employment_name',
                'jobs.pickup',
                'jobs.private',
                'jobs.recommend',
                'jobs.salary',
                'jobs.work_time',
                'jobs.job_description',
                'jobs.holiday',
                'jobs.welfare',
                'jobs.entry_requirement',
                'jobs.catch_copy',
                'jobs.recommend_point',
                'jobs.salon_message',
                'jobs.m_salary_lower',
                'jobs.m_salary_upper',
                'jobs.t_salary_lower',
                'jobs.t_salary_upper',
                'jobs.d_salary_lower',
                'jobs.d_salary_upper',
                'jobs.commission_lower',
                'jobs.commission_upper',
                'jobs.publish_start_date',
                DB::raw('DATEDIFF(now(), jobs.publish_start_date) as publish_days'),
                'jobs.updated_at',
                'jobs.deleted_at',
                'jobs.office_id',
                'offices.name as office_name',
                'offices.postcode as postcode',
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'offices.address as address',
                'offices.seat_num',
                'offices.staff',
                'offices.business_time',
                'offices.customer_unit_price',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'corporations.name_private as corporation_name_private',
            )
            ->distinct();
        // 緯度経度がある場合、距離が近い順にする
        if ($lat && $lng) {
            $query = $query->addSelect(DB::raw("ST_Distance_Sphere(POINT(offices.lng, offices.lat), POINT({$lng}, {$lat})) as distance"))
                ->orderBy('distance');
        }
        // 距離以外の並び順
        $query = $query->orderBy('jobs.recommend')
            ->orderBy('jobs.publish_start_date', 'desc')
            ->orderBy('jobs.private')
            ->orderBy('jobs.id', 'desc');
        // 件数
        if ($limit) {
            $query = $query->limit($limit);
        }
        $jobs = $query->get();
        foreach ($jobs as $job) {
            $job->pickup = $job->pickup ? true : false;
            $job->private = $job->private ? true : false;
            $job->recommend = $job->recommend ? true : false;
        }

        return $jobs;
    }
}