<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Member;
use App\Models\Applicant;
use App\Models\Inquiry;
use App\Models\Corporation;
use App\Library\RegisterRoot;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * 求人関連の件数を取得
     */
    public function getJobCount()
    {
        // ステータス別の求人件数を取得
        $job_count_every_status = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->groupBy('jobs.status')
            ->select(
                'jobs.status',
                DB::raw('count(distinct jobs.id) as job_count')
            )
            ->get();
        $publish_job_count = 0;
        foreach ($job_count_every_status as $row) {
            $row->status_name = Job::STATUS[$row->status];
            if ($row->status == 10) {
                $publish_job_count = $row->job_count;
            }
        }
        
        // 都道府県別の掲載中求人件数を取得
        $job_count_every_prefecture = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->where('jobs.status', 10)
            ->groupBy('offices.prefecture_id')
            ->select(
                'offices.prefecture_id',
                'prefectures.name as prefecture_name',
                DB::raw('count(distinct jobs.id) as job_count')
            )
            ->get();

        return response()->json([
            'job_count_every_status' => $job_count_every_status,
            'job_count_every_prefecture' => $job_count_every_prefecture,
            'publish_job_count' => $publish_job_count,
        ]);
    }

    /**
     * 会員関連の件数を取得
     */
    public function getMemberCount()
    {
        // 月別の登録会員件数の元データ取得
        $member_count_every_month = Member::select(
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%Y\') as created_year'),
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%m\') as created_month'),
                DB::raw('count(distinct id) as member_count')
            )
            ->groupBy('created_year')
            ->groupBy('created_month')
            ->orderBy('created_year')
            ->orderBy('created_month')
            ->get();

        // 月別登録会員件数、今月登録会員件数、過去1年間会員登録件数に変換
        $member_count_every_year = [];
        $member_count_this_month = 0;
        $member_count_one_year_ago = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        foreach ($member_count_every_month as $row) {
            // 対象の年が存在しない場合、初期化
            $index = array_search($row->created_year, array_column($member_count_every_year, 'created_year'));
            if (false === $index) {
                $member_count_every_year[] = [
                    'created_year' => $row->created_year,
                    'member_count' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
            }
            // 応募件数格納
            $index = array_search($row->created_year, array_column($member_count_every_year, 'created_year'));
            $member_count_every_year[$index]['member_count'][intval($row->created_month) - 1] = $row->member_count;
            // 今月の応募件数
            if ($row->created_year == date('Y') && $row->created_month == date('m')) {
                $member_count_this_month = $row->member_count;
                $member_count_one_year_ago[count($member_count_one_year_ago) - 1] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-1 month')) && $row->created_month == date('m', strtotime('-1 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 2] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-2 month')) && $row->created_month == date('m', strtotime('-2 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 3] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-3 month')) && $row->created_month == date('m', strtotime('-3 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 4] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-4 month')) && $row->created_month == date('m', strtotime('-4 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 5] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-5 month')) && $row->created_month == date('m', strtotime('-5 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 6] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-6 month')) && $row->created_month == date('m', strtotime('-6 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 7] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-7 month')) && $row->created_month == date('m', strtotime('-7 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 8] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-8 month')) && $row->created_month == date('m', strtotime('-8 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 9] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-9 month')) && $row->created_month == date('m', strtotime('-9 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 10] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-10 month')) && $row->created_month == date('m', strtotime('-10 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 11] = $row->member_count;
            } else if ($row->created_year == date('Y', strtotime('-11 month')) && $row->created_month == date('m', strtotime('-11 month'))) {
                $member_count_one_year_ago[count($member_count_one_year_ago) - 12] = $row->member_count;
            }
        }

        // 経路、月別の登録会員数の元データ取得
        $member_count_every_month_root = Member::leftJoin('conversion_histories', 'members.id', '=', 'conversion_histories.member_id')
            ->select(
                DB::raw('DATE_FORMAT(convert_tz(members.created_at, \'+00:00\', \'+09:00\'), \'%Y\') as created_year'),
                DB::raw('DATE_FORMAT(convert_tz(members.created_at, \'+00:00\', \'+09:00\'), \'%m\') as created_month'),
                'conversion_histories.utm_source',
                'conversion_histories.utm_medium',
                'conversion_histories.utm_campaign',
                'members.register_site',
                DB::raw('count(distinct members.id) as member_count'),
                DB::raw('count(distinct case when members.status in (4, 5, 6, 9) then members.id else null end) as entry_count'),
                DB::raw('count(distinct case when members.status in (4, 5, 6) then members.id else null end) as interview_count'),
                DB::raw('count(distinct case when members.status in (5, 6) then members.id else null end) as offer_count'),
                DB::raw('count(distinct case when members.status in (6) then members.id else null end) as contract_count'),
            )
            ->groupBy('created_year')
            ->groupBy('created_month')
            ->groupBy('conversion_histories.utm_source')
            ->groupBy('conversion_histories.utm_medium')
            ->groupBy('conversion_histories.utm_campaign')
            ->groupBy('members.register_site')
            ->orderBy('created_year')
            ->orderBy('created_month')
            ->get();

        // 経路・月別登録会員件数に変換
        $member_count_every_year_root = [];
        foreach ($member_count_every_month_root as $row) {
            // 対象の年が存在しない場合、初期化
            $year_index = array_search($row->created_year, array_column($member_count_every_year_root, 'created_year'));
            if (false === $year_index) {
                $member_count_every_year_root[] = [
                    'created_year' => $row->created_year,
                    'member_count_every_root' => [],
                ];
            }
            $year_index = array_search($row->created_year, array_column($member_count_every_year_root, 'created_year'));

            // 対象の登録経路が存在しない場合、初期化
            $register_root = RegisterRoot::getRegisterRootByUtmParams($row->utm_source, $row->utm_medium, $row->utm_campaign);
            $root_index = array_search($register_root, array_column($member_count_every_year_root[$year_index]['member_count_every_root'], 'register_root'));
            if (false === $root_index) {
                $member_count_every_year_root[$year_index]['member_count_every_root'][] = [
                    'register_root' => $register_root,
                    'member_count' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
            }
            // 会員件数格納
            $root_index = array_search($register_root, array_column($member_count_every_year_root[$year_index]['member_count_every_root'], 'register_root'));
            $member_count_every_year_root[$year_index]['member_count_every_root'][$root_index]['member_count'][intval($row->created_month) - 1] += $row->member_count;
        }
        

        // 経路・月別会員登録展開率（Google全て）に変換
        $member_deployment_every_month_by_google_all = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', null, 1);

        // 経路・月別会員登録展開率（Googleヘアメイク、アイリスト、カラーリスト除く）
        $member_deployment_every_month_by_google = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', 'gooogle_listing', 1);

        // 経路・月別会員登録展開率（Googleヘアメイク）
        $member_deployment_every_month_by_google_hairmake = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', 'gooogle_listing_hairmake', 1);
        
        // 経路・月別会員登録展開率（Googleアイリスト）
        $member_deployment_every_month_by_google_eyelist = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', 'gooogle_listing_eyelist', 1);

        // 経路・月別会員登録展開率（Googleカラーリスト）
        $member_deployment_every_month_by_google_colorlist = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', 'gooogle_listing_colorlist', 1);

        // 経路・月別会員登録展開率（Yahoo）
        $member_deployment_every_month_by_yahoo = self::createMemberDeploymentData($member_count_every_month_root, 'yahoo', 'cpc', null, 1);

        // 経路・月別会員登録展開率（Google人材紹介）
        $member_deployment_every_month_by_google_agent = self::createMemberDeploymentData($member_count_every_month_root, 'google', 'cpc', null, 2);

        return response()->json([
            'member_count_every_year' => $member_count_every_year,
            'member_count_this_month' => $member_count_this_month,
            'member_count_one_year_ago' => $member_count_one_year_ago,
            'member_count_every_year_root' => $member_count_every_year_root,
            'member_deployment_every_month_by_google_all' => $member_deployment_every_month_by_google_all,
            'member_deployment_every_month_by_google' => $member_deployment_every_month_by_google,
            'member_deployment_every_month_by_google_hairmake' => $member_deployment_every_month_by_google_hairmake,
            'member_deployment_every_month_by_google_eyelist' => $member_deployment_every_month_by_google_eyelist,
            'member_deployment_every_month_by_google_colorlist' => $member_deployment_every_month_by_google_colorlist,
            'member_deployment_every_month_by_yahoo' => $member_deployment_every_month_by_yahoo,
            'member_deployment_every_month_by_google_agent' => $member_deployment_every_month_by_google_agent,
        ]);
    }

    /**
     * 応募者関連の件数取得
     */
    public function getApplicantCount()
    {
        // 月別の応募件数の元データ取得
        $applicant_count_every_month = Applicant::select(
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%Y\') as created_year'),
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%m\') as created_month'),
                DB::raw('count(distinct id) as applicant_count')
            )
            ->groupBy('created_year')
            ->groupBy('created_month')
            ->orderBy('created_year')
            ->orderBy('created_month')
            ->get();

        // 月別応募者件数、今月応募者件数、過去1年間応募者件数に変換
        $applicant_count_every_year = [];
        $applicant_count_this_month = 0;
        $applicant_count_one_year_ago = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        foreach ($applicant_count_every_month as $row) {
            // 対象の年が存在しない場合、初期化
            $index = array_search($row->created_year, array_column($applicant_count_every_year, 'created_year'));
            if (false === $index) {
                $applicant_count_every_year[] = [
                    'created_year' => $row->created_year,
                    'applicant_count' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
            }
            // 応募件数格納
            $index = array_search($row->created_year, array_column($applicant_count_every_year, 'created_year'));
            $applicant_count_every_year[$index]['applicant_count'][intval($row->created_month) - 1] = $row->applicant_count;
            // 今月の応募件数
            if ($row->created_year == date('Y') && $row->created_month == date('m')) {
                $applicant_count_this_month = $row->applicant_count;
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 1] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-1 month')) && $row->created_month == date('m', strtotime('-1 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 2] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-2 month')) && $row->created_month == date('m', strtotime('-2 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 3] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-3 month')) && $row->created_month == date('m', strtotime('-3 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 4] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-4 month')) && $row->created_month == date('m', strtotime('-4 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 5] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-5 month')) && $row->created_month == date('m', strtotime('-5 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 6] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-6 month')) && $row->created_month == date('m', strtotime('-6 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 7] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-7 month')) && $row->created_month == date('m', strtotime('-7 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 8] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-8 month')) && $row->created_month == date('m', strtotime('-8 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 9] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-9 month')) && $row->created_month == date('m', strtotime('-9 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 10] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-10 month')) && $row->created_month == date('m', strtotime('-10 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 11] = $row->applicant_count;
            } else if ($row->created_year == date('Y', strtotime('-11 month')) && $row->created_month == date('m', strtotime('-11 month'))) {
                $applicant_count_one_year_ago[count($applicant_count_one_year_ago) - 12] = $row->applicant_count;
            }
        }
        
        // 経路・月別の応募者件数の元データ取得
        $applicant_count_every_month_root = Applicant::leftJoin('conversion_histories', 'applicants.id', '=', 'conversion_histories.applicant_id')
            ->leftJoin('members', function ($join) {
                $join->on('applicants.member_id', '=', 'members.id')
                    ->whereNull('members.deleted_at');
            })
            ->select(
                DB::raw('DATE_FORMAT(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\'), \'%Y\') as created_year'),
                DB::raw('DATE_FORMAT(convert_tz(applicants.created_at, \'+00:00\', \'+09:00\'), \'%m\') as created_month'),
                'conversion_histories.utm_source',
                'conversion_histories.utm_medium',
                'conversion_histories.utm_campaign',
                DB::raw('case when members.created_at is null then 0 when members.created_at < applicants.created_at then 1 else 0 end as after_register_member'),
                DB::raw('count(distinct applicants.id) as applicant_count'),
            )
            ->groupBy('created_year')
            ->groupBy('created_month')
            ->groupBy('conversion_histories.utm_source')
            ->groupBy('conversion_histories.utm_medium')
            ->groupBy('conversion_histories.utm_campaign')
            ->groupBy('after_register_member')
            ->orderBy('created_year')
            ->orderBy('created_month')
            ->get();

        // 経路・月別の応募者件数に変換
        $applicant_count_every_year_root = [];
        foreach ($applicant_count_every_month_root as $row) {
            // 対象の年が存在しない場合、初期化
            $year_index = array_search($row->created_year, array_column($applicant_count_every_year_root, 'created_year'));
            if (false === $year_index) {
                $applicant_count_every_year_root[] = [
                    'created_year' => $row->created_year,
                    'applicant_count_every_root' => [],
                ];
            }
            $year_index = array_search($row->created_year, array_column($applicant_count_every_year_root, 'created_year'));

            // 対象の登録経路が存在しない場合、初期化
            $register_root = RegisterRoot::getApplicantRegisterRootByUtmParams(
                $row->utm_source,
                $row->utm_medium,
                $row->utm_campaign,
                // 会員登録後に応募した場合は必ず自然応募（会員登録後）になるように引数を指定
                $row->after_register_member == 1 ? date("Y-m-d",strtotime("-1 day")) : null,
                $row->after_register_member == 1 ? date("Y-m-d") : null,
            );
            $root_index = array_search($register_root, array_column($applicant_count_every_year_root[$year_index]['applicant_count_every_root'], 'register_root'));
            if (false === $root_index) {
                $applicant_count_every_year_root[$year_index]['applicant_count_every_root'][] = [
                    'register_root' => $register_root,
                    'applicant_count' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
            }
            // 応募者件数格納
            $root_index = array_search($register_root, array_column($applicant_count_every_year_root[$year_index]['applicant_count_every_root'], 'register_root'));
            $applicant_count_every_year_root[$year_index]['applicant_count_every_root'][$root_index]['applicant_count'][intval($row->created_month) - 1] += $row->applicant_count;
        }

        // 法人別応募数を取得
        $contract_subquery = DB::table('contracts as contracts1')
            ->leftJoin('contracts as contracts2', function ($join) {
                $join->on('contracts1.corporation_id', '=', 'contracts2.corporation_id');
                $join->on('contracts1.id', '<', 'contracts2.id');
            })
            ->join('plans', 'contracts1.plan_id', '=', 'plans.id')
            ->whereNull('contracts2.id')
            ->select(
                'contracts1.id',
                'contracts1.corporation_id',
                'contracts1.plan_id',
                'plans.name as plan_name',
                'contracts1.start_date',
                'contracts1.end_plan_date',
                'contracts1.end_date',
            );
        $applicant_count_every_corporation = Corporation::join('offices', function ($join) {
                $join->on('corporations.id', '=', 'offices.corporation_id')
                    ->whereNull('offices.deleted_at');
            })
            ->leftJoin('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('applicants', function ($join) {
                $join->on('jobs.id', '=', 'applicants.job_id')
                    ->whereNull('applicants.deleted_at');
            })
            ->leftJoin(DB::raw("({$contract_subquery->toSql()}) as latest_contracts"), 'corporations.id', '=', 'latest_contracts.corporation_id')
            ->join('prefectures', 'corporations.prefecture_id', '=', 'prefectures.id')
            ->groupBy('corporations.id')
            ->groupBy('latest_contracts.id')
            ->select(
                'corporations.id as corporation_id',
                'corporations.name as corporation_name',
                'prefectures.name as prefecture_name',
                DB::raw('count(distinct offices.id) as office_count'),
                DB::raw('count(distinct applicants.id) as applicant_count'),
                'latest_contracts.plan_name',
                'latest_contracts.start_date',
                'latest_contracts.end_plan_date',
                'latest_contracts.end_date',
            )
            ->get();

        return response()->json([
            'applicant_count_every_year' => $applicant_count_every_year,
            'applicant_count_this_month' => $applicant_count_this_month,
            'applicant_count_one_year_ago' => $applicant_count_one_year_ago,
            'applicant_count_every_year_root' => $applicant_count_every_year_root,
            'applicant_count_every_corporation' => $applicant_count_every_corporation,
        ]);
    }

    /**
     * 問い合わせ関連の件数取得
     */
    public function getInquiryCount()
    {
        // 月別の問い合わせ件数の元データ取得
        $inquiry_count_every_month = Inquiry::select(
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%Y\') as created_year'),
                DB::raw('DATE_FORMAT(convert_tz(created_at, \'+00:00\', \'+09:00\'), \'%m\') as created_month'),
                DB::raw('count(distinct id) as inquiry_count')
            )
            ->groupBy('created_year')
            ->groupBy('created_month')
            ->orderBy('created_year')
            ->orderBy('created_month')
            ->get();

        // 月別問い合わせ件数、今月問い合わせ件数、過去1年間問い合わせ件数に変換
        $inquiry_count_every_year = [];
        $inquiry_count_this_month = 0;
        $inquiry_count_one_year_ago = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        foreach ($inquiry_count_every_month as $row) {
            // 対象の年が存在しない場合、初期化
            $index = array_search($row->created_year, array_column($inquiry_count_every_year, 'created_year'));
            if (false === $index) {
                $inquiry_count_every_year[] = [
                    'created_year' => $row->created_year,
                    'inquiry_count' => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
            }
            // 問い合わせ件数格納
            $index = array_search($row->created_year, array_column($inquiry_count_every_year, 'created_year'));
            $inquiry_count_every_year[$index]['inquiry_count'][intval($row->created_month) - 1] = $row->inquiry_count;
            // 今月の問い合わせ件数
            if ($row->created_year == date('Y') && $row->created_month == date('m')) {
                $inquiry_count_this_month = $row->inquiry_count;
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 1] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-1 month')) && $row->created_month == date('m', strtotime('-1 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 2] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-2 month')) && $row->created_month == date('m', strtotime('-2 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 3] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-3 month')) && $row->created_month == date('m', strtotime('-3 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 4] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-4 month')) && $row->created_month == date('m', strtotime('-4 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 5] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-5 month')) && $row->created_month == date('m', strtotime('-5 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 6] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-6 month')) && $row->created_month == date('m', strtotime('-6 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 7] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-7 month')) && $row->created_month == date('m', strtotime('-7 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 8] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-8 month')) && $row->created_month == date('m', strtotime('-8 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 9] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-9 month')) && $row->created_month == date('m', strtotime('-9 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 10] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-10 month')) && $row->created_month == date('m', strtotime('-10 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 11] = $row->inquiry_count;
            } else if ($row->created_year == date('Y', strtotime('-11 month')) && $row->created_month == date('m', strtotime('-11 month'))) {
                $inquiry_count_one_year_ago[count($inquiry_count_one_year_ago) - 12] = $row->inquiry_count;
            }
        }

        return response()->json([
            'inquiry_count_every_year' => $inquiry_count_every_year,
            'inquiry_count_this_month' => $inquiry_count_this_month,
            'inquiry_count_one_year_ago' => $inquiry_count_one_year_ago,
        ]);
    }

    /**
     * 会員の展開率データを作成
     */
    private function createMemberDeploymentData($member_count_every_month_root, $utm_source, $utm_medium, $utm_campaign, $register_site)
    {
        $result = [];

        // 初期化
        for ($i = 0; $i < 12; $i++) {
            $key = $i == 0 ? date('Ym') : date('Ym', strtotime('-' . $i . ' month'));
            $result[] = [
                'created_ym' => $key,
                'member_count' => 0,
                'entry_count' => 0,
                'entry_ratio' => null,
                'interview_count' => 0,
                'interview_ratio' => null,
                'offer_count' => 0,
                'offer_ratio' => null,
                'contract_count' => 0,
                'contract_ratio' => null,
            ];
            
        }

        // 取得データより該当箇所に設定
        foreach ($member_count_every_month_root as $row) {
            // 引数に指定した参照元、キャンペーン、登録サイトに該当しない場合は、スキップ
            if ($utm_source && $row->utm_source != $utm_source) {
                continue;
            }
            if ($utm_medium && $row->utm_medium != $utm_medium) {
                continue;
            }
            if ($utm_campaign && $row->utm_campaign != $utm_campaign) {
                continue;
            }
            if ($register_site && $row->register_site != $register_site) {
                continue;
            }

            // 直近1年でなければスキップ
            $index = array_search($row->created_year . $row->created_month, array_column($result, 'created_ym'));
            if ($index === false) {
                continue;
            }

            // データを追加
            $result[$index]['member_count'] += $row->member_count;
            $result[$index]['entry_count'] += $row->entry_count;
            $result[$index]['interview_count'] += $row->interview_count;
            $result[$index]['offer_count'] += $row->offer_count;
            $result[$index]['contract_count'] += $row->contract_count;
            if ($result[$index]['member_count'] == 0) {
                continue;
            }
            $result[$index]['entry_ratio'] = round($result[$index]['entry_count'] / $result[$index]['member_count'], 4);
            $result[$index]['interview_ratio'] = round($result[$index]['interview_count'] / $result[$index]['member_count'], 4);
            $result[$index]['offer_ratio'] = round($result[$index]['offer_count'] / $result[$index]['member_count'], 4);
            $result[$index]['contract_ratio'] = round($result[$index]['contract_count'] / $result[$index]['member_count'], 4);
        }

        return $result;
    }
}