<?php

namespace App\Http\Controllers;

use App\Models\Office;
use App\Models\OfficeAccess;
use App\Models\OfficeClientele;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class OfficeController extends Controller
{
    /**
     * 事業所データ一覧取得
     */
    public function index()
    {
        $offices = DB::table('offices')
            ->join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
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
            )
            ->get();
        foreach ($offices as $o) {
            $o->passive_smoking_name = Office::PASSIVE_SMOKING[$o->passive_smoking];
        }
        return response()->json(['offices' => $offices]);
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
                'office_images.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'office_images.*.alttext' => '',
                'office_images.*.sort' => 'number',
                'office_features' => 'nullable|array',
                'office_features.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'office_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data) {
                // 事業所登録
                $office = Office::create($data);
                // 事業所アクセス登録
                if (isset($data['office_accesses']) && is_array($data['office_accesses'])) {
                    $office->officeAccesses->createMany($data['office_accesses']);
                }

                // 事業所客層登録
                if (isset($data['office_clienteles']) && is_array($data['office_clienteles'])) {
                    $office->officeClienteles->createMany($data['office_clienteles']);
                }

                // 求人一括設定画像登録
                // TODO

                // 事業所特徴登録
                // TODO
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
                'office_images.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'office_images.*.alttext' => '',
                'office_images.*.sort' => 'number',
                'office_features' => 'nullable|array',
                'office_features.*.id' => '',
                'office_features.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'office_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data, $id) {
                $office = Office::findOrFail($id);
                $office->update($data);

                // 事業所アクセス
                if (isset($data['office_accesses']) && is_array($data['office_accesses'])) {
                    // 入力があったID以外は削除
                    $ids = array_column($data['office_accesses'], 'id');
                    if (count($ids) > 0) {
                        OfficeAccess::where('office_id', $id)
                            ->whereNotIn('id', $ids)
                            ->delete();
                    } else {
                        $office->officeAccesses()->delete();
                    }
                    
                    // 入力があったデータは登録or更新
                    foreach ($data['office_accesses'] as $office_access) {
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

                // 事業所客層
                if (isset($data['office_clienteles']) && is_array($data['office_clienteles'])) {
                    \Log::debug($data['office_clienteles']);
                    // 入力があったID以外は削除
                    $ids = array_column($data['office_clienteles'], 'id');
                    if (count($ids) > 0) {
                        OfficeClientele::where('office_id', $id)
                            ->whereNotIn('id', $ids)
                            ->delete();
                    } else {
                        $office->officeClienteles()->delete();
                    }

                    foreach ($data['office_clienteles'] as $office_clientele) {
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
                }

                // 求人一括設定画像
                // TODO

                // 法人特徴
                // TODO
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
}
