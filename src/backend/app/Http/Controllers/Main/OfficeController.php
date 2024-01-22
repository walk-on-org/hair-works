<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Office;
use App\Models\OfficeAccess;
use App\Models\OfficeImage;
use App\Models\OfficeClientele;
use App\Models\OfficeFeature;
use App\Models\Corporation;
use App\Models\CorporationImage;
use App\Models\CorporationFeature;
use App\Models\JobImage;
use App\Models\CommitmentTerm;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OfficeController extends Controller
{
    /**
     * 事業所情報1件取得
     */
    public function show($id)
    {
        $office = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->where('offices.id', $id)
            ->where('jobs.status', 10)
            ->groupBy('offices.id')
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
                DB::raw('max(jobs.private) as private'),
                DB::raw('max(jobs.recommend) as recommend'),
                'offices.external_url',
                'offices.sns_url',
                DB::raw('max(jobs.recommend_point) as recommend_point'),
                DB::raw('count(jobs.id) as job_count'),
                DB::raw('count(jobs.job_category_id = 2 or null) as job_riyoushi_count'),
            )
            ->first();
        if (!$office) {
            // 事業所が存在しない場合404
            return self::responseNotFound();
        }
        $office->passive_smoking = Office::PASSIVE_SMOKING[$office->passive_smoking];

        // アクセス情報を取得
        $office_accesses = self::getOfficeAccesses($office->id);
        // 事業所画像を取得
        $office_images = [];
        $tmp_office_images = self::getMultipleOfficeImage([$office->id]);
        if (isset($tmp_office_images[$office->id])) {
            $office_images = $tmp_office_images[$office->id];
        }
        // 客層情報を取得
        $office_clienteles = self::getOfficeClienteles($office->id);
        // 特徴情報を取得
        $office_features = self::getOfficeFeatures($office->id, $office->corporation_id);
        // 法人情報を取得
        $corporation = self::getCorporation($office->corporation_id);

        // 関連リンク（人気こだわり条件）取得
        $relation_commitment = self::getRelationConditionLink($office->prefecture_id, $office->city_id);

        return self::responseSuccess([
            'office' => $office,
            'office_accesses' => $office_accesses,
            'office_images' => $office_images,
            'office_clienteles' => $office_clienteles,
            'office_features' => $office_features,
            'corporation' => $corporation,
            'relation_commitment' => $relation_commitment,
        ]);
    }

    /**
     * 事業所プレビュー情報取得
     */
    public function preview($id)
    {
        // TODO 暗号化、復元化

        $office = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->where('offices.id', $id)
            ->groupBy('offices.id')
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
                DB::raw('max(jobs.private) as private'),
                DB::raw('max(jobs.recommend) as recommend'),
                'offices.external_url',
                'offices.sns_url',
                DB::raw('max(jobs.recommend_point) as recommend_point'),
                DB::raw('count(jobs.id) as job_count'),
                DB::raw('count(jobs.job_category_id = 2 or null) as job_riyoushi_count'),
            )
            ->first();
        if (!$office) {
            // 事業所が存在しない場合404
            return self::responseNotFound();
        }
        $office->passive_smoking = Office::PASSIVE_SMOKING[$office->passive_smoking];

        // アクセス情報を取得
        $office_accesses = self::getOfficeAccesses($office->id);
        // 事業所画像を取得
        $office_images = [];
        $tmp_office_images = self::getMultipleOfficeImage([$office->id]);
        if (isset($tmp_office_images[$office->id])) {
            $office_images = $tmp_office_images[$office->id];
        }
        // 客層情報を取得
        $office_clienteles = self::getOfficeClienteles($office->id);
        // 特徴情報を取得
        $office_features = self::getOfficeFeatures($office->id, $office->corporation_id);
        // 法人情報を取得
        $corporation = self::getCorporation($office->corporation_id);

        return self::responseSuccess([
            'office' => $office,
            'office_accesses' => $office_accesses,
            'office_images' => $office_images,
            'office_clienteles' => $office_clienteles,
            'office_features' => $office_features,
            'corporation' => $corporation,
        ]);
    }

    /**
     * 関連リンク取得（事業所詳細）
     */
    public function getRelationlink($id)
    {
        $office = Office::find($id);

        // 同じ市区町村のその他事業所取得
        $relation_city = Office::join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('offices.id', '<>', $office->id)
            ->where('offices.prefecture_id', $office->prefecture_id)
            ->where('offices.city_id', $office->city_id)
            ->where('jobs.status', 10)
            ->where('jobs.private', 0)
            ->groupBy('offices.id')
            ->select(
                'offices.id as office_id',
                'offices.name as office_name',
                DB::raw('max(jobs.recommend) as recommend'),
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
                'corporations.higher_display',
            )
            ->distinct()
            ->orderBy('corporations.higher_display', 'desc')
            ->orderByRaw('RAND()')
            ->limit(10)
            ->get();

        // 同じ駅のその他事業所取得
        $relation_station = [];
        $relation_station_title = '';
        $near_station = OfficeAccess::join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->where('office_accesses.office_id', $office->id)
            ->where('stations.status', 0)
            ->select(
                'stations.station_group_id',
                'stations.name as station_name',
            )
            ->orderBy('office_accesses.time')
            ->first();
        if ($near_station) {
            $relation_station_title = $near_station->station_name;
            $relation_station = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
                ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->join('jobs', function ($join) {
                    $join->on('offices.id', '=', 'jobs.office_id')
                        ->whereNull('jobs.deleted_at');
                })
                ->join('corporations', function ($join) {
                    $join->on('offices.corporation_id', '=', 'corporations.id')
                        ->whereNull('corporations.deleted_at');
                })
                ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
                ->join('cities', 'offices.city_id', '=', 'cities.id')
                ->where('offices.id', '<>', $office->id)
                ->where('stations.station_group_id', $near_station->station_group_id)
                ->where('jobs.status', 10)
                ->where('jobs.private', 0)
                ->groupBy('offices.id')
                ->select(
                    'offices.id as office_id',
                    'offices.name as office_name',
                    DB::raw('max(jobs.recommend) as recommend'),
                    'prefectures.name as prefecture_name',
                    'cities.name as city_name',
                    'corporations.higher_display',
                )
                ->distinct()
                ->orderBy('corporations.higher_display', 'desc')
                ->orderByRaw('RAND()')
                ->limit(10)
                ->get();
        }

        return self::responseSuccess([
            'relation_city' => $relation_city,
            'relation_station_title' => $relation_station_title,
            'relation_station' => $relation_station,
        ]);
    }

    /**
     * 人気の事業所取得
     */
    public function getPickup(Request $request)
    {
        $limit = $request->limit ? intval($request->limit) : 10;

        $pickups = Office::join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('jobs.status', 10)
            ->where('jobs.private', 0)
            ->where('jobs.pickup', 1)
            ->groupBy('offices.id')
            ->select(
                'offices.id as office_id',
                'offices.name as office_name',
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
                'offices.address as address',
                DB::raw('max(jobs.recommend) as recommend'),
            )
            ->orderBy('corporations.higher_display', 'desc')
            ->orderByRaw('RAND()')
            ->limit($limit)
            ->get();

        $office_ids = array_column($pickups->toArray(), 'office_id');

        // 画像を取得
        $office_images = self::getMultipleOfficeImage($office_ids);
        foreach ($pickups as $pickup) {
            if (isset($office_images[$pickup->office_id]) && count($office_images[$pickup->office_id]) > 0) {
                $pickup->image = $office_images[$pickup->office_id][0]->image;
                $pickup->image_updated_at = $office_images[$pickup->office_id][0]->updated_at;
                $pickup->alttext = $office_images[$pickup->office_id][0]->alttext;
            } else {
                $pickup->image = null;
                $pickup->image_updated_at = null;
                $pickup->alttext = null;
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
        foreach ($pickups as $pickup) {
            $index = array_search($pickup->office_id, array_column($office_accesses->toArray(), 'office_id'));
            if ($index !== false) {
                $access = $office_accesses[$index];
                $pickup->access = $access->station_name . '駅' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分';
            } else {
                $pickup->access = null;
            }
        }

        return self::responseSuccess([
            'offices' => $pickups,
        ]);
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
     * 事業所客層を取得
     */
    private function getOfficeClienteles($office_id)
    {
        $office_clienteles = OfficeClientele::where('office_clienteles.office_id', $office_id)
            ->select(
                'office_clienteles.id',
                'office_clienteles.clientele',
                'office_clienteles.othertext',
            )
            ->get();
        foreach ($office_clienteles as $office_clientele) {
            $office_clientele->clientele = OfficeClientele::CLIENTELE[$office_clientele->clientele];
        }
        return $office_clienteles;
    }

    /**
     * 事業所特徴を取得
     */
    private function getOfficeFeatures($office_id, $corporation_id)
    {
        $office_features = OfficeFeature::where('office_features.office_id', $office_id)
            ->select(
                'office_features.office_id',
                'office_features.image',
                'office_features.feature',
                'office_features.updated_at',
            )
            ->get();
        foreach ($office_features as $office_feature) {
            $office_feature->image = [
                'url' => config('uploadimage.office_feature_relative_path') . $office_feature->office_id . '/' . $office_feature->image,
            ];
        }

        if (count($office_features) == 0) {
            $office_features = CorporationFeature::where('corporation_features.corporation_id', $corporation_id)
                ->select(
                    'corporation_features.corporation_id',
                    'corporation_features.image',
                    'corporation_features.feature',
                    'corporation_features.updated_at',
                )
                ->get();
            foreach ($office_features as $office_feature) {
                $office_feature->image = [
                    'url' => config('uploadimage.corporation_feature_relative_path') . $office_feature->corporation_id . '/' . $office_feature->image,
                ];
            }
        }

        return $office_features;
    }

    /**
     * 法人情報を取得
     */
    private function getCorporation($corporation_id)
    {
        $corporation = Corporation::join('prefectures', 'corporations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'corporations.city_id', '=', 'cities.id')
            ->where('corporations.id', $corporation_id)
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
            )
            ->first();
        if ($corporation) {
            $corporation->name_private = $corporation->name_private ? true : false;
        }
        return $corporation;
    }

    /**
     * 複数事業所の画像取得
     */
    private function getMultipleOfficeImage($office_ids)
    {
        $job_images = JobImage::join('jobs', function ($join) {
                $join->on('job_images.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->whereIn('jobs.office_id', $office_ids)
            ->select(
                'jobs.office_id',
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
        $office_images = OfficeImage::whereIn('office_images.office_id', $office_ids)
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
        $corporation_images = CorporationImage::join('corporations', function ($join) {
                $join->on('corporation_images.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('offices', function ($join) {
                $join->on('corporations.id', '=', 'offices.corporation_id')
                    ->whereNull('offices.deleted_at');
            })
            ->whereIn('offices.id', $office_ids)
            ->select(
                'corporation_images.corporation_id',
                'offices.id as office_id',
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
        foreach ($office_ids as $office_id) {
            // 該当の求人画像を抽出
            $tmp_job_image_in_office = [];
            $tmp_job_image = [];
            foreach ($job_images as $job_image) {
                if ($job_image->office_id == $office_id) {
                    $tmp_job_image_in_office[] = $job_image;
                }
            }
            if (count($tmp_job_image_in_office) > 0) {
                foreach ($tmp_job_image_in_office as $job_image) {
                    if ($job_image->job_id == $tmp_job_image_in_office[0]->job_id) {
                        $tmp_job_image[] = $job_image;
                    }
                }
            }

            // 該当の事業所画像を抽出
            $tmp_office_image = [];
            foreach ($office_images as $office_image) {
                if ($office_image->office_id == $office_id) {
                    $tmp_office_image[] = $office_image;
                }
            }

            // 該当の法人画像を抽出
            $tmp_corporation_image = [];
            foreach ($corporation_images as $corporation_image) {
                if ($corporation_image->office_id == $office_id) {
                    $tmp_corporation_image[] = $corporation_image;
                }
            }

            // 上記の中で最後に更新した画像を使用
            $use_image = self::getMaxUpdatedAtImage($tmp_job_image, $tmp_office_image, $tmp_corporation_image);
            if (count($use_image) == 0) {
                continue;
            }
            $result[$office_id] = $use_image;
        }
        return $result;
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
     * その他条件の関連リンクを取得（求人数が多い順に最大3つまで）
     */
    private function getRelationConditionLink($prefecture_id, $city_id)
    {
        $relations = CommitmentTerm::leftJoin('job_commitment_terms', 'commitment_terms.id', '=', 'job_commitment_terms.commitment_term_id')
            ->leftJoin('jobs', function ($join) {
                $join->on('job_commitment_terms.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->groupBy('commitment_terms.id')
            ->select(
                'commitment_terms.id as commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw("count(distinct case when jobs.status = 10 and offices.city_id = {$city_id} then jobs.id else null end) as job_count"),
            )
            ->orderBy('job_count', 'desc')
            ->having('job_count', '>', 0)
            ->limit(3)
            ->get();

        $city = City::find($city_id);
        foreach ($relations as $relation) {
            $relation->prefecture_roman = $city->prefecture->permalink;
            $relation->city_roman = $city->permalink;
        }

        return $relations;
    }
}