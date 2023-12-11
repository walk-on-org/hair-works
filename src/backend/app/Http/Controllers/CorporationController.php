<?php

namespace App\Http\Controllers;

use App\Models\Corporation;
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
        $corporations = DB::table('corporations')
            ->join('prefectures', 'corporations.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'corporations.city_id', '=', 'cities.id')
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
            ]);
            Corporation::create($data);
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
            ]);
            $corporation = Corporation::findOrFail($id);
            $corporation->update($data);
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
            $corporation->delete();
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
            
            // 削除
            $deleted_count = Corporation::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more corporations not found'], 404);
        }
    }
}
