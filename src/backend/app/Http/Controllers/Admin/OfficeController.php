<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Office;
use App\Models\OfficeAccess;
use App\Models\OfficeClientele;
use App\Models\OfficeImage;
use App\Models\OfficeFeature;
use App\Library\UploadImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class OfficeController extends Controller
{
    /**
     * 事業所データ一覧取得
     */
    public function index(Request $request)
    {
        $query = Office::join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->whereNull('corporations.deleted_at');

        // 検索条件指定
        if ($request->corporation_name) {
            $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
        }
        if ($request->office_name) {
            $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query
            ->leftJoin('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->groupBy('offices.id')
            ->select(
                'offices.id',
                'offices.name',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'offices.prefecture_id',
                'prefectures.name as prefecture_name',
                'offices.city_id',
                'cities.name as city_name',
                'offices.address',
                'offices.tel',
                'offices.fax',
                'offices.open_date',
                'offices.business_time',
                'offices.regular_holiday',
                'offices.floor_space',
                'offices.seat_num',
                'offices.shampoo_stand',
                'offices.staff',
                'offices.new_customer_ratio',
                'offices.cut_unit_price',
                'offices.customer_unit_price',
                'offices.passive_smoking',
                'offices.external_url',
                'offices.sns_url',
                DB::raw('count(distinct jobs.id) as job_count'),
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $offices = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        foreach ($offices as $o) {
            $o->passive_smoking_name = Office::PASSIVE_SMOKING[$o->passive_smoking];
        }
        return response()->json(['offices' => $offices, 'offices_count' => $count]);
    }

    /**
     * 事業所データCSVダウンロード
     */
    public function downloadCsv(Request $request)
    {
        // CSVファイル作成コールバック
        $callback = function () use ($request) {
            // CSVファイル作成
            $csv = fopen('php://output', 'w');

            // CSVヘッダ
            $columns = [
                'id' => '事業所ID',
                'name' => '事業所名',
                'corporation_id' => '法人ID',
                'corporation_name' => '法人名',
                'postcode' => '郵便番号',
                'prefecture' => '都道府県',
                'city' => '市区町村',
                'address' => '住所',
                'tel' => '電話番号',
                'fax' => 'FAX番号',
                'open_date' => '開店・リニューアル日',
                'business_time' => '営業時間',
                'regular_holiday' => '定休日',
                'floor_space' => '坪数 (坪)',
                'seat_num' => 'セット面 (面)',
                'shampoo_stand' => 'シャンプー台',
                'staff' => 'スタッフ (人)',
                'new_customer_ratio' => '新規客割合 (％)',
                'cut_unit_price' => '標準カット単価 (円)',
                'customer_unit_price' => '顧客単価 (円)',
                'clientele' => '客層',
                'passive_smoking' => '受動喫煙対策',
                'external_url' => 'サロンURL',
                'sns_url' => 'SNSリンク',
                'access' => '事業所アクセス',
                'plan' => '掲載プラン',
                'start_date' => '掲載開始日',
                'end_plan_date' => '掲載終了日',
                'end_date' => '掲載停止日',
                'job_count' => '全求人数',
                'publish_job_count' => '掲載中求人数',
            ];
            // SJIS変換
            if ($request->char_code == 'ShiftJIS') {
                mb_convert_variables('SJIS-win', 'UTF-8', $columns);
            }
            // ヘッダを追加
            fputcsv($csv, $columns);

            // CSVデータ
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
            $query = Office::join('corporations', 'offices.corporation_id', '=', 'corporations.id')
                ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
                ->join('cities', 'offices.city_id', '=', 'cities.id')
                ->whereNull('corporations.deleted_at');

            // 検索条件指定
            if ($request->corporation_name) {
                $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
            }
            if ($request->office_name) {
                $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
            }
            // 選択チェック指定
            if ($request->office_ids) {
                $office_ids = is_array($request->office_ids) ? $request->office_ids : explode(',', $request->office_ids);
                $query = $query->whereIn('offices.id', $office_ids);
            }
            // データ取得
            $offices = $query->leftJoin(DB::raw("({$contract_subquery->toSql()}) as latest_contracts"), 'corporations.id', '=', 'latest_contracts.corporation_id')
                ->leftJoin('jobs', function ($join) {
                    $join->on('offices.id', '=', 'jobs.office_id')
                        ->whereNull('jobs.deleted_at');
                })
                ->groupBy('offices.id')
                ->groupBy('latest_contracts.id')
                ->select(
                    'offices.id',
                    'offices.name',
                    'offices.corporation_id',
                    'corporations.name as corporation_name',
                    'prefectures.name as prefecture_name',
                    'cities.name as city_name',
                    'offices.address',
                    'offices.tel',
                    'offices.fax',
                    'offices.open_date',
                    'offices.business_time',
                    'offices.regular_holiday',
                    'offices.floor_space',
                    'offices.seat_num',
                    'offices.shampoo_stand',
                    'offices.staff',
                    'offices.new_customer_ratio',
                    'offices.cut_unit_price',
                    'offices.customer_unit_price',
                    'offices.passive_smoking',
                    'offices.external_url',
                    'offices.sns_url',
                    'latest_contracts.plan_name',
                    'latest_contracts.start_date',
                    'latest_contracts.end_plan_date',
                    'latest_contracts.end_date',
                    DB::raw('count(distinct jobs.id) as job_count'),
                    DB::raw('count(distinct case when jobs.status = 10 then jobs.id else null end) as publish_job_count'),
                )
                ->orderBy('offices.id', 'desc')
                ->get();

            // 関連情報を取得
            $office_ids = array_column($offices->toArray(), 'id');
            // 客層
            $office_clienteles = OfficeClientele::whereIn('office_clienteles.office_id', $office_ids)
                ->select(
                    'office_clienteles.office_id',
                    'office_clienteles.clientele',
                    'office_clienteles.othertext',
                )
                ->get();
            // アクセス
            $office_accesses = OfficeAccess::join('lines', 'office_accesses.line_id', '=', 'lines.id')
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
                ->get();

            foreach ($offices as $o) {
                // 客層の整形
                $clientele_list = [];
                foreach ($office_clienteles as $clientele) {
                    if ($clientele->office_id != $o->id) {
                        continue;
                    }
                    $clientele_list[] = $clientele->clientele == 99 ? $clientele->othertext : OfficeClientele::CLIENTELE[$clientele->clientele];
                }

                // アクセスの整形
                $access_list = [];
                foreach ($office_accesses as $access) {
                    if ($access->office_id != $o->id) {
                        continue;
                    }
                    $access_list[] = $access->line_name . ' ' . $access->station_name . ' ' . OfficeAccess::MOVE_TYPE[$access->move_type] . ' ' . $access->time . ' ' . $access->note;
                }

                $office_data = [
                    'id' => $o->id,
                    'name' => $o->name,
                    'corporation_id' => $o->corporation_id,
                    'corporation_name' => $o->corporation_name,
                    'prefecture' => $o->prefecture_name,
                    'city' => $o->city_name,
                    'address' => $o->address,
                    'tel' => $o->tel,
                    'fax' => $o->fax,
                    'open_date' => $o->open_date,
                    'business_time' => $o->business_time,
                    'regular_holiday' => $o->regular_holiday,
                    'floor_space' => $o->floor_space,
                    'seat_num' => $o->seat_num,
                    'shampoo_stand' => $o->shampoo_stand,
                    'staff' => $o->staff,
                    'new_customer_ratio' => $o->new_customer_ratio,
                    'cut_unit_price' => $o->cut_unit_price,
                    'customer_unit_price' => $o->customer_unit_price,
                    'clientele' => implode('|', $clientele_list),
                    'passive_smoking' => Office::PASSIVE_SMOKING[$o->passive_smoking],
                    'external_url' => $o->external_url,
                    'sns_url' => $o->sns_url,
                    'access' => implode('|', $access_list),
                    'plan' => $o->plan_name,
                    'start_date' => $o->start_date ? date('Y/m/d', strtotime($o->start_date)) : '',
                    'end_plan_date' => $o->end_plan_date ? date('Y/m/d', strtotime($o->end_plan_date)) : '',
                    'end_date' => $o->end_date ? date('Y/m/d', strtotime($o->end_date)) : '',
                    'job_count' => $o->job_count,
                    'publish_job_count' => $o->publish_job_count,
                ];
                // SJIS変換
                if ($request->char_code == 'ShiftJIS') {
                    mb_convert_variables('SJIS-win', 'UTF-8', $office_data);
                }
                // CSVファイルのデータを追加
                fputcsv($csv, $office_data);
            }

            // CSV閉じる
            fclose($csv);
        };

        // ファイル名
        $filename = 'offices-' . date('Y-m-d') . '.csv';

        // レスポンスヘッダー情報
        $response_header = [
            'Content-type' => 'text/csv',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ];

        return response()->streamDownload($callback, $filename, $response_header);
    }

    /**
     * 事業所データ取得
     */
    public function show($id)
    {
        try {
            $office = Office::find($id);
            if (!$office) {
                throw new ModelNotFoundException();
            }

            $office['corporation_name'] = $office->corporation->name;
            $office['prefecture_name'] = $office->prefecture->name;
            $office['city_name'] = $office->city->name;
            $office['passive_smoking_name'] = Office::PASSIVE_SMOKING[$office->passive_smoking];

            // 事業所アクセス
            $office_accesses = DB::table('office_accesses')
                ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
                ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
                ->where('office_accesses.office_id', $id)
                ->where('lines.status', 0)
                ->where('stations.status', 0)
                ->select(
                    'office_accesses.id',
                    'office_accesses.line_id',
                    'lines.name as line_name',
                    'office_accesses.station_id',
                    'stations.name as station_name',
                    'office_accesses.move_type',
                    'office_accesses.time',
                    'office_accesses.note',
                )
                ->get();
            foreach ($office_accesses as $office_access) {
                $office_access->move_type_name = OfficeAccess::MOVE_TYPE[$office_access->move_type];
            }
            $office['office_accesses'] = $office_accesses;
            
            // 事業所客層
            $office['office_clienteles'] = $office->officeClienteles;
            foreach ($office['office_clienteles'] as $office_clientele) {
                $office_clientele['clientele_name'] = OfficeClientele::CLIENTELE[$office_clientele->clientele];
            }

            // 求人一括設定画像
            $office['office_images'] = $office->officeImages;
            foreach ($office['office_images'] as $office_image) {
                $office_image['image'] = config('uploadimage.office_image_path') . $office->id . '/' . $office_image->image;
            }

            // 事業所特徴
            $office['office_features'] = $office->officeFeatures;
            foreach ($office['office_features'] as $office_feature) {
                $office_feature['image'] = config('uploadimage.office_feature_path') . $office->id . '/' . $office_feature->image;
            }

            // 求人
            $office['jobs'] = $office->jobs;
            foreach ($office['jobs'] as $job) {
                $job['job_category_name'] = $job->jobCategory->name;
                $job['position_name'] = $job->position->name;
                $job['employment_name'] = $job->employment->name;
            }

            return response()->json(['office' => $office]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Office not found'], 404);
        }
    }
    
    /**
     * 事業所データ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'corporation_id' => 'numeric|exists:corporations,id',
                'postcode' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'address' => 'required|string',
                'tel' => '',
                'fax' => '',
                'open_date' => '',
                'business_time' => '',
                'regular_holiday' => '',
                'floor_space' => 'nullable|numeric',
                'seat_num' => 'nullable|numeric',
                'shampoo_stand' => '',
                'staff' => 'nullable|numeric',
                'new_customer_ratio' => 'nullable|numeric',
                'cut_unit_price' => 'nullable|numeric',
                'customer_unit_price' => 'nullable|numeric',
                'passive_smoking' => 'numeric|regex:/^[1-4]{1}$/',
                'external_url' => '',
                'sns_url' => '',
                'office_accesses' => 'nullable|array',
                'office_accesses.*.line_id' => 'numeric|exists:lines,id',
                'office_accesses.*.station_id' => 'numeric|exists:stations,id',
                'office_accesses.*.move_type' => 'numeric|regex:/^[1-3]{1}$/',
                'office_accesses.*.time' => 'numeric',
                'office_accesses.*.note' => '',
                'office_clienteles' => 'nullable|array',
                'office_clienteles.*.clientele' => 'numeric',
                'office_clienteles.*.othertext' => '',
                'office_images' => 'nullable|array',
                'office_images.*.image' => 'required',
                'office_images.*.alttext' => '',
                'office_images.*.sort' => 'numeric',
                'office_features' => 'nullable|array',
                'office_features.*.image' => 'required',
                'office_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data) {
                // 事業所登録
                $office = Office::create($data);
                // 事業所アクセス登録
                if (isset($data['office_accesses']) && is_array($data['office_accesses'])) {
                    $office->officeAccesses()->createMany($data['office_accesses']);
                }

                // 事業所客層登録
                if (isset($data['office_clienteles']) && is_array($data['office_clienteles'])) {
                    $office->officeClienteles()->createMany($data['office_clienteles']);
                }

                // 求人一括設定画像登録
                if (isset($data['office_images']) && is_array($data['office_images'])) {
                    foreach ($data['office_images'] as $office_image) {
                        // ファイルアップロード
                        $office_image['image'] = UploadImage::uploadImageFile(
                            $office_image['image'],
                            config('uploadimage.office_image_storage'),
                            $office->id
                        );
                        // データベースへ登録
                        $office->officeImages()->create($office_image);
                    }
                }

                // 事業所特徴登録
                if (isset($data['office_features']) && is_array($data['office_features'])) {
                    foreach ($data['office_features'] as $office_feature) {
                        // ファイルアップロード
                        $office_feature['image'] = UploadImage::uploadImageFile(
                            $office_feature['image'],
                            config('uploadimage.office_feature_storage'),
                            $office->id
                        );
                        // データベースへ登録
                        $office->officeFeatures()->create($office_feature);
                    }
                }
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 事業所データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'corporation_id' => 'numeric|exists:corporations,id',
                'postcode' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'address' => 'required|string',
                'tel' => '',
                'fax' => '',
                'open_date' => '',
                'business_time' => '',
                'regular_holiday' => '',
                'floor_space' => 'nullable|numeric',
                'seat_num' => 'nullable|numeric',
                'shampoo_stand' => '',
                'staff' => 'nullable|numeric',
                'new_customer_ratio' => 'nullable|numeric',
                'cut_unit_price' => 'nullable|numeric',
                'customer_unit_price' => 'nullable|numeric',
                'passive_smoking' => 'numeric|regex:/^[1-4]{1}$/',
                'external_url' => '',
                'sns_url' => '',
                'office_accesses' => 'nullable|array',
                'office_accesses.*.id' => '',
                'office_accesses.*.line_id' => 'numeric|exists:lines,id',
                'office_accesses.*.station_id' => 'numeric|exists:stations,id',
                'office_accesses.*.move_type' => 'numeric|regex:/^[1-3]{1}$/',
                'office_accesses.*.time' => 'numeric',
                'office_accesses.*.note' => '',
                'office_clienteles' => 'nullable|array',
                'office_clienteles.*.id' => '',
                'office_clienteles.*.clientele' => 'numeric',
                'office_clienteles.*.othertext' => '',
                'office_images' => 'nullable|array',
                'office_images.*.id' => '',
                'office_images.*.image' => 'required',
                'office_images.*.alttext' => '',
                'office_images.*.sort' => 'numeric',
                'office_features' => 'nullable|array',
                'office_features.*.id' => '',
                'office_features.*.image' => 'required',
                'office_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data, $id) {
                $office = Office::findOrFail($id);
                $office->update($data);

                // 事業所アクセス
                self::updateOfficeAccess($office, isset($data['office_accesses']) ? $data['office_accesses'] : null);

                // 事業所客層
                self::updateOfficeClientele($office, isset($data['office_clienteles']) ? $data['office_clienteles'] : null);

                // 求人一括設定画像
                self::updateOfficeImage($office, isset($data['office_images']) ? $data['office_images'] : null);

                // 法人特徴
                self::updateOfficeFeature($office, isset($data['office_features']) ? $data['office_features'] : null);
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 事業所データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $office = Office::find($id);
            if (!$office) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($office) {
                // 事業所削除
                // 関連データは削除しない
                $office->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Office not found'], 404);
        }
    }

    /**
     * 事業所データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 事業所削除
                // 関連データは削除しない
                $deleted_count = Office::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more offices not found'], 404);
        }
    }

    /**
     * 事業所コピー
     */
    public function copyMultiple(Request $request, $id)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            $origin = Office::find($id);
            if (!$origin) {
                return response()->json([
                    'result' => 'ok',
                    'message' => 'コピー元の事業所が存在しません。',
                ]);
            }

            DB::transaction(function () use ($ids, $origin) {
                foreach ($ids as $id) {
                    $office = Office::find($id);
                    
                    // 事業所情報更新
                    $office->update([
                        'new_customer_ratio' => $origin->new_customer_ratio,
                        'cut_unit_price' => $origin->cut_unit_price,
                        'customer_unit_price' => $origin->customer_unit_price,
                        'passive_smoking' => $origin->passive_smoking,
                        'external_url' => $origin->external_url,
                        'sns_url' => $origin->sns_url,
                    ]);

                    // 事業所客層
                    $office->officeClienteles()->delete();
                    $insert_data = [];
                    foreach ($origin->officeClienteles as $office_clientele) {
                        $insert_data[] = [
                            'clientele' => $office_clientele->clientele,
                            'othertext' => $office_clientele->othertext,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $office->officeClienteles()->createMany($insert_data);
                    }

                    // 事業所アクセスは対象外

                    // 事業所画像
                    $office->officeImages()->delete();
                    $insert_data = [];
                    foreach ($origin->officeImages as $office_image) {
                        $insert_data[] = [
                            'image' => $office_image->image,
                            'alttext' => $office_image->alttext,
                            'sort' => $office_image->sort,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $office->officeImages()->createMany($insert_data);
                    }
                    // 画像ファイルをコピー
                    UploadImage::copyImageDir(config('uploadimage.office_image_storage'), $origin->id, $office->id);

                    // 事業所特徴
                    $office->officeFeatures()->delete();
                    $insert_data = [];
                    foreach ($origin->officeFeatures as $office_feature) {
                        $insert_data[] = [
                            'image' => $office_feature->image,
                            'feature' => $office_feature->feature,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $office->officeFeatures()->createMany($insert_data);
                    }
                    // 画像ファイルをコピー
                    UploadImage::copyImageDir(config('uploadimage.office_feature_storage'), $origin->id, $office->id);
                }
            });

            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more offices not found'], 404);
        }
    }

    /**
     * 事業所アクセス更新処理
     */
    private function updateOfficeAccess($office, $office_accesses)
    {
        if (isset($office_accesses) && is_array($office_accesses)) {
            // 入力があったID以外は削除
            $ids = array_column($office_accesses, 'id');
            $ids = array_filter($ids, function ($val) {
                return !(is_null($val) || $val === "");
            });
            if (count($ids) > 0) {
                OfficeAccess::where('office_id', $office->id)
                    ->whereNotIn('id', $ids)
                    ->delete();
            } else {
                $office->officeAccesses()->delete();
            }
            
            // 入力があったデータは登録or更新
            foreach ($office_accesses as $office_access) {
                if (isset($office_access['id']) && !empty($office_access['id'])) {
                    // 登録済みのデータは更新
                    OfficeAccess::where('id', $office_access['id'])
                        ->update([
                            'line_id' => $office_access['line_id'],
                            'station_id' => $office_access['station_id'],
                            'move_type' => $office_access['move_type'],
                            'time' => $office_access['time'],
                            'note' => $office_access['note'],
                        ]);
                } else {
                    // 未登録データは登録
                    $office->officeAccesses()->create($office_access);
                }
            }
        } else {
            // 入力がない場合は削除
            $office->officeAccesses()->delete();
        }
    }

    /**
     * 事業所客層更新処理
     */
    private function updateOfficeClientele($office, $office_clienteles)
    {
        if (isset($office_clienteles) && is_array($office_clienteles)) {
            // 入力があったID以外は削除
            $ids = array_column($office_clienteles, 'id');
            $ids = array_filter($ids, function ($val) {
                return !(is_null($val) || $val === "");
            });
            if (count($ids) > 0) {
                OfficeClientele::where('office_id', $office->id)
                    ->whereNotIn('id', $ids)
                    ->delete();
            } else {
                $office->officeClienteles()->delete();
            }

            foreach ($office_clienteles as $office_clientele) {
                if (isset($office_clientele['id']) && !empty($office_clientele['id'])) {
                    // 登録済みのデータは更新
                    OfficeClientele::where('id', $office_clientele['id'])
                        ->update([
                            'clientele' => $office_clientele['clientele'],
                            'othertext' => $office_clientele['othertext'],
                        ]);
                } else {
                    // 未登録データは登録
                    $office->officeClienteles()->create($office_clientele);
                }
            }
        } else {
            // 入力がない場合は削除
            $office->officeClienteles()->delete();
        }
    }

    /**
     * 事業所の求人一括設定画像更新処理
     */
    private function updateOfficeImage($office, $office_images)
    {
        if (isset($office_images) && is_array($office_images)) {
            // 入力があったID以外は削除
            $ids = array_column($office_images, 'id');
            $ids = array_filter($ids, function ($val) {
                return !(is_null($val) || $val === "");
            });
            $delete_query = OfficeImage::where('office_id', $office->id);
            if (count($ids) > 0) {
                $delete_query = $delete_query->whereNotIn('id', $ids);
            }
            $delete_data = $delete_query->get();
            foreach ($delete_data as $row) {
                UploadImage::deleteImageFile(
                    $row->image,
                    config('uploadimage.office_image_storage'),
                    $office->id
                );
                $row->delete();
            }

            foreach ($office_images as $office_image) {
                if (isset($office_image['id']) && !empty($office_image['id'])) {
                    // 登録済みのデータは更新
                    $registered_data = OfficeImage::find($office_image['id']);
                    if (is_string($office_image['image'])) {
                        // 文字列の場合は画像変更していないため、説明、ソート順が変更されている場合のみ更新
                        if ($registered_data->alttext != $office_image['alttext']
                            || $registered_data->sort != $office_image['sort']) {
                            $registered_data->update([
                                'alttext' => $office_image['alttext'],
                                'sort' => $office_image['sort'],
                            ]);
                        }
                    } else {
                        // ファイル形式の場合は画像変更しているため、更新
                        // ファイルアップロード
                        $office_image['image'] = UploadImage::uploadImageFile(
                            $office_image['image'],
                            config('uploadimage.office_image_storage'),
                            $office->id,
                            $registered_data->image
                        );
                        // データベースに保存
                        $registered_data->update([
                            'image' => $office_image['image'],
                            'alttext' => $office_image['alttext'],
                            'sort' => $office_image['sort'],
                        ]);
                    }
                } else {
                    // 未登録データは登録
                    // ファイルアップロード
                    $office_image['image'] = UploadImage::uploadImageFile(
                        $office_image['image'],
                        config('uploadimage.office_image_storage'),
                        $office->id
                    );
                    // データベースへ登録
                    $office->officeImages()->create($office_image);
                }
            }
        } else {
            // 全くない場合は全削除
            foreach ($office->officeImages as $office_image) {
                UploadImage::deleteImageFile(
                    $office_image->image,
                    config('uploadimage.office_image_storage'),
                    $office->id
                );
            }
            $office->officeImages()->delete();
        }
    }

    /**
     * 事業所特徴更新処理
     */
    private function updateOfficeFeature($office, $office_features)
    {
        if (isset($office_features) && is_array($office_features)) {
            // 入力があったID以外は削除
            $ids = array_column($office_features, 'id');
            $ids = array_filter($ids, function ($val) {
                return !(is_null($val) || $val === "");
            });
            $delete_query = OfficeFeature::where('office_id', $office->id);
            if (count($ids) > 0) {
                $delete_query = $delete_query->whereNotIn('id', $ids);
            }
            $delete_data = $delete_query->get();
            foreach ($delete_data as $row) {
                UploadImage::deleteImageFile(
                    $row->image,
                    config('uploadimage.office_feature_storage'),
                    $office->id
                );
                $row->delete();
            }

            foreach ($office_features as $office_feature) {
                if (isset($office_feature['id']) && !empty($office_feature['id'])) {
                    // 登録済みのデータは更新
                    $registered_data = OfficeFeature::find($office_feature['id']);
                    if (is_string($office_feature['image'])) {
                        // 文字列の場合は画像変更していないため、特徴が変更されている場合のみ更新
                        if ($registered_data->feature != $office_feature['feature']) {
                            $registered_data->update([
                                'feature' => $office_feature['feature'],
                            ]);
                        }
                    } else {
                        // ファイル形式の場合は画像変更しているため、更新
                        // ファイルアップロード
                        $office_feature['image'] = UploadImage::uploadImageFile(
                            $office_feature['image'],
                            config('uploadimage.office_feature_storage'),
                            $office->id,
                            $registered_data->image
                        );
                        // データベースに保存
                        $registered_data->update([
                            'image' => $office_feature['image'],
                            'feature' => $office_feature['feature'],
                        ]);
                    }
                } else {
                    // 未登録データは登録
                    // ファイルアップロード
                    $office_feature['image'] = UploadImage::uploadImageFile(
                        $office_feature['image'],
                        config('uploadimage.office_feature_storage'),
                        $office->id
                    );
                    // データベースへ登録
                    $office->officeFeatures()->create($office_feature);
                }
            }
        } else {
            // 全くない場合は全削除
            foreach ($office->officeFeatures as $office_feature) {
                UploadImage::deleteImageFile(
                    $office_feature->image,
                    config('uploadimage.office_feature_storage'),
                    $office->id
                );
            }
            $office->officeFeatures()->delete();
        }
    }
}
