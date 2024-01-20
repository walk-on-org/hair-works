<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Prefecture;
use App\Models\GovernmentCity;
use App\Models\City;
use App\Models\Line;
use App\Models\Station;
use App\Models\JobCategory;
use App\Models\Position;
use App\Models\Employment;
use App\Models\Holiday;
use App\Models\CommitmentTerm;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConditionController extends Controller
{
    /**
     * 検索条件全取得
     */
    public function all()
    {
        // 都道府県
        $prefectures = Prefecture::orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        // 職種
        $job_categories = JobCategory::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        // 役職/役割
        $positions = Position::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        // 雇用形態
        $employments = Employment::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        // 給与
        $salaris = [
            ['type' => 1, 'key' => 160000, 'value' => '月給16万以上', 'name_roma' => 'gekkyu16'],
            ['type' => 1, 'key' => 180000, 'value' => '月給18万以上', 'name_roma' => 'gekkyu18'],
            ['type' => 1, 'key' => 200000, 'value' => '月給20万以上', 'name_roma' => 'gekkyu20'],
            ['type' => 1, 'key' => 250000, 'value' => '月給25万以上', 'name_roma' => 'gekkyu25'],
            ['type' => 1, 'key' => 300000, 'value' => '月給30万以上', 'name_roma' => 'gekkyu30'],
            ['type' => 2, 'key' => 800, 'value' => '時給800円以上', 'name_roma' => 'zikyu800'],
            ['type' => 2, 'key' => 1000, 'value' => '時給1,000円以上', 'name_roma' => 'zikyu1000'],
            ['type' => 2, 'key' => 1200, 'value' => '時給1,200円以上', 'name_roma' => 'zikyu1200'],
            ['type' => 2, 'key' => 1500, 'value' => '時給1,500円以上', 'name_roma' => 'zikyu1500'],
            ['type' => 4, 'key' => 8000, 'value' => '日給8,000円以上', 'name_roma' => 'nikyu8'],
            ['type' => 4, 'key' => 10000, 'value' => '日給10,000円以上', 'name_roma' => 'nikyu10'],
            ['type' => 4, 'key' => 15000, 'value' => '日給15,000円以上', 'name_roma' => 'nikyu15'],
            ['type' => 4, 'key' => 20000, 'value' => '日給20,000円以上', 'name_roma' => 'nikyu20'],
            ['type' => 3, 'key' => 40, 'value' => '歩合40%〜', 'name_roma' => 'buai40'],
            ['type' => 3, 'key' => 50, 'value' => '歩合50%〜', 'name_roma' => 'buai50'],
            ['type' => 3, 'key' => 60, 'value' => '歩合60%〜', 'name_roma' => 'buai60'],
            ['type' => 3, 'key' => 70, 'value' => '歩合70%〜', 'name_roma' => 'buai70'],
            ['type' => 3, 'key' => 80, 'value' => '歩合80%〜', 'name_roma' => 'buai80'],
        ];
        // 休日
        $holidays = Holiday::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();
        // こだわり条件
        $commitment_terms = CommitmentTerm::where('status', 1)
            ->orderBy('category')
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
                'category',
            )
            ->get();
        foreach ($commitment_terms as $commitment_term) {
            $commitment_term->category = CommitmentTerm::CATEGORY[$commitment_term->category];
        }
        // 店舗数
        $salon_nums = [
            ['key' => 0, 'value' => 'こだわらない', 'lower' => null, 'upper' => null],
            ['key' => 1, 'value' => '1〜2店舗', 'lower' => 1, 'upper' => 2],
            ['key' => 2, 'value' => '3〜5店舗', 'lower' => 3, 'upper' => 5],
            ['key' => 3, 'value' => '6〜10店舗', 'lower' => 6, 'upper' => 10],
            ['key' => 4, 'value' => '11店舗〜', 'lower' => 11, 'upper' => null],
        ];
        // 駅からの所要時間
        $accesses = [
            ['key' => 1, 'value' => '徒歩 5分以内', 'type' => 1, 'time' => 5],
            ['key' => 2, 'value' => '徒歩 10分以内', 'type' => 1, 'time' => 10],
            ['key' => 3, 'value' => '車 5分以内', 'type' => 2, 'time' => 5],
            ['key' => 4, 'value' => '車 10分以内', 'type' => 2, 'time' => 10],
            ['key' => 5, 'value' => 'バス 5分以内', 'type' => 3, 'time' => 5],
            ['key' => 6, 'value' => 'バス 10分以内', 'type' => 3, 'time' => 10],
        ];
        // 店舗のスタッフ数
        $staff_nums = [
            ['key' => 0, 'value' => 'こだわらない', 'lower' => null, 'upper' => null],
            ['key' => 1, 'value' => '〜5名', 'lower' => null, 'upper' => 5],
            ['key' => 2, 'value' => '6〜10名', 'lower' => 6, 'upper' => 10],
            ['key' => 3, 'value' => '11〜15名', 'lower' => 11, 'upper' => 15],
            ['key' => 4, 'value' => '15名以上', 'lower' => 15, 'upper' => null],
        ];
        // 顧客単価
        $customer_unit_prices = [
            ['key' => 0, 'value' => 'こだわらない', 'lower' => null, 'upper' => null],
            ['key' => 1, 'value' => '5000円未満', 'lower' => null, 'upper' => 5000],
            ['key' => 2, 'value' => '5000〜7500円未満', 'lower' => 5000, 'upper' => 7500],
            ['key' => 3, 'value' => '7500〜10000円未満', 'lower' => 7500, 'upper' => 10000],
            ['key' => 4, 'value' => '10000円〜', 'lower' => 10000, 'upper' => null],
        ];
        // セット面
        $seat_nums = [
            ['key' => 0, 'value' => 'こだわらない', 'lower' => null, 'upper' => null],
            ['key' => 1, 'value' => '〜5面', 'lower' => null, 'upper' => 5],
            ['key' => 2, 'value' => '6〜10面', 'lower' => 6, 'upper' => 10],
            ['key' => 3, 'value' => '11〜15面', 'lower' => 11, 'upper' => 15],
            ['key' => 4, 'value' => '15面以上', 'lower' => 15, 'upper' => null],
        ];
        // シャンプー台
        $shampoostands = [
            ['key' => 1, 'value' => 'サイド'],
            ['key' => 2, 'value' => 'バック'],
            ['key' => 3, 'value' => 'フルフラット'],
        ];
        // 客層
        $clienteles = [
            ['key' => 1, 'value' => '20代中心'],
            ['key' => 2, 'value' => '30代中心'],
            ['key' => 3, 'value' => '40代以降中心'],
            ['key' => 9, 'value' => 'ALL年代'],
        ];
        
        return self::responseSuccess([
            'prefectures' => $prefectures,
            'job_categories' => $job_categories,
            'positions' => $positions,
            'employments' => $employments,
            'salaris' => $salaris,
            'holidays' => $holidays,
            'commitment_terms' => $commitment_terms,
            'salon_nums' => $salon_nums,
            'accesses' => $accesses,
            'staff_nums' => $staff_nums,
            'customer_unit_prices' => $customer_unit_prices,
            'seat_nums' => $seat_nums,
            'shampoostands' => $shampoostands,
            'clienteles' => $clienteles,
        ]);
    }

    /**
     * パラメータを正規化
     */
    public function canonicalizeParam(Request $request)
    {
        $canonical_params = (object)[];
        $convert = [];
        $romans = [];
        if ($request->roman1) $romans[] = $request->roman1;
        if ($request->roman2) $romans[] = $request->roman2;
        if ($request->roman3) $romans[] = $request->roman3;
        if ($request->roman4) $romans[] = $request->roman4;
        $prefecture = null;
        foreach ($romans as $roman) {
            // 政令指定都市（必ず末尾はshi）
            if (str_ends_with($roman, 'shi')) {
                $query = GovernmentCity::where('permalink', $roman);
                if ($prefecture) {
                    $query = $query->where('prefecture_id', $prefecture->id);
                }
                $government_city = $query->first();
                if ($government_city) {
                    $canonical_params->governmentcities = [$government_city->id];
                    $convert[] = [
                        'type' => 'government_city',
                        'id' => $government_city->id,
                        'name' => $government_city->name,
                        'name_roma' => $government_city->permalink,
                    ];
                    continue;
                }
            }
            // 市区町村（必ず末尾はshi、ku、cho、machi、mura、son）
            if (str_ends_with($roman, 'shi')
                || str_ends_with($roman, 'ku')
                || str_ends_with($roman, 'cho')
                || str_ends_with($roman, 'machi')
                || str_ends_with($roman, 'mura')
                || str_ends_with($roman, 'son')) {
                $query = City::where('permalink', $roman);
                if ($prefecture) {
                    $query = $query->where('prefecture_id', $prefecture->id);
                }
                $city = $query->first();
                if ($city) {
                    $canonical_params->cities = [$city->id];
                    $convert[] = [
                        'type' => 'city',
                        'id' => $city->id,
                        'name' => $city->name,
                        'name_roma' => $city->permalink,
                    ];
                    continue;
                }
            }
            // 駅（必ず末尾はeki）
            if (str_ends_with($roman, 'eki')) {
                $query = Station::where('permalink', $roman)
                    ->where('status', 0);
                if ($prefecture) {
                    $query = $query->where('prefecture_id', $prefecture->id);
                }
                $station = $query->first();
                if ($station) {
                    $canonical_params->stations = [$station->station_group_id];
                    $canonical_params->cities = []; // 駅の場合、市区町村もURLに含まれているため、条件削除
                    $convert[] = [
                        'type' => 'station',
                        'id' => $station->station_group_id,
                        'name' => $station->name,
                        'name_roma' => $station->permalink,
                    ];
                    continue;
                }
            }
            // 都道府県
            $prefecture = Prefecture::where('permalink', $roman)->first();
            if ($prefecture) {
                $canonical_params->prefecture = $prefecture->id;
                $convert[] = [
                    'type' => 'prefecture',
                    'id' => $prefecture->id,
                    'name' => $prefecture->name,
                    'name_roma' => $prefecture->permalink,
                ];
                continue;
            }
            // 路線
            $line = Line::where('permalink', $roman)->where('status', 0)->first();
            if ($line) {
                $canonical_params->lines = $line->id;
                $convert[] = [
                    'type' => 'line',
                    'id' => $line->id,
                    'name' => $line->name,
                    'name_roma' => $line->permalink,
                ];
                continue;
            }
            // 職種
            $job_category = JobCategory::where('permalink', $roman)->where('status', 1)->first();
            if ($job_category) {
                $canonical_params->jobcategory = [$job_category->id];
                $convert[] = [
                    'type' => 'job_category',
                    'id' => $job_category->id,
                    'name' => $job_category->name,
                    'name_roma' => $job_category->permalink,
                ];
                continue;
            }
            // 役職/役割
            $position = Position::where('permalink', $roman)->where('status', 1)->first();
            if ($position) {
                $canonical_params->positions = [$position->id];
                $convert[] = [
                    'type' => 'position',
                    'id' => $position->id,
                    'name' => $position->name,
                    'name_roma' => $position->permalink,
                ];
                continue;
            }
            // 雇用形態
            $employment = Employment::where('permalink', $roman)->where('status', 1)->first();
            if ($employment) {
                $canonical_params->employments = [$employment->id];
                $convert[] = [
                    'type' => 'employment',
                    'id' => $employment->id,
                    'name' => $employment->name,
                    'name_roma' => $employment->permalink,
                ];
                continue;
            }
            // 給与
            if (str_starts_with($roman, 'gekkyu')) {
                $amount = str_replace('gekkyu', '', $roman);
                $canonical_params->salarytype = 1;
                $canonical_params->salary = intval($amount) * 10000;
                $convert[] = [
                    'type' => 'salarytype',
                    'id' => 1,
                ];
                $convert[] = [
                    'type' => 'salary',
                    'id' => intval($amount) * 10000,
                    'name' => '月給' . $amount . '万円以上',
                    'name_roma' => 'gekkyu' . $amount,
                ];
                continue;
            } else if (str_starts_with($roman, 'zikyu')) {
                $amount = str_replace('zikyu', '', $roman);
                $canonical_params->salarytype = 2;
                $canonical_params->salary = intval($amount);
                $convert[] = [
                    'type' => 'salarytype',
                    'id' => 2,
                ];
                $convert[] = [
                    'type' => 'salary',
                    'id' => intval($amount),
                    'name' => '時給' . $amount . '円以上',
                    'name_roma' => 'zikyu' . $amount,
                ];
                continue;
            } else if (str_starts_with($roman, 'nikyu')) {
                $amount = str_replace('nikyu', '', $roman);
                $canonical_params->salarytype = 4;
                $canonical_params->salary = intval($amount) * 1000;
                $convert[] = [
                    'type' => 'salarytype',
                    'id' => 4,
                ];
                $convert[] = [
                    'type' => 'salary',
                    'id' => intval($amount) * 1000,
                    'name' => '日給' . (intval($amount) * 1000) . '円以上',
                    'name_roma' => 'nikyu' . $amount,
                ];
                continue;
            } else if (str_starts_with($roman, 'buai')) {
                $amount = str_replace('buai', '', $roman);
                $canonical_params->salarytype = 4;
                $canonical_params->salary = intval($amount);
                $convert[] = [
                    'type' => 'salarytype',
                    'id' => 4,
                ];
                $convert[] = [
                    'type' => 'salary',
                    'id' => intval($amount),
                    'name' => '歩合' . $amount . '%〜',
                    'name_roma' => 'buai' . $amount,
                ];
                continue;
            }
            // 休日
            $holiday = Holiday::where('permalink', $roman)->where('status', 1)->first();
            if ($holiday) {
                $canonical_params->holiday = $holiday->id;
                $convert[] = [
                    'type' => 'holiday',
                    'id' => $holiday->id,
                    'name' => $holiday->name,
                    'name_roma' => $holiday->permalink,
                ];
                continue;
            }
            // こだわり条件
            $commitment_term = CommitmentTerm::where('permalink', $roman)->where('status', 1)->first();
            if ($commitment_term) {
                $canonical_params->commitmentterm = [$commitment_term->id];
                $convert[] = [
                    'type' => 'commitment_term',
                    'id' => $commitment_term->id,
                    'name' => $commitment_term->name,
                    'name_roma' => $commitment_term->permalink,
                ];
                continue;
            }
            return self::responseBadRequest();
        }

        // クエリパラメータからもパラメータに変換する
        if (!isset($canonical_params->prefecture)) {
            $canonical_params->prefecture = $request->pref ? intval($request->pref) : '';
        }
        if (!isset($canonical_params->governmentcities)) {
            $canonical_params->governmentcities = $request->gcity ? array_map('intval', explode(',', $request->gcity)) : [];
        }
        if (!isset($canonical_params->cities)) {
            $canonical_params->cities = $request->city ? array_map('intval', explode(',', $request->city)) : [];
        }
        if (!isset($canonical_params->lines)) {
            $canonical_params->lines = $request->line ? array_map('intval', explode(',', $request->line)) : [];
        }
        if (!isset($canonical_params->stations)) {
            $canonical_params->stations = $request->station ? array_map('intval', explode(',', $request->station)) : [];
        }
        if (!isset($canonical_params->jobcategory)) {
            $canonical_params->jobcategory = $request->job ? array_map('intval', explode(',', $request->job)) : [];
        }
        if (!isset($canonical_params->position)) {
            $canonical_params->position = $request->pos ? array_map('intval', explode(',', $request->pos)) : [];
        }
        if (!isset($canonical_params->employment)) {
            $canonical_params->employment = $request->emp ? array_map('intval', explode(',', $request->emp)) : [];
        }
        $canonical_params->keyword = $request->keyword ? $request->keyword : '';
        if (!isset($canonical_params->salarytype)) {
            $canonical_params->salarytype = $request->salarytype ? $request->salarytype : '';
        }
        if (!isset($canonical_params->salary)) {
            $canonical_params->salary = $request->salary ? $request->salary : '';
        }
        if (!isset($canonical_params->holiday)) {
            $canonical_params->holiday = $request->holiday ? $request->holiday : '';
        }
        if (!isset($canonical_params->commitmentterm)) {
            $canonical_params->commitmentterm = $request->cmt ? array_map('intval', explode(',', $request->cmt)) : [];
        }
        $canonical_params->storenum = $request->store ? $request->store : '';
        $canonical_params->access = $request->access ? $request->access : '';
        $canonical_params->staffnum = $request->staff ? $request->staff : '';
        $canonical_params->customerunitprice = $request->price ? $request->price : '';
        $canonical_params->seatnum = $request->seat ? $request->seat : '';
        $canonical_params->shampoostand = $request->shampoo ? $request->shampoo : '';
        $canonical_params->clientele = $request->clientele ? $request->clientele : '';
        $canonical_params->recommend = $request->recommend ? $request->recommend : '';
        $canonical_params->page = $request->page ? intval($request->page) : 1;
        
        // 選択中の政令指定都市、市区町村、路線、駅を取得して、canonical_paramsに設定する
        $canonical_params->selectgovernmentcities = [];
        $canonical_params->selectcities = [];
        $canonical_params->selectlines = [];
        $canonical_params->selectstations = [];
        if ($canonical_params->governmentcities) {
            $government_cities = GovernmentCity::whereIn('id', $canonical_params->governmentcities)
                ->select('id', 'name', 'permalink as name_roma')
                ->get();  
            $canonical_params->selectgovernmentcities = $government_cities;
        }
        if ($canonical_params->cities) {
            $cities = City::leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
                ->whereIn('cities.id', $canonical_params->cities)
                ->select(
                    'cities.id',
                    'cities.name',
                    'cities.permalink as name_roma',
                    'government_cities.id as government_city_id',
                    'government_cities.name as government_city_name',
                    'government_cities.permalink as government_city_name_roma',
                )
                ->get();  
            $canonical_params->selectcities = $cities;
        }
        if ($canonical_params->lines) {
            $lines = Line::whereIn('id', $canonical_params->lines)
                ->where('status', 0)
                ->orderBy('sort')
                ->select('id', 'name', 'permalink as name_roma', 'sort')
                ->get();  
            $canonical_params->selectlines = $lines;
        }
        if ($canonical_params->stations) {
            $stations = Station::join('cities', 'stations.city_id', '=', 'cities.id')
                ->join('lines', 'stations.line_id', '=', 'lines.id')
                ->whereIn('stations.id', $canonical_params->cities)
                ->where('stations.status', 0)
                ->where('lines.status', 0)
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
            $canonical_params->selectstations = $stations;
        }

        // 市区町村、駅、職種、役職/役割、雇用形態ごとの求人件数を取得
        $conditions = (object)[];
        $conditions->cities = self::getCitiesWithJobCount($canonical_params);
        $conditions->stations = self::getStationsWithJobCount($canonical_params);
        $conditions->job_categories = self::getJobCategoriesWithJobCount($canonical_params);
        $conditions->positions = self::getPositionsWithJobCount($canonical_params);
        $conditions->employments = self::getEmploymentsWithJobCount($canonical_params);

        return self::responseSuccess(['params' => $canonical_params, 'conver' => $convert, 'conditions' => $conditions]);
    }

    /**
     * 市区町村データ取得（求人件数付き）
     */
    private function getCitiesWithJobCount($params)
    {
        // 都道府県が選択されていない場合、取得しない
        if (!$params->prefecture) return [];

        // 市区町村を取得
        $cities = City::leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->where('cities.prefecture_id', $params->prefecture)
            ->select(
                'cities.id',
                'cities.name',
                'cities.permalink as name_roma',
                'government_cities.id as government_city_id',
                'government_cities.name as government_city_name',
                'government_cities.permalink as government_city_name_roma',
            )
            ->get();
        
        // 条件に合う求人件数を取得
        $job_count = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.status', 10)
            ->where('offices.prefecture_id', $params->prefecture)
            ->groupBy('offices.city_id')
            ->select(
                'offices.city_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            )
            ->get()
            ->toArray();
        
        // 取得したデータをマージ
        foreach ($cities as $city) {
            $index = array_search($city->id, array_column($job_count, 'city_id'));
            $city['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return $cities;
    }

    /**
     * 駅データ取得（求人件数付き）
     */
    private function getStationsWithJobCount($params)
    {
        // 都道府県が選択されていない場合、取得しない
        if (!$params->prefecture) return [];

        // 駅を取得
        $stations = Station::join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('lines', 'stations.line_id', '=', 'lines.id')
            ->where('stations.prefecture_id', $params->prefecture)
            ->where('stations.status', 0)
            ->where('lines.status', 0)
            ->orderBy('lines.sort')
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
        $job_count = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->where('jobs.status', 10)
            ->where('stations.prefecture_id', $params->prefecture)
            ->groupBy('office_accesses.station_id')
            ->select(
                'office_accesses.station_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            )
            ->get()
            ->toArray();

        // 取得したデータをマージ
        foreach ($stations as $station) {
            $index = array_search($station->id, array_column($job_count, 'station_id'));
            $station['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return $stations;
    }

    /**
     * 職種データ取得（求人件数付き）
     */
    private function getJobCategoriesWithJobCount($params)
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
        $job_count_query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('jobs.job_category_id')
            ->select(
                'jobs.job_category_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($params->prefecture) {
            if (count($params->governmentcities) == 1 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 政令指定都市
                $job_count_query = $job_count_query->join('cities', 'offices.city_id', '=', 'cities.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('cities.government_city_id', $params->governmentcities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 1
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 市区町村
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('offices.city_id', $params->cities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 1 && count($params->stations) == 0) {
                // 路線
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('office_accesses.line_id', $params->lines);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 1) {
                // 駅
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('stations.station_group_id', $params->stations);
            } else {
                // 都道府県
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture);
            }
        }
        $job_count = $job_count_query->get()->toArray();

        // 取得したデータをマージ
        foreach ($job_categories as $job_category) {
            $index = array_search($job_category->id, array_column($job_count, 'job_category_id'));
            $job_category['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return $job_categories;
    }

    /**
     * 役職/役割データ取得（求人件数付き）
     */
    private function getPositionsWithJobCount($params)
    {
        // 役職/役割を全件取得
        $positions = Position::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();

        // 条件に合う求人件数を取得
        $job_count_query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('jobs.position_id')
            ->select(
                'jobs.position_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($params->prefecture) {
            if (count($params->governmentcities) == 1 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 政令指定都市
                $job_count_query = $job_count_query->join('cities', 'offices.city_id', '=', 'cities.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('cities.government_city_id', $params->governmentcities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 1
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 市区町村
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('offices.city_id', $params->cities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 1 && count($params->stations) == 0) {
                // 路線
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('office_accesses.line_id', $params->lines);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 1) {
                // 駅
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('stations.station_group_id', $params->stations);
            } else {
                // 都道府県
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture);
            }
        }
        $job_count = $job_count_query->get()->toArray();

        // 取得したデータをマージ
        foreach ($positions as $position) {
            $index = array_search($position->id, array_column($job_count, 'position_id'));
            $position['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return $positions;
    }

    /**
     * 雇用形態データ取得（求人件数付き）
     */
    private function getEmploymentsWithJobCount($params)
    {
        // 雇用形態を全件取得
        $employments = Employment::where('status', 1)
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
            )
            ->get();

        // 条件に合う求人件数を取得
        $job_count_query = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('jobs.employment_id')
            ->select(
                'jobs.employment_id',
                DB::raw('COUNT(distinct jobs.id) as job_count'),
            );
        if ($params->prefecture) {
            if (count($params->governmentcities) == 1 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 政令指定都市
                $job_count_query = $job_count_query->join('cities', 'offices.city_id', '=', 'cities.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('cities.government_city_id', $params->governmentcities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 1
                && count($params->lines) == 0 && count($params->stations) == 0) {
                // 市区町村
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('offices.city_id', $params->cities);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 1 && count($params->stations) == 0) {
                // 路線
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('office_accesses.line_id', $params->lines);
            } else if (count($params->governmentcities) == 0 && count($params->cities) == 0
                && count($params->lines) == 0 && count($params->stations) == 1) {
                // 駅
                $job_count_query = $job_count_query->join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                    ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                    ->where('offices.prefecture_id', $params->prefecture)
                    ->whereIn('stations.station_group_id', $params->stations);
            } else {
                // 都道府県
                $job_count_query = $job_count_query->where('offices.prefecture_id', $params->prefecture);
            }
        }
        $job_count = $job_count_query->get()->toArray();

        // 取得したデータをマージ
        foreach ($employments as $employment) {
            $index = array_search($employment->id, array_column($job_count, 'employment_id'));
            $employment['job_count'] = $index !== false ? $job_count[$index]['job_count'] : 0;
        }

        return $employments;
    }
}