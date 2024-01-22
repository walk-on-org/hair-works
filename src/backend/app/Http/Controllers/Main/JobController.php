<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Library\LatLngAddress;
use App\Models\Job;
use App\Models\Office;
use App\Models\Corporation;
use App\Models\OfficeAccess;
use App\Models\JobCommitmentTerm;
use App\Models\JobQualification;
use App\Models\JobHoliday;
use App\Models\CorporationImage;
use App\Models\OfficeImage;
use App\Models\JobImage;
use App\Models\OfficeClientele;
use App\Models\Prefecture;
use App\Models\GovernmentCity;
use App\Models\City;
use App\Models\Line;
use App\Models\Station;
use App\Models\Position;
use App\Models\Employment;
use App\Models\Commitmentterm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobController extends Controller
{
    /**
     * 求人情報取得
     */
    public function index(Request $request)
    {
        $query = self::createJobListQuery($request)
            ->select(
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
                'jobs.office_id',
                'offices.name as office_name',
                'offices.postcode as postcode',
                'prefectures.name as prefecture_name',
                'government_cities.name as government_city_name',
                'cities.name as city_name',
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
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
        // キーワード検索でなければ法人がバラバラでソート
        if ($request->keyword) {
            $query = $query->orderBy('jobs.recommend')
                ->orderBy('jobs.publish_start_date', 'desc')
                ->orderBy('jobs.private')
                ->orderBy('jobs.id', 'desc');
        } else {
            $query = DB::query()
                ->fromSub($query, 'jobs')
                ->select(
                    'jobs.*',
                    DB::raw('ROW_NUMBER() OVER (PARTITION BY jobs.corporation_id ORDER BY jobs.publish_start_date DESC) as sort_num'),
                )
                ->orderBy('jobs.recommend')
                ->orderBy('sort_num')
                ->orderBy('jobs.publish_start_date', 'desc')
                ->orderBy('jobs.private')
                ->orderBy('jobs.job_id', 'desc');
        }
        $query = $query->limit($request->limit ? intval($request->limit) : 20);
        if ($request->page) {
            $query = $query->offset(20 * (intval($request->page) - 1));
        }
        $jobs = $query->get();
        foreach ($jobs as $job) {
            $job->pickup = $job->pickup ? true : false;
            $job->private = $job->private ? true : false;
            $job->recommend = $job->recommend ? true : false;
        }
        $jobs = $jobs->toArray();

        // 関連情報を取得
        $job_ids = array_column($jobs, 'job_id');
        $office_ids = array_column($jobs, 'office_id');

        // 事業所アクセスを取得
        $office_accesses = self::getMultipleOfficeAccess($office_ids);
        // 求人画像を取得
        $job_images = self::getMultipleJobImages($job_ids);
        // 求人こだわり条件を取得
        $job_commitment_terms = self::getMultipleJobCommitmentTerms($job_ids);
        // 求人休日を取得
        $job_holidays = self::getMultipleJobHolidays($job_ids);
        // 同一法人の別事業所取得
        $other_offices = self::getOtherOfficeSameCorporation($jobs);

        return self::responseSuccess([
            'jobs' => $jobs,
            'office_accesses' => $office_accesses,
            'job_images' => $job_images,
            'job_commitment_terms' => $job_commitment_terms,
            'job_holidays' => $job_holidays,
            'other_offices' => $other_offices,
        ]);
    }

    /**
     * 全求人件数取得
     */
    public function getAllCount(Request $request)
    {
        $count = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1)
            ->where('jobs.status', 10)
            ->count();
        return self::responseSuccess(['count' => $count]);
    }

    /**
     * 求人一覧件数取得
     */
    public function getCount(Request $request)
    {
        $count = DB::query()
            ->fromSub(
                self::createJobListQuery($request)
                    ->distinct()
                    ->select(
                        'jobs.id',
                        'jobs.m_salary_lower',
                        'jobs.t_salary_lower',
                    )
                , 'jobs'
            )
            ->select(
                DB::raw('COUNT(jobs.id) as count'),
                DB::raw('ROUND(AVG(jobs.m_salary_lower)) as m_salary_average'),
                DB::raw('ROUND(AVG(jobs.t_salary_lower)) as t_salary_average'),
            )
            ->first();
        return self::responseSuccess(['count' => $count]);
    }

    /**
     * 求人情報1件取得
     */
    public function show($id)
    {
        $job = Job::join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.id', $id)
            ->where('jobs.status', 10)
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1)
            ->select(
                'jobs.id',
                'jobs.name',
                'jobs.office_id',
                'jobs.job_category_id',
                'job_categories.name as job_category_name',
                'job_categories.permalink as job_category_roman',
                'jobs.position_id',
                'positions.name as position_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'jobs.status',
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
            )
            ->first();
        if (!$job) {
            // 不正なIDや掲載中の求人でなければ404
            return self::responseNotFound();
        }
        $job->status = Job::STATUS[$job->status];
        $job->pickup = $job->pickup ? true : false;
        $job->private = $job->private ? true : false;
        $job->recommend = $job->recommend ? true : false;
        // 掲載開始日、終了予定日の加工（Googleしごと検索のため）
        $job->publish_end_plan_date = (new \Datetime($job->publish_start_date))
            ->modify('+6 months')
            ->modify('-1 days')
            ->format('Y-m-d H:i:s');
        while (strtotime('now') - strtotime($job->publish_end_plan_date) >= 0) {
            $job->publish_start_date = (new \Datetime($job->publish_end_plan_date))->modify('+1 days')->format('Y-m-d H:i:s');
            $job->publish_end_plan_date = (new \Datetime($job->publish_end_plan_date))->modify('+6 months')->format('Y-m-d H:i:s');
        }

        // 求人関連情報を取得
        $office_accesses = self::getOfficeAccesses($job->office_id);
        $job_commitment_terms = self::getJobCommitmentTerms($job->id);
        $job_qualifications = self::getJobQualifications($job->id);
        $job_holidays = self::getJobHolidays($job->id);
        $office_clienteles = self::getOfficeClienteles($job->office_id);

        // 事業所情報を取得
        $office = self::getOfficeInfo($job->office_id);
        if (!$office) {
            // 事業所が存在しない場合404
            return self::responseNotFoun();
        }

        // 法人情報を取得
        $corporation = self::getCorporationInfo($office->corporation_id);
        if (!$corporation) {
            // 法人が存在しない場合404
            return self::responseNotFoun();
        }

        // 求人画像を取得
        $job_images = self::getJobImages($job->id, $office->id, $office->corporation_id);

        return self::responseSuccess([
            'job' => $job,
            'office_accesses' => $office_accesses,
            'job_commitment_terms' => $job_commitment_terms,
            'job_qualifications' => $job_qualifications,
            'job_holidays' => $job_holidays,
            'office_clienteles' => $office_clienteles,
            'office' => $office,
            'corporation' => $corporation,
            'job_images' => $job_images,
        ]);
    }

    /**
     * 求人プレビュー情報取得
     */
    public function preview($id)
    {
        // TODO 暗号化、復元化
        
        // 求人情報を取得
        $job = Job::join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.id', $id)
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1)
            ->select(
                'jobs.id',
                'jobs.name',
                'jobs.office_id',
                'jobs.job_category_id',
                'job_categories.name as job_category_name',
                'job_categories.permalink as job_category_roman',
                'jobs.position_id',
                'positions.name as position_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'jobs.status',
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
            )
            ->first();
        if (!$job) {
            // 不正なIDや掲載中の求人でなければ404
            return self::responseNotFound();
        }
        $job->status = Job::STATUS[$job->status];
        $job->pickup = $job->pickup ? true : false;
        $job->private = $job->private ? true : false;
        $job->recommend = $job->recommend ? true : false;

        // 求人関連情報を取得
        $office_accesses = self::getOfficeAccesses($job->office_id);
        $job_commitment_terms = self::getJobCommitmentTerms($job->id);
        $job_qualifications = self::getJobQualifications($job->id);
        $job_holidays = self::getJobHolidays($job->id);
        $office_clienteles = self::getOfficeClienteles($job->office_id);

        // 事業所情報を取得
        $office = self::getOfficeInfo($job->office_id);
        if (!$office) {
            // 事業所が存在しない場合404
            return self::responseNotFoun();
        }

        // 法人情報を取得
        $corporation = self::getCorporationInfo($office->corporation_id);
        if (!$corporation) {
            // 法人が存在しない場合404
            return self::responseNotFoun();
        }

        // 求人画像を取得
        $job_images = self::getJobImages($job->id, $office->id, $office->corporation_id);

        return self::responseSuccess([
            'job' => $job,
            'office_accesses' => $office_accesses,
            'job_commitment_terms' => $job_commitment_terms,
            'job_qualifications' => $job_qualifications,
            'job_holidays' => $job_holidays,
            'office_clienteles' => $office_clienteles,
            'office' => $office,
            'corporation' => $corporation,
            'job_images' => $job_images,
        ]); 
    }

    /**
     * PickUp求人取得
     */
    public function getPickup(Request $request)
    {
        $pickups = self::getPickUpJobs('pickup', $request->limit ? $request->limit : 10);
        return self::responseSuccess(['jobs' => $pickups]);
    }

    /**
     * Selection求人取得
     */
    public function getSelection(Request $request)
    {
        $syukyu2nitijobs = self::getPickUpJobs('syukyu2niti', $request->limit ? $request->limit : 10);
        $mikeikenkajobs = self::getPickUpJobs('mikeikenka', $request->limit ? $request->limit : 10);
        $majorjobs = self::getPickUpJobs('majorsalon', $request->limit ? $request->limit : 10);
        $individualjobs = self::getPickUpJobs('individualsalon', $request->limit ? $request->limit : 10);
        $newjobs = self::getPickUpJobs('new', $request->limit ? $request->limit : 10);
        return self::responseSuccess([
            'syukyu2nitijobs' => $syukyu2nitijobs,
            'mikeikenkajobs' => $mikeikenkajobs,
            'majorjobs' => $majorjobs,
            'individualjobs' => $individualjobs,
            'newjobs' => $newjobs,
        ]);
    }

    /**
     * 同一事業所の他求人取得
     */
    public function getOtherSameOffice($id)
    {
        $job = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.id', $id)
            ->select(
                'jobs.id',
                'jobs.office_id',
                'offices.corporation_id',
            )
            ->first();
        if (!$job) {
            return self::responseNotFound();
        }

        // 同一事業所の他求人を取得
        $other_jobs = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('jobs.office_id', $job->office_id)
            ->where('jobs.id', '<>', $id)
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1)
            ->select(
                'jobs.id as job_id',
                'jobs.name as job_name',
                'jobs.catch_copy',
                'jobs.private',
                'jobs.recommend',
                'job_categories.name as job_category_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'positions.name as position_name',
            )
            ->get();
        foreach ($other_jobs as $job) {
            $job->private = $job->private ? true : false;
            $job->recommend = $job->recommend ? true : false;
        }
        return self::responseSuccess(['jobs' => $other_jobs]);
    }

    /**
     * 似た求人取得
     */
    public function getAlike($id)
    {
        $job = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.id', $id)
            ->select(
                'jobs.id as job_id',
                'jobs.job_category_id',
                'jobs.position_id',
                'jobs.employment_id',
                'offices.prefecture_id',
                'offices.city_id',
            )
            ->first();
        if (!$job) {
            return self::responseNotFound();
        }
        $exclusion_job_id = [$job->job_id];

        // 市区町村×職種×役割/役職×雇用形態の求人取得
        $alike_emp = self::getAlikeJobs($job->city_id, $job->job_category_id, $job->position_id, $job->employment_id, $exclusion_job_id);
        foreach ($alike_emp as $job) {
            $exclusion_job_id[] = $job->job_id;
        }
        // 市区町村×職種×役割/役職の求人取得
        $alike_pos = self::getAlikeJobs($job->city_id, $job->job_category_id, $job->position_id, null, $exclusion_job_id);

        return self::responseSuccess(['alike_pos' => $alike_pos, 'alike_emp' => $alike_emp]);
    }

    /**
     * 関連リンク取得（求人一覧）
     */
    public function getRelationLink(Request $request)
    {
        // 近くの市区町村リンク取得
        $relation_city = [];
        if ($request->prefecture_id) {
            $params = clone $request;
            $params->government_city_id = '';
            $params->city_id = '';
            $params->line_id = '';
            $params->station_id = '';
            $job_count_query = self::createJobListQuery($params)
                ->groupBy('cities.id')
                ->select(
                    'cities.id as city_id',
                    DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
                );
            $relation_city = City::join('prefectures', 'cities.prefecture_id', '=', 'prefectures.id')
                ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
                ->leftJoin(DB::raw("({$job_count_query->toSql()}) AS job_count_tbl"), 'cities.id', 'job_count_tbl.city_id')
                ->mergeBindings($job_count_query->getQuery())
                ->where('cities.prefecture_id', $params->prefecture_id)
                ->groupBy('prefectures.id')
                ->groupByRaw('IFNULL(government_cities.id, 10000 + cities.id)')
                ->select(
                    DB::raw('IFNULL(government_cities.id, 10000 + cities.id) as city_id'),
                    DB::raw('IFNULL(MAX(government_cities.name), MAX(cities.name)) as city_name'),
                    DB::raw('IFNULL(MAX(government_cities.permalink), MAX(cities.permalink)) as city_roman'),
                    'prefectures.permalink as prefecture_roman',
                    DB::raw('IFNULL(SUM(job_count_tbl.job_count), 0) as job_count'),
                )
                ->orderBy('city_id')
                ->get();
        }

        // 近くの駅リンク取得
        $relation_station = [];
        $government_city_id = null;
        $city_id = null;
        $line_id = null;
        if ($request->prefecture_id && $request->government_city_id
            && count(explode(',', $request->government_city_id)) == 1) {
            // 政令指定都市１つのみ
            $government_city_id = $request->government_city_id;
        } else if ($request->prefecture_id && $request->city_id
            && count(explode(',', $request->city_id)) == 1) {
            // 市区町村１つのみ
            $city_id = $request->city_id;
        } else if ($request->prefecture_id && $request->line_id
            && count(explode(',', $request->line_id)) == 1) {
            // 路線１つのみ、路線のすべての駅
            $line_id = $request->line_id;
        } else if ($request->prefecture_id && $request->station_id
            && count(explode(',', $request->station_id)) == 1) {
            // 駅１つのみ、駅がある市区町村の駅
            $station = Station::find($request->station_id);
            if ($station) {
                $city_id = $station->city_id;
            }
        }
        // 駅ごとの求人件数を取得
        $params = clone $request;
        $params->prefecture_id = $line_id ? '' : $params->prefecture_id;
        $params->government_city_id = $government_city_id ? $government_city_id : '';
        $params->city_id = $city_id ? $city_id : '';
        $params->line_id = $line_id ? $line_id : '';
        $params->station_id = '';
        $job_count_query = self::createJobListQuery($params)
            ->groupBy('stations.station_group_id')
            ->select(
                'stations.station_group_id',
                DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
            );
        // 該当エリアの駅取得
        $relation_station_query = Station::join('prefectures', 'stations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('stations as stations_main', 'stations.station_group_id', '=', 'stations_main.id')
            ->leftJoin(DB::raw("({$job_count_query->toSql()}) AS job_count_tbl"), 'stations.station_group_id', 'job_count_tbl.station_group_id')
            ->mergeBindings($job_count_query->getQuery())
            ->where('stations.status', 0)
            ->where('stations_main.status', 0)
            ->groupBy('stations.station_group_id')
            ->select(
                'stations.station_group_id',
                'stations_main.name as station_name',
                'stations_main.permalink as station_roman',
                DB::raw('MAX(prefectures.permalink) as prefecture_roman'),
                DB::raw('MAX(cities.permalink) as city_roman'),
                DB::raw('IFNULL(MAX(job_count_tbl.job_count), 0) as job_count'),
            );
        if ($government_city_id) {
            // 政令指定都市が絞れている場合、政令指定都市内の駅
            $relation_station = $relation_station_query->where('cities.government_city_id', $government_city_id)
                ->orderByRaw('MIN(stations.sort)')
                ->get();
        } else if ($city_id) {
            // 市区町村が絞れている場合、市区町村内の駅
            $relation_station = $relation_station_query->where('stations.city_id', $city_id)
                ->orderByRaw('MIN(stations.sort)')
                ->get();
        } else if ($line_id) {
            // 路線が絞れている場合、路線のすべての駅
            $relation_station = $relation_station_query->where('stations.line_id', $line_id)
                ->orderByRaw('MIN(stations.sort)')
                ->get();
        } else if ($request->prefecture_id) {
            // 都道府県のみ、都道府県内の求人が多い駅（TOP20）
            $relation_station = $relation_station_query->where('stations.prefecture_id', $request->prefecture_id)
                ->havingRaw('job_count > 0')
                ->orderBy('job_count', 'desc')
                ->limit(20)
                ->get();
        }

        // その他の人気の条件リンク取得
        $relation_position = [];
        $relation_employment = [];
        $relation_treatment = [];
        if (isset($request->othercondtion) && $request->othercondtion == '1') {
            if ($request->prefecture_id && $request->government_city_id
                && count(explode(',', $request->government_city_id)) == 1) {
                // 政令指定都市１つのみ
                $relation_position = self::getRelationConditionLink('position', $request->prefecture_id, $request->government_city_id, null, null, null);
                $relation_employment = self::getRelationConditionLink('employment', $request->prefecture_id, $request->government_city_id, null, null, null);
                $relation_treatment = self::getRelationConditionLink('treatment', $request->prefecture_id, $request->government_city_id, null, null, null);
            } else if ($request->prefecture_id && $request->city_id
                && count(explode(',', $request->city_id)) == 1) {
                // 市区町村１つのみ
                $relation_position = self::getRelationConditionLink('position', $request->prefecture_id, null, $request->city_id, null, null);
                $relation_employment = self::getRelationConditionLink('employment', $request->prefecture_id, null, $request->city_id, null, null);
                $relation_treatment = self::getRelationConditionLink('treatment', $request->prefecture_id, null, $request->city_id, null, null);
            } else if ($request->prefecture_id && $request->line_id
                && count(explode(',', $request->line_id)) == 1) {
                // 路線１つのみ
                $relation_position = self::getRelationConditionLink('position', $request->prefecture_id, null, null, $request->line_id, null);
                $relation_employment = self::getRelationConditionLink('employment', $request->prefecture_id, null, null, $request->line_id, null);
                $relation_treatment = self::getRelationConditionLink('treatment', $request->prefecture_id, null, null, $request->line_id, null);
            } else if ($request->prefecture_id && $request->station_id
                && count(explode(',', $request->station_id)) == 1) {
                // 駅１つのみ
                $relation_position = self::getRelationConditionLink('position', $request->prefecture_id, null, null, null, $request->station_id);
                $relation_employment = self::getRelationConditionLink('employment', $request->prefecture_id, null, null, null, $request->station_id);
                $relation_treatment = self::getRelationConditionLink('treatment', $request->prefecture_id, null, null, null, $request->station_id);
            } else if ($request->prefecture_id) {
                // 都道府県のみ
                $relation_position = self::getRelationConditionLink('position', $request->prefecture_id, null, null, null, null);
                $relation_employment = self::getRelationConditionLink('employment', $request->prefecture_id, null, null, null, null);
                $relation_treatment = self::getRelationConditionLink('treatment', $request->prefecture_id, null, null, null, null);
            }
        }

        // 近隣の都道府県リンク取得
        $relation_prefecture = [];
        if ($request->prefecture_id) {
            $prefecture = Prefecture::find($request->prefecture_id);
            if ($prefecture) {
                $relation_prefecture = Prefecture::where('prefectures.region', $prefecture->region)
                    ->leftJoin('offices', function ($join) {
                        $join->on('prefectures.id', '=', 'offices.prefecture_id')
                            ->whereNull('offices.deleted_at');
                    })
                    ->leftJoin('jobs', function ($join) {
                        $join->on('offices.id', '=', 'jobs.office_id')
                            ->whereNull('jobs.deleted_at');
                    })
                    ->groupBy('prefectures.id')
                    ->select(
                        'prefectures.id as prefecture_id',
                        'prefectures.name as prefecture_name',
                        'prefectures.permalink as prefecture_roman',
                        DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
                    )
                    ->orderBy('prefecture_id')
                    ->get();
            }
        }

        // 関連する求人取得
        $relation_pickup_job_title = '';
        $relation_pickup_jobs = [];
        if (isset($request->pickupjob) && $request->pickupjob == '1' && $request->prefecture_id) {
            $prefecture = Prefecture::find($request->prefecture_id);
            if ($prefecture) {
                $relation_pickup_job_title = $prefecture->name;
                $query = Job::join('offices', function ($join) {
                        $join->on('jobs.office_id', '=', 'offices.id')
                            ->whereNull('offices.deleted_at');
                    })
                    ->join('corporations', function ($join) {
                        $join->on('offices.corporation_id', '=', 'corporations.id')
                            ->whereNull('corporations.deleted_at');
                    })
                    ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
                    ->join('positions', 'jobs.position_id', '=', 'positions.id')
                    ->join('employments', 'jobs.employment_id', '=', 'employments.id')
                    ->join('cities', 'offices.city_id', '=', 'cities.id')
                    ->where('jobs.status', 10)
                    ->where('offices.prefecture_id', $prefecture->id)
                    ->select(
                        'jobs.id as job_id',
                        'jobs.name as job_name',
                        'offices.id as office_id',
                        'offices.name as office_name',
                        'jobs.private',
                        'jobs.recommend',
                        'jobs.catch_copy',
                        'job_categories.name as job_category_name',
                        'positions.name as position_name',
                        'employments.name as employment_name',
                        'jobs.m_salary_lower',
                        'jobs.m_salary_upper',
                        'jobs.t_salary_lower',
                        'jobs.t_salary_upper',
                        'jobs.d_salary_lower',
                        'jobs.d_salary_upper',
                        'jobs.commission_lower',
                        'jobs.commission_upper',
                    )
                    ->orderBy('jobs.private')
                    ->orderByRaw('RAND()')
                    ->limit(6);

                if ($request->government_city_id && count(explode(',', $request->government_city_id)) == 1) {
                    // 政令指定都市の場合、政令指定都市でおすすめ求人
                    $government_city = GovernmentCity::find($request->government_city_id);
                    if ($government_city) {
                        $relation_pickup_job_title .= $government_city->name;
                        $relation_pickup_jobs = $query->where('cities.government_city_id', $government_city->id)
                            ->get();
                    } else {
                        $relation_pickup_jobs = [];
                    }
                } else if ($request->city_id && count(explode(',', $request->city_id)) == 1) {
                    // 市区町村の場合、市区町村でおすすめ求人（ただし政令指定都市のある市区町村の場合は政令指定都市でおすすめ求人）
                    $city = City::leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
                        ->where('cities.id', $request->city_id)
                        ->select(
                            'cities.id as city_id',
                            'cities.name as city_name',
                            'government_cities.id as government_city_id',
                            'government_cities.name as government_city_name',
                        )
                        ->first();
                    if ($city && $city->government_city_id) {
                        $relation_pickup_job_title .= $city->government_city_name;
                        $relation_pickup_jobs = $query->where('cities.government_city_id', $city->government_city_id)
                            ->get();
                    } else if ($city) {
                        $relation_pickup_job_title .= $city->city_name;
                        $relation_pickup_jobs = $query->where('offices.city_id', $city->city_id)
                            ->get();
                    } else {
                        $relation_pickup_jobs = [];
                    }
                } else if ($request->station_id && count(explode(',', $request->station_id)) == 1) {
                    // 駅の場合、市区町村でおすすめ求人（ただし政令指定都市のある市区町村の場合は政令指定都市でおすすめ求人）
                    $station = Station::join('cities', 'stations.city_id', '=', 'cities.id')
                        ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
                        ->where('stations.id', $request->station_id)
                        ->select(
                            'cities.id as city_id',
                            'cities.name as city_name',
                            'government_cities.id as government_city_id',
                            'government_cities.name as government_city_name',
                        )
                        ->first();
                    if ($station && $station->government_city_id) {
                        $relation_pickup_job_title .= $station->government_city_name;
                        $relation_pickup_jobs = $query->where('cities.government_city_id', $station->government_city_id)
                            ->get();
                    } else if ($station) {
                        $relation_pickup_job_title .= $station->city_name;
                        $relation_pickup_jobs = $query->where('offices.city_id', $station->city_id)
                            ->get();
                    } else {
                        $relation_pickup_jobs = [];
                    }
                } else if ($request->line_id && count(explode(',', $request->line_id)) == 1) {
                    // 路線の場合、路線でおすすめ求人
                    $line = Line::find($request->line_id);
                    if ($line) {
                        $relation_pickup_job_title = $line->name . '沿線（' . $relation_pickup_job_title . '）';
                        $relation_pickup_jobs = $query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                            ->where('office_accesses.line_id', $line->id)
                            ->get();
                    } else {
                        $relation_pickup_jobs = [];
                    }
                } else {
                    // 都道府県の場合、都道府県でおすすめ求人
                    $relation_pickup_jobs = $query->get();
                }
                foreach ($relation_pickup_jobs as $job) {
                    $job->private = $job->private ? true : false;
                    $job->recommend = $job->recommend ? true : false;
                } 

                $job_ids = array_column($relation_pickup_jobs->toArray(), 'job_id');
                $office_ids = array_column($relation_pickup_jobs->toArray(), 'office_id');
                
                // 求人画像を取得
                $job_images = self::getMultipleJobImages($job_ids);
                foreach ($relation_pickup_jobs as $job) {
                    if (isset($job_images[$job->job_id]) && count($job_images[$job->job_id]) > 0) {
                        $job->image = $job_images[$job->job_id][0]->image;
                        $job->image_updated_at = $job_images[$job->job_id][0]->updated_at;
                        $job->alttext = $job_images[$job->job_id][0]->alttext;
                    } else {
                        $job->image = null;
                        $job->image_updated_at = null;
                        $job->alttext = null;
                    }
                }

                // アクセスを取得
                $office_accesses = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
                    ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                    ->whereIn('office_accesses.office_id', $office_ids)
                    ->where('lines.status', 0)
                    ->where('stations.status', 0)
                    ->groupBy('office_accesses.office_id')
                    ->groupBy('stations.station_group_id')
                    ->select(
                        'office_accesses.office_id',
                        DB::raw('max(stations.name) as station_name'),
                        DB::raw('min(office_accesses.move_type) as move_type'),
                        DB::raw('max(office_accesses.time) as time'),
                    )
                    ->orderBy('office_accesses.office_id')
                    ->orderBy('time')
                    ->get();
                foreach ($relation_pickup_jobs as $job) {
                    $index = array_search($job->office_id, array_column($office_accesses->toArray(), 'office_id'));
                    if ($index !== false) {
                        $access = $office_accesses[$index];
                        $job->access = $access->station_name . '駅' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分';
                    } else {
                        $job->access = null;
                    }
                }
            }
        }

        return self::responseSuccess([
            'relation_city' => $relation_city,
            'relation_station' => $relation_station,
            'relation_position' => $relation_position,
            'relation_employment' => $relation_employment,
            'relation_treatment' => $relation_treatment,
            'relation_prefecture' => $relation_prefecture,
            'relation_pickup_job_title' => $relation_pickup_job_title,
            'relation_pickup_jobs' => $relation_pickup_jobs,
        ]);
    }

    /**
     * 関連リンク取得（人気のこだわり条件）
     */
    public function getPopularCmtRelationLink(Request $request)
    {
        $relation_commitment = [];
        $relation_commitment_list = [];
        if ($request->prefecture_id && $request->government_city_id
            && count(explode(',', $request->government_city_id)) == 1) {
            // 政令指定都市１つのみ
            $relation_commitment_list = self::getRelationConditionLink('commitment', $request->prefecture_id, $request->government_city_id, null, null, null);
        } else if ($request->prefecture_id && $request->city_id
            && count(explode(',', $request->city_id)) == 1) {
            // 市区町村１つのみ
            $relation_commitment_list = self::getRelationConditionLink('commitment', $request->prefecture_id, null, $request->city_id, null, null);
        } else if ($request->prefecture_id && $request->line_id
            && count(explode(',', $request->line_id)) == 1) {
            // 路線１つのみ
            $relation_commitment_list = self::getRelationConditionLink('commitment', $request->prefecture_id, null, null, $request->line_id, null);
        } else if ($request->prefecture_id && $request->station_id
            && count(explode(',', $request->station_id)) == 1) {
            // 駅１つのみ
            $relation_commitment_list = self::getRelationConditionLink('commitment', $request->prefecture_id, null, null, null, $request->station_id);
        } else if ($request->prefecture_id) {
            // 都道府県のみ
            $relation_commitment_list = self::getRelationConditionLink('commitment', $request->prefecture_id, null, null, null, null);
        }

        // 求人数が多いものから最大3件
        $relation_commitment = collect($relation_commitment_list);
        $relation_commitment = $relation_commitment->filter(function($value, $key) {
            return $value->job_count > 0;
        });
        $relation_commitment = $relation_commitment->sortByDesc('job_count');
        if (count($relation_commitment) >= 3) {
            $relation_commitment = $relation_commitment->slice(0, 3);
        }

        return self::responseSuccess(['relation_commitment' => $relation_commitment]);
    }

    /**
     * 関連リンク取得（人気）
     */
    public function getPopularRelationLink(Request $request)
    {
        // 求人数の多い市区町村
        $relation_city = City::join('prefectures', 'cities.prefecture_id', '=', 'prefectures.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->leftJoin('offices', function ($join) {
                $join->on('cities.id', '=', 'offices.city_id')
                    ->whereNull('offices.deleted_at');
            })
            ->leftJoin('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->groupBy('prefectures.id')
            ->groupByRaw('IFNULL(government_cities.id, 10000 + cities.id)')
            ->select(
                DB::raw('IFNULL(government_cities.id, 10000 + cities.id) as city_id'),
                DB::raw('IFNULL(MAX(government_cities.name), MAX(cities.name)) as city_name'),
                DB::raw('IFNULL(MAX(government_cities.permalink), MAX(cities.permalink)) as city_roman'),
                'prefectures.permalink as prefecture_roman',
                DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
            )
            ->orderBy('job_count', 'desc')
            ->havingRaw('job_count > 0')
            ->limit(20)
            ->get();

        // 求人数の多い駅
        $relation_station = Station::join('prefectures', 'stations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->leftJoin('office_accesses', 'stations.station_group_id', '=', 'office_accesses.station_id')
            ->leftJoin('offices', function ($join) {
                $join->on('office_accesses.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->leftJoin('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('stations as stations_main', 'stations.station_group_id', '=', 'stations_main.id')
            ->where('stations.status', 0)
            ->where('stations_main.status', 0)
            ->groupBy('stations.station_group_id')
            ->select(
                'stations.station_group_id',
                'stations_main.name as station_name',
                'stations_main.permalink as station_roman',
                DB::raw('MAX(prefectures.permalink) as prefecture_roman'),
                DB::raw('MAX(cities.permalink) as city_roman'),
                DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
            )
            ->orderBy('job_count', 'desc')
            ->havingRaw('job_count > 0')
            ->limit(20)
            ->get();

        // 記事のこだわり条件に合う、求人数の多い市区町村
        $relation_cmt_city = [];
        if ($request->commitment_term_id || $request->position_id || $request->m_salary_lower) {
            $query = Job::join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
                ->join('offices', 'jobs.office_id', '=', 'offices.id')
                ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
                ->join('cities', 'offices.city_id', '=', 'cities.id')
                ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
                ->join('positions', 'jobs.position_id', '=', 'positions.id')
                ->whereNull('offices.deleted_at')
                ->groupBy('prefectures.id')
                ->groupByRaw('IFNULL(government_cities.id, 10000 + cities.id)')
                ->select(
                    DB::raw('IFNULL(government_cities.id, 10000 + cities.id) as city_id'),
                    DB::raw('IFNULL(MAX(government_cities.name), MAX(cities.name)) as city_name'),
                    DB::raw('IFNULL(MAX(government_cities.permalink), MAX(cities.permalink)) as city_roman'),
                    'prefectures.permalink as prefecture_roman',
                    DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
                )
                ->orderBy('job_count', 'desc')
                ->limit(20);
            if ($request->commitment_term_id) {
                $relation_cmt_city = $query->where('commitment_terms.id', $request->commitment_term_id)
                    ->addSelect(
                        DB::raw('MAX(commitment_terms.permalink) as cmt_roman'),
                    )
                    ->get();
            } else if ($request->position_id) {
                $relation_cmt_city = $query->where('jobs.position_id', $request->position_id)
                    ->addSelect(
                        DB::raw('MAX(positions.permalink) as cmt_roman'),
                    )
                    ->get();
            } else if ($request->m_salary_lower) {
                $cmt_roman = 'gekkyu' . (intval($request->m_salary_lower) / 10000);
                $relation_cmt_city = $query->where('jobs.m_salary_lower', '>=', $request->m_salary_lower)
                    ->addSelect(
                        DB::raw("'{$cmt_roman}' as cmt_roman"),
                    )
                    ->get();
            }
        }

        // 記事のこだわり条件に合う、求人数の多い駅
        $relation_cmt_station = [];
        if ($request->commitment_term_id || $request->position_id || $request->m_salary_lower) {
            $query = Job::join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
                ->join('offices', function ($join) {
                    $join->on('jobs.office_id', '=', 'offices.id')
                        ->whereNull('offices.deleted_at');
                })
                ->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->join('positions', 'jobs.position_id', '=', 'positions.id')
                ->join('stations as stations_main', 'stations.station_group_id', '=', 'stations_main.id')
                ->join('prefectures', 'stations_main.prefecture_id', '=', 'prefectures.id')
                ->join('cities', 'stations_main.city_id', '=', 'cities.id')
                ->where('stations.status', 0)
                ->where('stations_main.status', 0)
                ->groupBy('stations.station_group_id')
                ->select(
                    'stations.station_group_id as station_group_id',
                    'stations_main.name as station_name',
                    'stations_main.permalink as station_roman',
                    'cities.permalink as city_roman',
                    'prefectures.permalink as prefecture_roman',
                    DB::raw('COUNT(distinct case when jobs.status = 10 then jobs.id else null end) as job_count'),
                )
                ->orderBy('job_count', 'desc')
                ->limit(20);
            if ($request->commitment_term_id) {
                $relation_cmt_station = $query->where('commitment_terms.id', $request->commitment_term_id)
                    ->addSelect(
                        DB::raw('MAX(commitment_terms.permalink) as cmt_roman'),
                    )
                    ->get();
            } else if ($request->position_id) {
                $relation_cmt_station = $query->where('jobs.position_id', $request->position_id)
                    ->addSelect(
                        DB::raw('MAX(positions.permalink) as cmt_roman'),
                    )
                    ->get();
            } else if ($request->m_salary_lower) {
                $cmt_roman = 'gekkyu' . (intval($request->m_salary_lower) / 10000);
                $relation_cmt_station = $query->where('jobs.m_salary_lower', '>=', $request->m_salary_lower)
                    ->addSelect(
                        DB::raw("'{$cmt_roman}' as cmt_roman"),
                    )
                    ->get();
            }
        }

        // 記事のこだわり条件に合う、求人（ランダム）
        $relation_cmt_job = [];
        if ($request->commitment_term_id || $request->position_id || $request->m_salary_lower) {
            $query = Job::join('offices', function ($join) {
                    $join->on('jobs.office_id', '=', 'offices.id')
                        ->whereNull('offices.deleted_at');
                })
                ->join('corporations', function ($join) {
                    $join->on('offices.corporation_id', '=', 'corporations.id')
                        ->whereNull('corporations.deleted_at');
                })
                ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
                ->join('positions', 'jobs.position_id', '=', 'positions.id')
                ->join('employments', 'jobs.employment_id', '=', 'employments.id')
                ->leftJoin('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->where('jobs.status', 10)
                ->select(
                    'jobs.id as job_id',
                    'jobs.name as job_name',
                    'offices.id as office_id',
                    'offices.name as office_name',
                    'corporations.higher_display',
                    'jobs.private',
                    'jobs.pickup',
                    'jobs.recommend',
                    'jobs.catch_copy',
                    'job_categories.name as job_category_name',
                    'positions.name as position_name',
                    'employments.name as employment_name',
                    'jobs.m_salary_lower',
                    'jobs.m_salary_upper',
                    'jobs.t_salary_lower',
                    'jobs.t_salary_upper',
                    'jobs.d_salary_lower',
                    'jobs.d_salary_upper',
                    'jobs.commission_lower',
                    'jobs.commission_upper',
                )
                ->distinct()
                ->orderBy('jobs.pickup', 'desc')
                ->orderBy('corporations.higher_display', 'desc')
                ->orderBy('jobs.private')
                ->orderByRaw('RAND()')
                ->limit(10);
            if ($request->commitment_term_id) {
                $relation_cmt_job = $query->where('job_commitment_terms.commitment_term_id', $request->commitment_term_id)
                    ->get();
            } else if ($request->position_id) {
                $relation_cmt_job = $query->where('jobs.position_id', $request->position_id)
                    ->get();
            } else if ($request->m_salary_lower) {
                $relation_cmt_job = $query->where('jobs.m_salary_lower', '>=', $request->m_salary_lower)
                    ->get();
            }
            foreach ($relation_cmt_job as $job) {
                $job->private = $job->private ? true : false;
                $job->pickup = $job->pickup ? true : false;
                $job->recommend = $job->recommend ? true : false;
            } 
            $job_ids = array_column($relation_cmt_job->toArray(), 'job_id');
            $office_ids = array_column($relation_cmt_job->toArray(), 'office_id');

            // 求人画像を取得
            $job_images = self::getMultipleJobImages($job_ids);
            foreach ($relation_cmt_job as $job) {
                if (isset($job_images[$job->job_id]) && count($job_images[$job->job_id]) > 0) {
                    $job->image = $job_images[$job->job_id][0]->image;
                    $job->image_updated_at = $job_images[$job->job_id][0]->updated_at;
                    $job->alttext = $job_images[$job->job_id][0]->alttext;
                } else {
                    $job->image = null;
                    $job->image_updated_at = null;
                    $job->alttext = null;
                }
            }

            // アクセスを取得
            $office_accesses = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
                ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->whereIn('office_accesses.office_id', $office_ids)
                ->where('lines.status', 0)
                ->where('stations.status', 0)
                ->groupBy('office_accesses.office_id')
                ->groupBy('stations.station_group_id')
                ->select(
                    'office_accesses.office_id',
                    DB::raw('max(stations.name) as station_name'),
                    DB::raw('min(office_accesses.move_type) as move_type'),
                    DB::raw('max(office_accesses.time) as time'),
                )
                ->orderBy('office_accesses.office_id')
                ->orderBy('time')
                ->get();
            foreach ($relation_cmt_job as $job) {
                $index = array_search($job->office_id, array_column($office_accesses->toArray(), 'office_id'));
                if ($index !== false) {
                    $access = $office_accesses[$index];
                    $job->access = $access->station_name . '駅' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分';
                } else {
                    $job->access = null;
                }
            }
        }

        return self::responseSuccess([
            'relation_city' => $relation_city,
            'relation_station' => $relation_station,
            'relation_cmt_city' => $relation_cmt_city,
            'relation_cmt_station' => $relation_cmt_station,
            'relation_cmt_job' => $relation_cmt_job,
        ]);
    }

    /**
     * 関連リンク取得（人気）
     */
    public function getRecommendJob(Request $request)
    {
        $jobs = LatLngAddress::getJobsByLatLng(
            $request->prefecture_id,
            $request->position_id,
            $request->employment_id,
            $request->lat,
            $request->lng,
            $request->limit
        );

        // 関連情報を取得
        $job_ids = array_column($jobs->toArray(), 'job_id');
        $office_ids = array_column($jobs->toArray(), 'office_id');

        // アクセスを取得
        $office_accesses = self::getMultipleOfficeAccess($office_ids);
        // 画像
        $job_images = self::getMultipleJobImages($job_ids);

        return self::responseSuccess([
            'jobs' => $jobs,
            'office_accesses' => $office_accesses,
            'job_images' => $job_images,
        ]);
    }

    /**
     * 求人一覧を取得するクエリ生成
     */
    private function createJobListQuery($params)
    {
        $query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->leftJoin('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->leftJoin('lines', function ($join) {
                $join->on('office_accesses.line_id', '=', 'lines.id')
                    ->where('lines.status', 0);
            })
            ->leftJoin('stations', function ($join) {
                $join->on('office_accesses.station_id', '=', 'stations.id')
                    ->where('stations.status', 0);
            })
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1);
        // ステータス
        if (!$params->preview) {
            $query = $query->where('jobs.status', 10);
        }
        // 求人ID
        if ($params->job_id) {
            $query = $query->whereIn('jobs.id', explode(',', $params->job_id));
        }
        // 事業所ID
        if ($params->office_id) {
            $query = $query->where('jobs.office_id', $params->office_id);
        }
        // エリア
        if ($params->government_city_id || $params->city_id || $params->line_id || $params->station_id) {
            // 政令指定都市、市区町村
            if ($params->government_city_id && $params->city_id) {
                $query = $query->where(function ($q) use ($params) {
                    $q->whereIn('cities.government_city_id', explode(',', $params->government_city_id))
                        ->orWhereIn('offices.city_id', explode(',', $params->city_id));
                });
            } else if ($params->government_city_id) {
                $query = $query->whereIn('cities.government_city_id', explode(',', $params->government_city_id));
            } else if ($params->city_id) {
                $query = $query->whereIn('offices.city_id', explode(',', $params->city_id));
            }
            // 路線
            if ($params->line_id) {
                $query = $query->whereIn('office_accesses.line_id', explode(',', $params->line_id));
                if ($params->prefecture_id) {
                    $query = $query->where('offices.prefecture_id', $params->prefecture_id);
                }
            }
            // 駅
            if ($params->station_id) {
                $query = $query->whereIn('stations.station_group_id', explode(',', $params->station_id));
            }
        } else if ($params->prefecture_id) {
            // 都道府県
            $query = $query->where('offices.prefecture_id', $params->prefecture_id);
        }
        // 職種
        if ($params->job_category_id) {
            $query = $query->whereIn('jobs.job_category_id', explode(',', $params->job_category_id));
        }
        // 役職/役割
        if ($params->position_id) {
            $query = $query->whereIn('jobs.position_id', explode(',', $params->position_id));
        }
        // 雇用形態
        if ($params->employment_id) {
            $query = $query->whereIn('jobs.employment_id', explode(',', $params->employment_id));
        }
        // こだわり条件
        if ($params->commitment_term_id) {
            $query = $query->leftJoin('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->whereIn('job_commitment_terms.commitment_term_id', explode(',', $params->commitment_term_id));
        }
        // 資格
        if ($params->qualification_id) {
            $query = $query->leftJoin('job_qualifications', 'jobs.id', '=', 'job_qualifications.job_id')
                ->whereIn('job_qualifications.qualification_id', explode(',', $params->qualification_id));
        }
        // 給与
        if ($params->salary_type && $params->salary) {
            if (intval($params->salary_type) == 1) {
                // 月給
                $query = $query->where('jobs.m_salary_lower', '>=', intval($params->salary));
            } else if (intval($params->salary_type) == 2) {
                // 時給
                $query = $query->where('jobs.t_salary_lower', '>=', intval($params->salary));
            } else if (intval($params->salary_type) == 4) {
                // 日給
                $query = $query->where('jobs.d_salary_lower', '>=', intval($params->salary));
            } else if (intval($params->salary_type) == 3) {
                // 歩合
                $query = $query->where('jobs.commission_lower', '>=', intval($params->salary));
            }
        }
        // 休日
        if ($params->holiday_id) {
            $query = $query->leftJoin('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
                ->whereIn('job_holidays.holiday_id', explode(',', $params->holiday_id));
        }
        // 店舗数
        if ($params->salon_num_lower) {
            $query = $query->where('corporations.salon_num', '>=', intval($params->salon_num_lower));
        }
        if ($params->salon_num_upper) {
            $query = $query->where('corporations.salon_num', '<=', intval($params->salon_num_upper));
        }
        // 駅からの所要時間
        if ($params->access_type && $params->access_time) {
            $query = $query->where('office_accesses.move_type', $params->access_type)
                ->where('office_accesses.time', '<=', intval($params->access_time));
        }
        // 店舗のスタッフ数
        if ($params->staff_lower) {
            $query = $query->where('offices.staff', '>=', intval($params->staff_lower));
        }
        if ($params->staff_upper) {
            $query = $query->where('offices.staff', '<=', intval($params->staff_upper));
        }
        // 顧客単価
        if ($params->customer_unit_price_lower) {
            $query = $query->where('offices.customer_unit_price', '>=', intval($params->customer_unit_price_lower));
        }
        if ($params->customer_unit_price_upper) {
            $query = $query->where('offices.customer_unit_price', '<=', intval($params->customer_unit_price_upper));
        }
        // セット面
        if ($params->seat_num_lower) {
            $query = $query->where('offices.seat_num', '>=', intval($params->seat_num_lower));
        }
        if ($params->seat_num_upper) {
            $query = $query->where('offices.seat_num', '<=', intval($params->seat_num_upper));
        }
        // シャンプー台
        if ($params->shampoo_stand) {
            $query = $query->where('offices.shampoo_stand', 'LIKE', '%' . $params->shampoo_stand . '%');
        }
        // 客層
        if ($params->clientele) {
            $query = $query->leftJoin('office_clienteles', 'offices.id', '=', 'office_clienteles.office_id')
                ->where('office_clienteles.clientele', $params->clientele);
        }
        // キーワード
        if ($params->keyword) {
            if (!$params->commitment_term_id) {
                $query = $query->leftJoin('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id');
            }
            if (!$params->qualification_id) {
                $query = $query->leftJoin('job_qualifications', 'jobs.id', '=', 'job_qualifications.job_id');
            }
            if (!$params->holiday_id) {
                $query = $query->leftJoin('job_holidays', 'jobs.id', '=', 'job_holidays.job_id');
            }
            $query = $query->leftJoin('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
                ->leftJoin('qualifications', 'job_qualifications.qualification_id', '=', 'qualifications.id')
                ->leftJoin('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
                ->whereRaw('IFNULL(commitment_terms.status, 1) = 1')
                ->whereRaw('IFNULL(qualifications.status, 1) = 1')
                ->whereRaw('IFNULL(holidays.status, 1) = 1')
                ->where(function ($q) use ($params) {
                    $q->where('corporations.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('offices.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('prefectures.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('cities.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('job_categories.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('positions.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('employements.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('lines.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('stations.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('commitment_terms.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('qualifications.name', 'LIKE', '%' . $params->keyword . '%')
                        ->orWhere('holidays.name', 'LIKE', '%' . $params->keyword . '%');
                });
        }
        // オススメ求人
        if ($params->recommend) {
            $query = $query->where('jobs.recommend', 1);
        }
        return $query;
    }

    /**
     * 同一法人の他事業所取得
     */
    private function getOtherOfficeSameCorporation($jobs)
    {
        // 一覧にある求人の内、非公開求人以外の全法人IDを取得し、それで求人検索
        $corporation_ids = [];
        foreach ($jobs as $job) {
            if ($job->private) continue;
            if (in_array($job->corporation_id, $corporation_ids)) continue;
            $corporation_ids[] = $job->corporation_id;
        }
        if (count($corporation_ids) == 0 ) return [];

        $other_offices_tmp = Office::join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('jobs.status', 10)
            ->whereIn('offices.corporation_id', $corporation_ids)
            ->groupBy('offices.id')
            ->groupBy('offices.name')
            ->select(
                'offices.id as office_id',
                'offices.name as office_name',
                DB::raw('MAX(jobs.private) as private'),
                DB::raw('MAX(jobs.recommend) as recommend'),
                'offices.corporation_id as corporation_id',
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
            )
            ->get();

        // 事業所ID取得（各法人で6つまで）
        $office_ids = [];
        $other_offices = [];
        $office_cnt_corp = [];
        foreach ($other_offices_tmp as $oo) {
            if (!isset($office_cnt_corp[$oo->corporation_id])) {
                $office_cnt_corp[$oo->corporation_id] = 1;
            } else {
                $office_cnt_corp[$oo->corporation_id] += 1;
            }
            if ($office_cnt_corp[$oo->corporation_id] > 7) {
                // １つは、該当の事業所のため＋1
                continue;
            }
            $other_offices[] = $oo;
            $office_ids[] = $oo->office_id;
        }

        // アクセス情報を取得
        $office_accesses_tmp = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->whereIn('office_accesses.office_id', $office_ids)
            ->where('lines.status', 0)
            ->where('stations.status', 0)
            ->select(
                'office_accesses.office_id',
                'office_accesses.line_id',
                'lines.name as line_name',
                'office_accesses.station_id',
                'stations.name as station_name',
                'office_accesses.move_type',
                'office_accesses.time',
                'office_accesses.note',
            )
            ->orderBy('office_accesses.office_id')
            ->orderBy('office_accesses.time')
            ->get()
            ->toArray();
        foreach ($other_offices as $oo) {
            $index = array_search($oo->office_id, array_column($office_accesses_tmp, 'office_id'));
            if ($index !== false) {
                $access = $office_accesses_tmp[$index];
                $oo->access = $access['station_name'] . '駅 ' . OfficeAccess::MOVE_TYPE[$access['move_type']] . $access['time'] . '分';
            } else {
                $oo->access = null;
            }
        }

        // 一覧求人ごとに設定
        $other_offices_each_job = [];
        foreach ($jobs as $job) {
            if ($job->private) continue;
            $other_offices_each_job[$job->job_id] = [];
            foreach ($other_offices as $oo) {
                if ($job->corporation_id == $oo->corporation_id && $job->office_id != $oo->office_id) {
                    $other_offices_each_job[$job->job_id][] = $oo;
                }
            }
        }

        return $other_offices_each_job;
    }

    /**
     * 複数求人の画像取得
     */
    private function getMultipleJobImages($job_ids)
    {
        $job_images = JobImage::whereIn('job_images.job_id', $job_ids)
            ->select(
                'job_images.job_id',
                'job_images.image',
                'job_images.alttext',
                'job_images.sort',
                'job_images.updated_at',
            )
            ->orderBy('job_images.job_id')
            ->orderBy('job_images.sort')
            ->get();
        foreach ($job_images as $job_image) {
            $job_image->image = [
                'url' => config('uploadimage.job_image_relative_path') . $job_image->job_id . '/' . $job_image->image,
            ];
        }
        $office_images = OfficeImage::join('offices', 'office_images.office_id', '=', 'offices.id')
            ->join('jobs', 'offices.id', '=', 'jobs.office_id')
            ->whereIn('jobs.id', $job_ids)
            ->whereNull('offices.deleted_at')
            ->whereNull('jobs.deleted_at')
            ->select(
                'office_images.office_id',
                'jobs.id as job_id',
                'office_images.image',
                'office_images.alttext',
                'office_images.sort',
                'office_images.updated_at',
            )
            ->orderBy('office_images.office_id')
            ->orderBy('office_images.sort')
            ->get();
        foreach ($office_images as $office_image) {
            $office_image->image = [
                'url' => config('uploadimage.office_image_relative_path') . $office_image->office_id . '/' . $office_image->image,
            ];
        }
        $corporation_images = CorporationImage::join('corporations', function ($join) {
                $join->on('corporation_images.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('offices', function ($join) {
                $join->on('corporations.id', '=', 'offices.corporation_id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->whereIn('jobs.id', $job_ids)
            ->select(
                'corporation_images.corporation_id',
                'jobs.id as job_id',
                'corporation_images.image',
                'corporation_images.alttext',
                'corporation_images.sort',
                'corporation_images.updated_at',
            )
            ->orderBy('corporation_images.corporation_id')
            ->orderBy('corporation_images.sort')
            ->get();
        foreach ($corporation_images as $corporation_image) {
            $corporation_image->image = [
                'url' => config('uploadimage.corporation_image_relative_path') . $corporation_image->corporation_id . '/' . $corporation_image->image,
            ];
        }
    
        $result = [];
        foreach ($job_ids as $job_id) {
            // 該当の求人画像を抽出
            $tmp_job_image = [];
            foreach ($job_images as $job_image) {
                if ($job_image->job_id == $job_id) {
                    $tmp_job_image[] = $job_image;
                }
            }

            // 該当の事業所画像を抽出
            $tmp_office_image = [];
            foreach ($office_images as $office_image) {
                if ($office_image->job_id == $job_id) {
                    $tmp_office_image[] = $office_image;
                }
            }
            
            // 該当の法人画像を抽出
            $tmp_corporation_image = [];
            foreach ($corporation_images as $corporation_image) {
                if ($corporation_image->job_id == $job_id) {
                    $tmp_corporation_image[] = $corporation_image;
                }
            }

            // 上記の中で最後に更新した画像を使用
            $use_image = self::getMaxUpdatedAtImage($tmp_job_image, $tmp_office_image, $tmp_corporation_image);
            if (count($use_image) == 0) {
                continue;
            }
            $result[$job_id] = $use_image;
        }
        return $result;
    }

    /**
     * 求人の画像取得
     */
    private function getJobImages($job_id, $office_id, $corporation_id)
    {
        $job_images = JobImage::where('job_images.job_id', $job_id)
            ->select(
                'job_images.job_id',
                'job_images.image',
                'job_images.alttext',
                'job_images.sort',
                'job_images.updated_at',
            )
            ->orderBy('job_images.job_id')
            ->orderBy('job_images.sort')
            ->get();
        foreach ($job_images as $job_image) {
            $job_image->image = [
                'url' => config('uploadimage.job_image_relative_path') . $job_image->job_id . '/' . $job_image->image,
            ];
        }
        $office_images = OfficeImage::where('office_images.office_id', $office_id)
            ->select(
                'office_images.office_id',
                'office_images.image',
                'office_images.alttext',
                'office_images.sort',
                'office_images.updated_at',
            )
            ->orderBy('office_images.office_id')
            ->orderBy('office_images.sort')
            ->get();
        foreach ($office_images as $office_image) {
            $office_image->image = [
                'url' => config('uploadimage.office_image_relative_path') . $office_image->office_id . '/' . $office_image->image,
            ];
        }
        $corporation_images = CorporationImage::where('corporation_images.corporation_id', $corporation_id)
            ->select(
                'corporation_images.corporation_id',
                'corporation_images.image',
                'corporation_images.alttext',
                'corporation_images.sort',
                'corporation_images.updated_at',
            )
            ->orderBy('corporation_images.corporation_id')
            ->orderBy('corporation_images.sort')
            ->get();
        foreach ($corporation_images as $corporation_image) {
            $corporation_image->image = [
                'url' => config('uploadimage.corporation_image_relative_path') . $corporation_image->corporation_id . '/' . $corporation_image->image,
            ];
        }

        return self::getMaxUpdatedAtImage($job_images->toArray(), $office_images->toArray(), $corporation_images->toArray());
    }

    /**
     * 最後に更新した使用する画像を取得
     */
    private function getMaxUpdatedAtImage($job_images, $office_images, $corporation_images)
    {
        // 全てない場合や、１つしか設定していない場合は以下のように返却
        if (count($job_images) == 0 && count($office_images) == 0 && count($corporation_images) == 0) {
            return [];
        } else if (count($job_images) > 0 && count($office_images) == 0 && count($corporation_images) == 0) {
            return $job_images;
        } else if (count($job_images) == 0 && count($office_images) > 0 && count($corporation_images) == 0) {
            return $office_images;
        } else if (count($job_images) == 0 && count($office_images) == 0 && count($corporation_images) > 0) {
            return $corporation_images;
        }

        // ２つ以上設定している場合、更新日時が最新の方を使用する
        $base_datetime = '2000-01-01';
        $max_job_image_updated_at = count($job_images) > 0 ? max(array_column($job_images, 'updated_at')) : $base_datetime;
        $max_office_image_updated_at = count($office_images) > 0 ? max(array_column($office_images, 'updated_at')) : $base_datetime;
        $max_corporation_image_updated_at = count($corporation_images) > 0 ? max(array_column($corporation_images, 'updated_at')) : $base_datetime;
        if (strtotime($max_job_image_updated_at) > strtotime($max_corporation_image_updated_at) && strtotime($max_job_image_updated_at) > strtotime($max_office_image_updated_at)) {
            return $job_images;
        } else if (strtotime($max_office_image_updated_at) > strtotime($max_corporation_image_updated_at)) {
            return $office_images;
        } else {
            return $corporation_images;
        }
    }

    /**
     * PickUp求人情報を取得
     */
    private function getPickUpJobs($type, $limit)
    {
        $query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10);
        if ($type == 'pickup') {
            // PickUp求人
            $query = $query->where('jobs.pickup', 1);
        } else if ($type == 'syukyu2niti') {
            // 完全週休二日制
            $query = $query->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->where('job_commitment_terms.commitment_term_id', 2);
        } else if ($type == 'mikeikenka') {
            // 未経験可
            $query = $query->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->where('job_commitment_terms.commitment_term_id', 20);
        } else if ($type == 'majorsalon') {
            // 大手サロン
            $query = $query->where('corporations.salon_num', '>=', 11);
        } else if ($type == 'individualsalon') {
            // 個人サロン
            $query = $query->where('corporations.salon_num', '<=', 2);
        } else if ($type == 'new') {
            // 新着求人
            $new_day = (new \Datetime())->modify('-14 days');
            $query = $query->where('jobs.publish_start_date', '>=', $new_day);
        }
        $pickups = $query->select(
                'jobs.id as job_id',
                'jobs.name as job_name',
                'offices.id as office_id',
                'offices.name as office_name',
                'jobs.private',
                'jobs.recommend',
                'jobs.catch_copy',
                'job_categories.name as job_category_name',
                'positions.name as position_name',
                'employments.name as employment_name',
                'jobs.m_salary_lower',
                'jobs.m_salary_upper',
                'jobs.t_salary_lower',
                'jobs.t_salary_upper',
                'jobs.d_salary_lower',
                'jobs.d_salary_upper',
                'jobs.commission_lower',
                'jobs.commission_upper',
            )
            ->orderBy('jobs.pickup', 'desc')
            ->orderBy('corporations.higher_display', 'desc')
            ->orderBy('jobs.private')
            ->orderByRaw('RAND()')
            ->limit($limit)
            ->get();
        foreach ($pickups as $pickup) {
            $pickup->private = $pickup->private ? true : false;
            $pickup->recommend = $pickup->recommend ? true : false;
        }

        return $pickups;
    }

    /**
     * 事業所を取得
     */
    private function getOfficeInfo($office_id)
    {
        $office = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->where('offices.id', $office_id)
            ->select(
                'offices.id',
                'offices.name',
                'offices.corporation_id',
                'offices.postcode',
                'offices.prefecture_id',
                'prefectures.name as prefecture_name',
                'prefectures.permalink as prefecture_roman',
                'cities.government_city_id',
                'government_cities.name as government_city_name',
                'government_cities.permalink as government_city_roman',
                'offices.city_id',
                'cities.name as city_name',
                'cities.permalink as city_roman',
                'offices.address',
                'offices.tel',
                'offices.fax',
                'offices.business_time',
                'offices.regular_holiday',
                'offices.shampoo_stand',
                'offices.open_date',
                'offices.floor_space',
                'offices.seat_num',
                'offices.staff',
                'offices.new_customer_ratio',
                'offices.cut_unit_price',
                'offices.customer_unit_price',
                'offices.passive_smoking',
                'offices.external_url',
                'offices.sns_url',
            )->first();
        if ($office) {
            $office->passive_smoking = Office::PASSIVE_SMOKING[$office->passive_smoking];
        }
        return $office;
    }

    /**
     * 法人を取得
     */
    private function getCorporationInfo($corporation_id)
    {
        $corporation = Corporation::join('prefectures', 'corporations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'corporations.city_id', '=', 'cities.id')
            ->where('corporations.id', $office->corporation_id)
            ->select(
                'corporations.id',
                'corporations.name',
                'corporations.name_private',
                'corporations.postcode',
                'corporations.prefecture_id',
                'prefectures.name as prefecture_name',
                'corporations.city_id',
                'cities.name as city_name',
                'corporations.address',
                'corporations.tel',
                'corporations.fax',
                'corporations.yearly_turnover',
                'corporations.average_age',
                'corporations.drug_maker',
                'corporations.homepage',
                'corporations.salon_num',
                'corporations.employee_num',
                'corporations.owner_image',
                'corporations.owner_message',
            )->first();
        if ($corporation) {
            $corporation->name_private = $corporation->name_private ? true : false;
        }
        return $corporation;
    }

    /**
     * 事業所アクセスを取得
     */
    private function getOfficeAccesses($office_id)
    {
        $office_accesses = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('prefectures', 'stations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->where('office_accesses.office_id', $office_id)
            ->where('lines.status', 0)
            ->where('stations.status', 0)
            ->groupBy('office_accesses.office_id')
            ->groupBy('stations.station_group_id')
            ->select(
                'office_accesses.office_id',
                DB::raw('max(stations.name) as station_name'),
                DB::raw('max(prefectures.permalink) as prefecture_roman'),
                DB::raw('max(cities.permalink) as city_roman'),
                DB::raw('max(stations.permalink) as station_roman'),
                DB::raw('min(office_accesses.move_type) as move_type'),
                DB::raw('max(office_accesses.time) as time'),
                DB::raw('max(office_accesses.note) as note'),
            )
            ->orderBy('office_accesses.office_id')
            ->orderBy('time')
            ->get();
        foreach ($office_accesses as $office_access) {
            $office_access->move_type = OfficeAccess::MOVE_TYPE[$office_access->move_type];
        }
        return $office_accesses;
    }

    /**
     * 複数事業所の事業所アクセスを取得
     */
    private function getMultipleOfficeAccess($office_ids)
    {
        $office_accesses_tmp = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('prefectures', 'stations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->whereIn('office_accesses.office_id', $office_ids)
            ->where('lines.status', 0)
            ->where('stations.status', 0)
            ->groupBy('office_accesses.office_id')
            ->groupBy('stations.station_group_id')
            ->select(
                'office_accesses.office_id',
                DB::raw('MAX(stations.name) as station_name'),
                DB::raw('MAX(prefectures.permalink) as prefecture_roman'),
                DB::raw('MAX(cities.permalink) as city_roman'),
                DB::raw('MAX(stations.permalink) as station_roma'),
                DB::raw('MIN(office_accesses.move_type) as move_type'),
                DB::raw('MAX(office_accesses.time) as time'),
                DB::raw('MAX(office_accesses.note) as note'),
            )
            ->orderBy('office_accesses.office_id')
            ->orderBy('time')
            ->get();
        $office_accesses = [];
        foreach ($office_accesses_tmp as $oa) {
            if (!isset($office_accesses[$oa->office_id])) {
                $office_accesses[$oa->office_id] = [];
            }
            $oa->move_type = OfficeAccess::MOVE_TYPE[$oa->move_type];
            $office_accesses[$oa->office_id][] = $oa;
        }
        return $office_accesses;
    }

    /**
     * 求人こだわり条件を取得
     */
    private function getJobCommitmentTerms($job_id)
    {
        $job_commitment_terms = JobCommitmentTerm::join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('job_commitment_terms.job_id', $job_id)
            ->where('commitment_terms.status', 1)
            ->select(
                'job_commitment_terms.job_id',
                'job_commitment_terms.commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'commitment_terms.permalink as commitment_term_name_roman',
                'commitment_terms.category',
            )
            ->get();
        return $job_commitment_terms;
    }

    /**
     * 複数求人の求人こだわり条件を取得
     */
    private function getMultipleJobCommitmentTerms($job_ids)
    {
        $job_commitment_terms_tmp = JobCommitmentTerm::join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->whereIn('job_commitment_terms.job_id', $job_ids)
            ->where('commitment_terms.status', 1)
            ->select(
                'job_commitment_terms.job_id',
                'job_commitment_terms.commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'commitment_terms.category',
            )
            ->orderBy('job_commitment_terms.job_id')
            ->orderBy('job_commitment_terms.commitment_term_id')
            ->get();
        $job_commitment_terms = [];
        foreach ($job_commitment_terms_tmp as $jcc) {
            if (!isset($job_commitment_terms[$jcc->job_id])) {
                $job_commitment_terms[$jcc->job_id] = [];
            }
            $job_commitment_terms[$jcc->job_id][] = $jcc;
        }
        return $job_commitment_terms;
    }

    /**
     * 求人保有資格を取得
     */
    private function getJobQualifications($job_id)
    {
        $job_qualifications = JobQualification::join('qualifications', 'job_qualifications.qualification_id', '=', 'qualifications.id')
            ->where('job_qualifications.job_id', $job_id)
            ->where('qualifications.status', 1)
            ->select(
                'job_qualifications.job_id',
                'job_qualifications.qualification_id',
                'qualifications.name as qualification_name',
            )
            ->get();
        return $job_qualifications;
    }

    /**
     * 求人休日を取得
     */
    private function getJobHolidays($job_id)
    {
        $job_holidays = JobHoliday::join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('job_holidays.job_id', $job->id)
            ->where('holidays.status', 1)
            ->select(
                'job_holidays.job_id',
                'job_holidays.holiday_id',
                'holidays.name as holiday_name',
            )
            ->get();
        return $job_holidays;
    }

    /**
     * 複数求人の求人休日を取得
     */
    private function getMultipleJobHolidays($job_ids)
    {
        $job_holidays_tmp = JobHoliday::join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->whereIn('job_holidays.job_id', $job_ids)
            ->where('holidays.status', 1)
            ->select(
                'job_holidays.job_id',
                'job_holidays.holiday_id',
                'holidays.name as holiday_name',
            )
            ->orderBy('job_holidays.job_id')
            ->orderBy('job_holidays.holiday_id')
            ->get();
        $job_holidays = [];
        foreach ($job_holidays_tmp as $jh) {
            if (!isset($job_holidays[$jh->job_id])) {
                $job_holidays[$jh->job_id] = [];
            }
            $job_holidays[$jh->job_id][] = $jh;
        }
        return $job_holidays;
    }

    /**
     * 事業所客層を取得
     */
    private function getOfficeClienteles($office_id)
    {
        $office_clienteles = OfficeClientele::where('office_id', $office_id)
            ->select(
                'id',
                'clientele',
                'othertext',
            )
            ->get();
        foreach ($office_clienteles as $office_clientele) {
            $office_clientele->clientele = OfficeClientele::CLIENTELE[$office_clientele->clientele];
        }
        return $office_clienteles;
    }

    /**
     * 似た求人を取得
     */
    private function getAlikeJobs($city_id, $job_category_id, $position_id, $employment_id, $exclusion_job_id)
    {
        $query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->select(
                'jobs.id as job_id',
                'jobs.name as job_name',
                'offices.id as office_id',
                'offices.name as office_name',
                'jobs.private',
                'jobs.recommend',
                'jobs.catch_copy',
                'job_categories.name as job_category_name',
                'positions.name as position_name',
                'employments.name as employment_name',
                'jobs.m_salary_lower',
                'jobs.m_salary_upper',
                'jobs.t_salary_lower',
                'jobs.t_salary_upper',
                'jobs.d_salary_lower',
                'jobs.d_salary_upper',
                'jobs.commission_lower',
                'jobs.commission_upper',
            )
            ->orderBy('corporations.higher_display', 'desc')
            ->orderBy('jobs.private')
            ->orderByRaw('RAND()')
            ->limit(6);
        if ($city_id) {
            $query = $query->where('offices.city_id', $city_id);
        }
        if ($job_category_id) {
            $query = $query->where('jobs.job_category_id', $job_category_id);
        }
        if ($position_id) {
            $query = $query->where('jobs.position_id', $position_id);
        }
        if ($employment_id) {
            $query = $query->where('jobs.employment_id', $employment_id);
        }
        if (count($exclusion_job_id) > 0) {
            $query = $query->whereNotIn('jobs.id', $exclusion_job_id);
        }
        $alikes = $query->get();
        foreach ($alikes as $alike) {
            $alike->private = $alike->private ? true : false;
            $alike->recommend = $alike->recommend ? true : false;
        }
        $alikes = $alikes->toArray();

        $job_ids = array_column($alikes, 'job_id');
        $office_ids = array_column($alikes, 'office_id');

        // 求人画像
        $job_images = self::getMultipleJobImages($job_ids);
        foreach ($alikes as $alike) {
            if (isset($job_images[$alike->job_id]) && count($job_images[$alike->job_id]) > 0) {
                $alike->image = $job_images[$alike->job_id][0]->image;
                $alike->image_updated_at = $job_images[$alike->job_id][0]->updated_at;
                $alike->alttext = $job_images[$alike->job_id][0]->alttext;
            } else {
                $alike->image = null;
                $alike->image_updated_at = null;
                $alike->alttext = null;
            }
        }

        // 事業所アクセス
        $office_accesses = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->whereIn('office_accesses.office_id', $office_ids)
            ->where('lines.status', 0)
            ->where('stations.status', 0)
            ->groupBy('office_accesses.office_id')
            ->groupBy('stations.station_group_id')
            ->select(
                'office_accesses.office_id',
                DB::raw('MAX(stations.name) as station_name'),
                DB::raw('MIN(office_accesses.move_type) as move_type'),
                DB::raw('MAX(office_accesses.time) as time'),
            )
            ->orderBy('office_accesses.office_id')
            ->orderBy('time')
            ->get()
            ->toArray();
        foreach ($alikes as $alike) {
            $index = array_search($alike->office_id, array_column($office_accesses, 'office_id'));
            if ($index !== false) {
                $access = $office_accesses[$index];
                $alike->access = $access['station_name'] . '駅 ' . OfficeAccess::MOVE_TYPE[$access['move_type']] . $access['time'] . '分';
            } else {
                $alike->access = null;
            }
        }

        return $alikes;
    }

    /**
     * その他条件の関連リンクを取得
     */
    private function getRelationConditionLink($condition, $prefecture_id, $government_city_id, $city_id, $line_id, $station_id)
    {
        $base_data = [];
        $job_count_query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('jobs.status', 10);
        if ($condition == 'position') {
            $base_data = Position::where('positions.status', 1)
                ->select(
                    'positions.id as position_id',
                    'positions.name as position_name,',
                    'positions.permalink as position_roman',
                    'positions.id as matching_key',
                )
                ->get();
            $job_count_query = $job_count_query->groupBy('jobs.position_id')
                ->select(
                    'jobs.position_id as matching_key',
                );
        } else if ($condition == 'employment') {
            $base_data = Employment::where('employments.status', 1)
                ->select(
                    'employments.id as employment_id',
                    'employments.name as employment_name,',
                    'employments.permalink as employment_roman',
                    'employments.id as matching_key',
                )
                ->get();
            $job_count_query = $job_count_query->groupBy('jobs.employment_id')
                ->select(
                    'jobs.employment_id as matching_key',
                );
        } else if ($condition == 'treatment' || $condition == 'commitment') {
            $base_data_query = CommitmentTerm::where('commitment_terms.status', 1)
                ->select(
                    'commitment_terms.id as commitment_term_id',
                    'commitment_terms.name as commitment_term_name,',
                    'commitment_terms.permalink as commitment_term_roman',
                    'commitment_terms.id as matching_key',
                );
            $job_count_query = $job_count_query->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
                ->groupBy('job_commitment_terms.commitment_term_id')
                ->select(
                    'job_commitment_terms.commitment_term_id as matching_key',
                );
            if ($condition == 'treatment') {
                $base_data_query = $base_data_query->where('commitment_terms.category', 1);
            }
            $base_data = $base_data_query->get();
        } else {
            return [];
        }
        $base_data->prefecture_roman = '';
        $base_data->government_city_roman = '';
        $base_data->city_roman = '';
        $base_data->line_roman = '';
        $base_data->station_roman = '';
        $base_data->job_count = 0;

        if ($government_city_id) {
            // 件数取得クエリ
            $job_count_data = $job_count_query->where('cities.government_city_id', $government_city_id)
                ->addSelect(
                    DB::raw('COUNT(distinct jobs.id) as job_count'),
                )
                ->get();
            // 政令指定都市情報
            $government_city = GovernmentCity::join('prefectures', 'government_cities.prefecture_id', '=', 'prefectures.id')
                ->where('government_cities.id', $government_city_id)
                ->select(
                    'prefectures.permalink as prefecture_roman',
                    'government_cities.permalink as government_city_roman',
                )
                ->first();
            // 上記をベースのデータとマージする
            foreach ($base_data as $base) {
                $base->prefecture_roman = $government_city->prefecture_roman;
                $base->government_city_roman = $government_city->government_city_roman;
                $base->city_roman = '';
                $base->line_roman = '';
                $base->station_roman = '';
                $base->job_count = 0;
                foreach ($job_count_data as $count_row) {
                    if ($base->matching_key == $count_row->matching_key) {
                        $base->job_count = $count_row->job_count;
                        break;
                    }
                }
            }
        } else if ($city_id) {
            // 件数取得クエリ
            $job_count_data = $job_count_query->where('offices.city_id', $city_id)
                ->addSelect(
                    DB::raw('COUNT(distinct jobs.id) as job_count'),
                )
                ->get();
            // 市区町村情報
            $city = City::join('prefectures', 'cities.prefecture_id', '=', 'prefectures.id')
                ->where('cities.id', $city_id)
                ->select(
                    'prefectures.permalink as prefecture_roman',
                    'cities.permalink as city_roman',
                )
                ->first();
            // 上記をベースのデータとマージする
            foreach ($base_data as $base) {
                $base->prefecture_roman = $city->prefecture_roman;
                $base->government_city_roman = '';
                $base->city_roman = $city->city_roman;
                $base->line_roman = '';
                $base->station_roman = '';
                $base->job_count = 0;
                foreach ($job_count_data as $count_row) {
                    if ($base->matching_key == $count_row->matching_key) {
                        $base->job_count = $count_row->job_count;
                        break;
                    }
                }
            }
        } else if ($line_id) {
            // 件数取得クエリ
            $job_count_data = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->where('office_accesses.line_id', $line_id)
                ->addSelect(
                    DB::raw('COUNT(distinct jobs.id) as job_count'),
                )
                ->get();
            // 路線情報取得
            $line = Line::where('id', $line_id)->where('status', 0)->first();
            $prefecture = Prefecture::find($prefecture_id);
            // 上記をベースのデータとマージする
            foreach ($base_data as $base) {
                $base->prefecture_roman = $prefecture->permalink;
                $base->government_city_roman = '';
                $base->city_roman = '';
                $base->line_roman = $line->permalink;
                $base->station_roman = '';
                $base->job_count = 0;
                foreach ($job_count_data as $count_row) {
                    if ($base->matching_key == $count_row->matching_key) {
                        $base->job_count = $count_row->job_count;
                        break;
                    }
                }
            }
        } else if ($station_id) {
            // 件数取得クエリ
            $job_count_data = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->where('stations.station_group_id', $station_id)
                ->addSelect(
                    DB::raw('COUNT(distinct jobs.id) as job_count'),
                )
                ->get();
            // 駅情報取得
            $station = Station::join('prefectures', 'stations.prefecture_id', 'prefectures.id')
                ->join('cities', 'stations.city_id', 'cities.id')
                ->where('stations.id', $station_id)
                ->where('stations.status', 0)
                ->select(
                    'prefectures.permalink as prefecture_roman',
                    'cities.permalink as city_roman',
                    'stations.permalink as station_roman',
                )
                ->first();
            // 上記をベースのデータとマージする
            foreach ($base_data as $base) {
                $base->prefecture_roman = $station->prefecture_roman;
                $base->government_city_roman = '';
                $base->city_roman = $station->city_roman;
                $base->line_roman = '';
                $base->station_roman = $station->station_roman;
                $base->job_count = 0;
                foreach ($job_count_data as $count_row) {
                    if ($base->matching_key == $count_row->matching_key) {
                        $base->job_count = $count_row->job_count;
                        break;
                    }
                }
            }
        } else {
            // 件数取得クエリ
            $job_count_data = $job_count_query->where('offices.prefecture_id', $prefecture_id)
                ->addSelect(
                    DB::raw('COUNT(distinct jobs.id) as job_count'),
                )
                ->get();
            // 都道府県情報取得
            $prefecture = Prefecture::find($prefecture_id);
            // 上記をベースのデータとマージする
            foreach ($base_data as $base) {
                $base->prefecture_roman = $prefecture->permalink;
                $base->government_city_roman = '';
                $base->city_roman = '';
                $base->line_roman = '';
                $base->station_roman = '';
                $base->job_count = 0;
                foreach ($job_count_data as $count_row) {
                    if ($base->matching_key == $count_row->matching_key) {
                        $base->job_count = $count_row->job_count;
                        break;
                    }
                }
            }
        }

        return $base_data;
    }
}