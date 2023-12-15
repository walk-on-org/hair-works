<?php

namespace App\Http\Controllers;

use App\Models\HtmlAddContent;
use App\Models\Prefecture;
use App\Models\GovernmentCity;
use App\Models\City;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class HtmlAddContentController extends Controller
{
    /**
     * HTML追加コンテンツ一覧取得
     */
    public function index()
    {
        $html_add_contents = DB::table('html_add_contents')
            ->join('prefectures', 'html_add_contents.prefecture_id', '=', 'prefectures.id')
            ->leftJoin('government_cities', 'html_add_contents.government_city_id', '=', 'government_cities.id')
            ->leftJoin('cities', 'html_add_contents.city_id', '=', 'cities.id')
            ->leftJoin('stations', 'html_add_contents.station_id', '=', 'stations.id')
            ->select(
                'html_add_contents.id',
                'html_add_contents.prefecture_id',
                'prefectures.name as prefecture_name',
                'html_add_contents.government_city_id',
                'government_cities.name as government_city_name',
                'html_add_contents.city_id',
                'cities.name as city_name',
                'html_add_contents.station_id',
                'stations.name as station_name',
                'html_add_contents.display_average_salary',
                'html_add_contents.display_feature',
                'html_add_contents.feature',
            )
            ->get();
        foreach ($html_add_contents as $c) {
            $c->display_average_salary_name = HtmlAddContent::DISPLAY_AVERAGE_SALARY[$c->display_average_salary];
            $c->display_feature_name = HtmlAddContent::DISPLAY_FEATURE[$c->display_feature];
        }
        return response()->json(['html_add_contents' => $html_add_contents]);
    }

    /**
     * HTML追加コンテンツ取得
     */
    public function show($id)
    {
        try {
            $html_add_content = HtmlAddContent::find($id);
            if (!$html_add_content) {
                throw new ModelNotFoundException();
            }
            $html_add_content['prefecture_name'] = $html_add_content->prefecture->name;
            $html_add_content['government_city_name'] = $html_add_content->governmentCity ? $html_add_content->governmentCity->name : '';
            $html_add_content['city_name'] = $html_add_content->city ? $html_add_content->city->name : '';
            $html_add_content['station_name'] = $html_add_content->station ? $html_add_content->station->name : '';
            $html_add_content['display_average_salary_name'] = HtmlAddContent::DISPLAY_AVERAGE_SALARY[$html_add_content->display_average_salary];
            $html_add_content['display_feature_name'] = HtmlAddContent::DISPLAY_FEATURE[$html_add_content->display_feature];
            return response()->json(['html_add_content' => $html_add_content]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Line not found'], 404);
        }
    }

    /**
     * HTML追加コンテンツ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'government_city_id' => '',
                'city_id' => '',
                'station_id' => '',
                'display_average_salary' => 'numeric',
                'display_feature' => 'numeric',
                'feature' => '',
            ]);

            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ValidationException();
                }
            }
            // 市区町村マスタ存在チェック
            if ($data['city_id']) {
                $city = City::find($data['city_id']);
                if (!$city) {
                    throw new ValidationException();
                }
            }
            // 駅マスタ存在チェック
            if ($data['station_id']) {
                $station = Station::find($data['station_id']);
                if (!$station) {
                    throw new ValidationException();
                }
            }

            HtmlAddContent::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * HTML追加コンテンツ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'government_city_id' => '',
                'city_id' => '',
                'station_id' => '',
                'display_average_salary' => 'numeric',
                'display_feature' => 'numeric',
                'feature' => '',
            ]);

            // 政令指定都市マスタ存在チェック
            if ($data['government_city_id']) {
                $government_city = GovernmentCity::find($data['government_city_id']);
                if (!$government_city) {
                    throw new ValidationException();
                }
            }
            // 市区町村マスタ存在チェック
            if ($data['city_id']) {
                $city = City::find($data['city_id']);
                if (!$city) {
                    throw new ValidationException();
                }
            }
            // 駅マスタ存在チェック
            if ($data['station_id']) {
                $station = Station::find($data['station_id']);
                if (!$station) {
                    throw new ValidationException();
                }
            }

            $html_add_content = HtmlAddContent::findOrFail($id);
            $html_add_content->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * HTML追加コンテンツ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $html_add_content = HtmlAddContent::find($id);
            if (!$html_add_content) {
                throw new ModelNotFoundException();
            }
            $html_add_content->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'HtmlAddContent not found'], 404);
        }
    }

    /**
     * HTML追加コンテンツ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = HtmlAddContent::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more html add contents not found'], 404);
        }
    }
}
