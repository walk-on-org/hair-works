<?php

namespace App\Http\Controllers;

use App\Models\Corporation;
use App\Models\Contract;
use App\Models\CorporationImage;
use App\Models\CorporationFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CorporationController extends Controller
{
    /**
     * 法人データ一覧取得
     */
    public function index()
    {
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
        $corporations = DB::table('corporations')
            ->join('prefectures', 'corporations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'corporations.city_id', '=', 'cities.id')
            ->leftJoin(DB::raw("({$contract_subquery->toSql()}) as latest_contracts"), 'corporations.id', '=', 'latest_contracts.corporation_id')
            ->leftJoin('offices', 'corporations.id', '=', 'offices.corporation_id')
            ->leftJoin('jobs', 'offices.id', '=', 'jobs.office_id')
            ->groupBy('corporations.id')
            ->groupBy('latest_contracts.id')
            ->select(
                'corporations.id',
                'corporations.name',
                'corporations.name_private',
                'corporations.prefecture_id',
                'prefectures.name as prefecture_name',
                'corporations.city_id',
                'cities.name as city_name',
                'corporations.address',
                'corporations.tel',
                'corporations.fax',
                'corporations.salon_num',
                'corporations.employee_num',
                'corporations.yearly_turnover',
                'corporations.average_age',
                'corporations.drug_maker',
                'corporations.homepage',
                'corporations.higher_display',
                'corporations.owner_image',
                'corporations.owner_message',
                'latest_contracts.plan_id',
                'latest_contracts.plan_name',
                'latest_contracts.start_date',
                'latest_contracts.end_plan_date',
                'latest_contracts.end_date',
                DB::raw('count(distinct offices.id) as office_count'),
                DB::raw('count(distinct jobs.id) as job_count'),
            )
            ->get();
        foreach ($corporations as $c) {
            $c->name_private_name = Corporation::NAME_PRIVATE[$c->name_private];
            $c->higher_display_name = Corporation::HIGHER_DISPLAY[$c->higher_display];
        }
        return response()->json(['corporations' => $corporations]);
    }

    /**
     * 法人データ取得
     */
    public function show($id)
    {
        try {
            $corporation = Corporation::find($id);
            if (!$corporation) {
                throw new ModelNotFoundException();
            }

            $corporation['prefecture_name'] = $corporation->prefecture->name;
            $corporation['city_name'] = $corporation->city->name;
            $corporation['name_private_name'] = Corporation::NAME_PRIVATE[$corporation->name_private];
            $corporation['higher_display_name'] = Corporation::HIGHER_DISPLAY[$corporation->higher_display];
            
            // 契約プラン
            $contracts = DB::table('contracts')
                ->join('plans', 'contracts.plan_id', '=', 'plans.id')
                ->where('contracts.corporation_id', $id)
                ->orderBy('contracts.id', 'asc')
                ->select(
                    'contracts.id',
                    'contracts.plan_id',
                    'plans.name as plan_name',
                    'contracts.start_date',
                    'contracts.end_plan_date',
                    'contracts.end_date',
                    'contracts.expire',
                )
                ->get();
            foreach ($contracts as $c) {
                $c->expire_name = Contract::EXPIRE[$c->expire];
            }
            $corporation['contracts'] = $contracts;

            // 求人一括設定画像
            $corporation['corporation_images'] = $corporation->corporationImages;
            foreach ($corporation['corporation_images'] as $corporation_image) {
                $corporation_image['image'] = config('uploadimage.corporation_image_path') . $corporation->id . '/' . $corporation_image->image;
            }

            // 法人特徴
            $corporation['corporation_features'] = $corporation->corporationFeatures;
            foreach ($corporation['corporation_features'] as $corporation_feature) {
                $corporation_feature['image'] = config('uploadimage.corporation_feature_path') . $corporation->id . '/' . $corporation_feature->image;
            }

            return response()->json(['corporation' => $corporation]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Corporation not found'], 404);
        }
    }

    /**
     * 法人データ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_private' => 'numeric',
                'postcode' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'address' => 'required|string',
                'tel' => '',
                'fax' => '',
                'salon_num' => 'nullable|numeric',
                'employee_num' => 'nullable|numeric',
                'yearly_turnover' => '',
                'average_age' => '',
                'drug_maker' => '',
                'homepage' => '',
                'higher_display' => 'numeric',
                'owner_image' => '',
                'owner_message' => '',
                'contracts' => 'nullable|array',
                'contracts.*.plan_id' => 'numeric|exists:plans,id',
                'contracts.*.start_date' => '',
                'contracts.*.end_plan_date' => '',
                'corporation_images' => 'nullable|array',
                'corporation_images.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'corporation_images.*.alttext' => '',
                'corporation_images.*.sort' => 'number',
                'corporation_features' => 'nullable|array',
                'corporation_features.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'corporation_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data) {
                // 法人登録
                $corporation = Corporation::create($data);
                // 契約登録
                if (isset($data['contracts']) && is_array($data['contracts'])) {
                    $corporation->contracts->createMany($data['contracts']);
                }
                // 求人一括設定画像登録
                // TODO

                // 法人特徴登録
                // TODO
            });
            
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 法人データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_private' => 'numeric',
                'postcode' => 'required|string',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'city_id' => 'numeric|exists:cities,id',
                'address' => 'required|string',
                'tel' => '',
                'fax' => '',
                'salon_num' => 'nullable|numeric',
                'employee_num' => 'nullable|numeric',
                'yearly_turnover' => '',
                'average_age' => '',
                'drug_maker' => '',
                'homepage' => '',
                'higher_display' => 'numeric',
                'owner_image' => '',
                'owner_message' => '',
                'contracts' => 'nullable|array',
                'contracts.*.id' => '',
                'contracts.*.plan_id' => 'numeric|exists:plans,id',
                'contracts.*.start_date' => '',
                'contracts.*.end_plan_date' => '',
                'corporation_images' => 'nullable|array',
                'corporation_images.*.id' => '',
                'corporation_images.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'corporation_images.*.alttext' => '',
                'corporation_images.*.sort' => 'number',
                'corporation_features' => 'nullable|array',
                'corporation_features.*.id' => '',
                'corporation_features.*.image' => 'required|file|mimes:jpeg,jpg,png,webp',
                'corporation_features.*.feature' => 'required|string',
            ]);

            DB::transaction(function () use ($data, $id) {
                $corporation = Corporation::findOrFail($id);
                $corporation->update($data);

                // 契約
                if (isset($data['contracts']) && is_array($data['contracts'])) {
                    foreach ($data['contracts'] as $contract) {
                        if (isset($contract['id']) && !empty($contract['id'])) {
                            // 登録済みのデータは更新
                            Contract::where('id', $contract['id'])
                                ->update([
                                    'plan_id' => $contract['plan_id'],
                                    'start_date' => (isset($contract['start_date']) && !empty($contract['start_date'])) ? $contract['start_date'] : null,
                                    'end_plan_date' => (isset($contract['end_plan_date']) && !empty($contract['end_plan_date'])) ? $contract['end_plan_date'] : null,
                                ]);
                        } else {
                            // 未登録データは登録
                            $corporation->contracts()->create($contract);
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
     * 法人データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $corporation = Coporation::find($id);
            if (!$corporation) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($corporation) {
                // 法人削除
                // 関連データは削除しない
                $corporation->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Corporation not found'], 404);
        }
    }

    /**
     * 法人データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 法人削除
                // 関連データは削除しない
                $deleted_count = Corporation::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more corporations not found'], 404);
        }
    }
}
