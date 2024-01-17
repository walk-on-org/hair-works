<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailmagazineConfig;
use App\Models\MailmagazineJCorporation;
use App\Models\MailmagazineJJobCategory;
use App\Models\MailmagazineMArea;
use App\Models\MailmagazineMLpJobCategory;
use App\Models\MailmagazineMEmpPrefecture;
use App\Models\MailmagazineMEmployment;
use App\Models\MailmagazineMQualification;
use App\Models\MailmagazineMStatus;
use App\Models\MailmagazineMChangeTime;
use App\Models\Member;
use App\Models\Office;
use App\Models\OfficeAccess;
use App\Models\CorporationImage;
use App\Models\OfficeImage;
use App\Models\JobImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MailmagazineConfigController extends Controller
{
    /**
     * メルマガ設定データ一覧取得
     */
    public function index(Request $request)
    {
        $query = MailmagazineConfig::whereRaw('1 = 1');

        // 検索条件指定
        if ($request->title) {
            $query = $query->where('mailmagazine_configs.title', 'LIKE', '%' . $request->title . '%');
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $mailmagazine_configs = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        foreach ($mailmagazine_configs as $m) {
            $m['deliver_job_type_name'] = MailmagazineConfig::DELIVER_JOB_TYPE[$m->deliver_job_type];
            $m['job_match_lp_job_category_name'] = MailmagazineConfig::JOB_MATCH_LP_JOB_CATEGORY[$m->job_match_lp_job_category];
            $m['job_match_employment_name'] = MailmagazineConfig::JOB_MATCH_EMPLOYMENT[$m->job_match_employment];
            $m['search_other_corporation_name'] = MailmagazineConfig::SEARCH_OTHER_CORPORATION[$m->search_other_corporation];

            // 求人法人
            $mailmagazine_j_corporations = $m->jCorporations->toArray();
            $m['j_corporation_ids'] = array_column($mailmagazine_j_corporations, 'id');
            $m['j_corporation_names'] = array_column($mailmagazine_j_corporations, 'name');

            // 求人職種
            $mailmagazine_j_job_category = $m->jJobCategories->toArray();
            $m['j_job_category_ids'] = array_column($mailmagazine_j_job_category, 'id');
            $m['j_job_category_names'] = array_column($mailmagazine_j_job_category, 'name');

            // 会員住所
            $m['mailmagazine_m_areas'] = $m->mailmagazineMAreas;
            foreach ($m['mailmagazine_m_areas'] as $mailmagazine_m_area) {
                $mailmagazine_m_area['prefecture_name'] = $mailmagazine_m_area->prefecture->name;
                $mailmagazine_m_area['city_name'] = $mailmagazine_m_area->city ? $mailmagazine_m_area->city->name : "";
            }

            // 会員希望職種
            $mailmagazine_m_lp_job_categories = $m->mLpJobCategories->toArray();
            $m['m_lp_job_category_ids'] = array_column($mailmagazine_m_lp_job_categories, 'id');
            $m['m_lp_job_category_names'] = array_column($mailmagazine_m_lp_job_categories, 'name');

            // 会員希望勤務地
            $mailmagazine_m_emp_prefectures = $m->mEmpPrefectures->toArray();
            $m['m_emp_prefecture_ids'] = array_column($mailmagazine_m_emp_prefectures, 'id');
            $m['m_emp_prefecture_names'] = array_column($mailmagazine_m_emp_prefectures, 'name');

            // 会員希望勤務体系
            $mailmagazine_m_employments = $m->mEmployments->toArray();
            $m['m_employment_ids'] = array_column($mailmagazine_m_employments, 'id');
            $m['m_employment_names'] = array_column($mailmagazine_m_employments, 'name');

            // 会員保有資格
            $mailmagazine_m_qualifications = $m->mQualifications->toArray();
            $m['m_qualification_ids'] = array_column($mailmagazine_m_qualifications, 'id');
            $m['m_qualification_names'] = array_column($mailmagazine_m_qualifications, 'name');

            // 会員状態
            $mailmagazine_m_statuses = $m->mailmagazineMStatuses->toArray();
            $m['m_statuses'] = array_column($mailmagazine_m_statuses, 'status');
            $m_status_names = [];
            foreach ($m['m_statuses'] as $m_status) {
                $m_status_names[] = MailmagazineMStatus::STATUS[$m_status];
            }
            $m['m_status_names'] = $m_status_names;

            // 会員希望転職時期
            $mailmagazine_m_change_times = $m->mailmagazineMChangeTimes->toArray();
            $m['m_change_times'] = array_column($mailmagazine_m_change_times, 'change_time');
            $m_change_time_names = [];
            foreach ($m['m_change_times'] as $m_change_time) {
                $m_change_time_names[] = MailmagazineMChangeTime::CHANGE_TIME[$m_change_time];
            }
            $m['m_change_time_names'] = $m_change_time_names;
        }
        return response()->json(['mailmagazine_configs' => $mailmagazine_configs, 'mailmagazine_configs_count' => $count]);
    }

    /**
     * メルマガ設定データ取得
     */
    public function show($id)
    {
        try {
            $mailmagazine_config = MailmagazineConfig::find($id);
            if (!$mailmagazine_config) {
                throw new ModelNotFoundException();
            }

            $mailmagazine_config['deliver_job_type_name'] = MailmagazineConfig::DELIVER_JOB_TYPE[$mailmagazine_config->deliver_job_type];
            $mailmagazine_config['job_match_lp_job_category_name'] = MailmagazineConfig::JOB_MATCH_LP_JOB_CATEGORY[$mailmagazine_config->job_match_lp_job_category];
            $mailmagazine_config['job_match_employment_name'] = MailmagazineConfig::JOB_MATCH_EMPLOYMENT[$mailmagazine_config->job_match_employment];
            $mailmagazine_config['search_other_corporation_name'] = MailmagazineConfig::SEARCH_OTHER_CORPORATION[$mailmagazine_config->search_other_corporation];

            // 求人法人
            $mailmagazine_j_corporations = $mailmagazine_config->jCorporations->toArray();
            $mailmagazine_config['j_corporation_ids'] = array_column($mailmagazine_j_corporations, 'id');
            $mailmagazine_config['j_corporation_names'] = array_column($mailmagazine_j_corporations, 'name');
            $j_corporation_labels = [];
            foreach ($mailmagazine_j_corporations as $corporation) {
                $j_corporation_labels[] = $corporation['id'] . '：' . $corporation['name'];
            }
            $mailmagazine_config['j_corporation_labels'] = $j_corporation_labels;

            // 求人職種
            $mailmagazine_j_job_category = $mailmagazine_config->jJobCategories->toArray();
            $mailmagazine_config['j_job_category_ids'] = array_column($mailmagazine_j_job_category, 'id');
            $mailmagazine_config['j_job_category_names'] = array_column($mailmagazine_j_job_category, 'name');

            // 会員住所
            $mailmagazine_config['mailmagazine_m_areas'] = $mailmagazine_config->mailmagazineMAreas;
            foreach ($mailmagazine_config['mailmagazine_m_areas'] as $mailmagazine_m_area) {
                $mailmagazine_m_area['prefecture_name'] = $mailmagazine_m_area->prefecture->name;
                $mailmagazine_m_area['city_name'] = $mailmagazine_m_area->city ? $mailmagazine_m_area->city->name : "";
            }

            // 会員希望職種
            $mailmagazine_m_lp_job_categories = $mailmagazine_config->mLpJobCategories->toArray();
            $mailmagazine_config['m_lp_job_category_ids'] = array_column($mailmagazine_m_lp_job_categories, 'id');
            $mailmagazine_config['m_lp_job_category_names'] = array_column($mailmagazine_m_lp_job_categories, 'name');

            // 会員希望勤務地
            $mailmagazine_m_emp_prefectures = $mailmagazine_config->mEmpPrefectures->toArray();
            $mailmagazine_config['m_emp_prefecture_ids'] = array_column($mailmagazine_m_emp_prefectures, 'id');
            $mailmagazine_config['m_emp_prefecture_names'] = array_column($mailmagazine_m_emp_prefectures, 'name');

            // 会員希望勤務体系
            $mailmagazine_m_employments = $mailmagazine_config->mEmployments->toArray();
            $mailmagazine_config['m_employment_ids'] = array_column($mailmagazine_m_employments, 'id');
            $mailmagazine_config['m_employment_names'] = array_column($mailmagazine_m_employments, 'name');

            // 会員保有資格
            $mailmagazine_m_qualifications = $mailmagazine_config->mQualifications->toArray();
            $mailmagazine_config['m_qualification_ids'] = array_column($mailmagazine_m_qualifications, 'id');
            $mailmagazine_config['m_qualification_names'] = array_column($mailmagazine_m_qualifications, 'name');

            // 会員状態
            $mailmagazine_m_statuses = $mailmagazine_config->mailmagazineMStatuses->toArray();
            $mailmagazine_config['m_statuses'] = array_column($mailmagazine_m_statuses, 'status');
            $m_status_names = [];
            foreach ($mailmagazine_config['m_statuses'] as $m_status) {
                $m_status_names[] = MailmagazineMStatus::STATUS[$m_status];
            }
            $mailmagazine_config['m_status_names'] = $m_status_names;

            // 会員希望転職時期
            $mailmagazine_m_change_times = $mailmagazine_config->mailmagazineMChangeTimes->toArray();
            $mailmagazine_config['m_change_times'] = array_column($mailmagazine_m_change_times, 'change_time');
            $m_change_time_names = [];
            foreach ($mailmagazine_config['m_change_times'] as $m_change_time) {
                $m_change_time_names[] = MailmagazineMChangeTime::CHANGE_TIME[$m_change_time];
            }
            $mailmagazine_config['m_change_time_names'] = $m_change_time_names;

            return response()->json(['mailmagazine_config' => $mailmagazine_config]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mailmagazine Config not found'], 404);
        }
    }

    /**
     * メルマガ設定データ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'deliver_job_type' => 'numeric',
                'job_keyword' => '',
                'member_birthyear_from' => 'nullable|numeric',
                'member_birthyear_to' => 'nullable|numeric',
                'job_match_lp_job_category' => 'numeric|regex:/^[0-1]{1}$/',
                'job_match_employment' => 'numeric|regex:/^[0-1]{1}$/',
                'job_match_distance' => 'nullable|numeric',
                'job_count_limit' => 'numeric',
                'search_other_corporation' => 'numeric|regex:/^[0-1]{1}$/',
                'j_corporation_ids' => 'nullable|array',
                'j_job_category_ids' => 'nullable|array',
                'mailmagazine_m_areas' => 'nullable|array',
                'mailmagazine_m_areas.*.prefecture_id' => 'numeric|exists:prefectures,id',
                'mailmagazine_m_areas.*.city_id' => 'nullable|numeric|exists:cities,id',
                'm_lp_job_category_ids' => 'nullable|array',
                'm_emp_prefecture_ids' => 'nullable|array',
                'm_employment_ids' => 'nullable|array',
                'm_qualification_ids' => 'nullable|array',
                'm_statuses' => 'nullable|array',
                'm_change_times' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data) {
                // メルマガ設定登録
                $mailmagazine_config = MailmagazineConfig::create($data);

                // 求人法人
                if (isset($data['j_corporation_ids']) && is_array($data['j_corporation_ids']) && count($data['j_corporation_ids']) > 0) {
                    foreach ($data['j_corporation_ids'] as $j_corporation_id) {
                        MailmagazineJCorporation::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'corporation_id' => $j_corporation_id,
                        ]);
                    }
                }

                // 求人職種
                if (isset($data['j_job_category_ids']) && is_array($data['j_job_category_ids']) && count($data['j_job_category_ids']) > 0) {
                    foreach ($data['j_job_category_ids'] as $j_job_category_id) {
                        MailmagazineJJobCategory::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'job_category_id' => $j_job_category_id,
                        ]);
                    }
                }

                // 会員住所
                if (isset($data['mailmagazine_m_areas']) && is_array($data['mailmagazine_m_areas'])) {
                    $mailmagazine_config->mailmagazineMAreas()->createMany($data['mailmagazine_m_areas']);
                }

                // 会員希望職種
                if (isset($data['m_lp_job_category_ids']) && is_array($data['m_lp_job_category_ids']) && count($data['m_lp_job_category_ids']) > 0) {
                    foreach ($data['m_lp_job_category_ids'] as $m_lp_job_category_id) {
                        MailmagazineMLpJobCategory::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'lp_job_category_id' => $m_lp_job_category_id,
                        ]);
                    }
                }

                // 会員希望勤務地
                if (isset($data['m_emp_prefecture_ids']) && is_array($data['m_emp_prefecture_ids']) && count($data['m_emp_prefecture_ids']) > 0) {
                    foreach ($data['m_emp_prefecture_ids'] as $m_emp_prefecture_id) {
                        MailmagazineMEmpPrefecture::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'emp_prefecture_id' => $m_emp_prefecture_id,
                        ]);
                    }
                }

                // 会員希望体系
                if (isset($data['m_employment_ids']) && is_array($data['m_employment_ids']) && count($data['m_employment_ids']) > 0) {
                    foreach ($data['m_employment_ids'] as $m_employment_id) {
                        MailmagazineMEmployment::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'employment_id' => $m_employment_id,
                        ]);
                    }
                }

                // 会員保有資格
                if (isset($data['m_qualification_ids']) && is_array($data['m_qualification_ids']) && count($data['m_qualification_ids']) > 0) {
                    foreach ($data['m_qualification_ids'] as $m_qualification_id) {
                        MailmagazineMQualification::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'qualification_id' => $m_qualification_id,
                        ]);
                    }
                }

                // 会員状態
                if (isset($data['m_statuses']) && is_array($data['m_statuses']) && count($data['m_statuses']) > 0) {
                    foreach ($data['m_statuses'] as $m_status) {
                        MailmagazineMStatus::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'status' => $m_status,
                        ]);
                    }
                }

                // 会員希望転職時期
                if (isset($data['m_change_times']) && is_array($data['m_change_times']) && count($data['m_change_times']) > 0) {
                    foreach ($data['m_change_times'] as $m_change_time) {
                        MailmagazineMChangeTime::create([
                            'mailmagazine_config_id' => $mailmagazine_config->id,
                            'change_time' => $m_change_time,
                        ]);
                    }
                }
            });
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * メルマガ設定データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'deliver_job_type' => 'numeric',
                'job_keyword' => '',
                'member_birthyear_from' => 'nullable|numeric',
                'member_birthyear_to' => 'nullable|numeric',
                'job_match_lp_job_category' => 'numeric|regex:/^[0-1]{1}$/',
                'job_match_employment' => 'numeric|regex:/^[0-1]{1}$/',
                'job_match_distance' => 'nullable|numeric',
                'job_count_limit' => 'numeric',
                'search_other_corporation' => 'numeric|regex:/^[0-1]{1}$/',
                'j_corporation_ids' => 'nullable|array',
                'j_job_category_ids' => 'nullable|array',
                'mailmagazine_m_areas' => 'nullable|array',
                'mailmagazine_m_areas.*.id' => '',
                'mailmagazine_m_areas.*.prefecture_id' => 'numeric|exists:prefectures,id',
                'mailmagazine_m_areas.*.city_id' => 'nullable|numeric|exists:cities,id',
                'm_lp_job_category_ids' => 'nullable|array',
                'm_emp_prefecture_ids' => 'nullable|array',
                'm_employment_ids' => 'nullable|array',
                'm_qualification_ids' => 'nullable|array',
                'm_statuses' => 'nullable|array',
                'm_change_times' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data, $id) {
                $mailmagazine_config = MailmagazineConfig::findOrFail($id);
                $mailmagazine_config->update($data);

                // 求人法人
                if (isset($data['j_corporation_ids']) && is_array($data['j_corporation_ids']) && count($data['j_corporation_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineJCorporation::where('mailmagazine_config_id', $id)
                        ->whereNotIn('corporation_id', $data['j_corporation_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['j_corporation_ids'] as $j_corporation_id) {
                        $count = MailmagazineJCorporation::where('mailmagazine_config_id', $id)
                            ->where('corporation_id', $j_corporation_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'corporation_id' => $j_corporation_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineJCorporations()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineJCorporations()->delete();
                }

                // 求人職種
                if (isset($data['j_job_category_ids']) && is_array($data['j_job_category_ids']) && count($data['j_job_category_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineJJobCategory::where('mailmagazine_config_id', $id)
                        ->whereNotIn('job_category_id', $data['j_job_category_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['j_job_category_ids'] as $j_job_category_id) {
                        $count = MailmagazineJJobCategory::where('mailmagazine_config_id', $id)
                            ->where('job_category_id', $j_job_category_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'job_category_id' => $j_job_category_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineJJobCategories()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineJJobCategories()->delete();
                }

                // 会員住所
                if (isset($data['mailmagazine_m_areas']) && is_array($data['mailmagazine_m_areas'])) {
                    // 入力があったID以外は削除
                    $ids = array_column($data['mailmagazine_m_areas'], 'id');
                    $ids = array_filter($ids, function ($val) {
                        return !(is_null($val) || $val === "");
                    });
                    if (count($ids) > 0) {
                        MailmagazineMArea::where('mailmagazine_config_id', $id)
                            ->whereNotIn('id', $ids)
                            ->delete();
                    } else {
                        $mailmagazine_config->mailmagazineMAreas()->delete();
                    }
                    
                    // 入力があったデータは登録or更新
                    foreach ($data['mailmagazine_m_areas'] as $mailmagazine_m_area) {
                        if (isset($mailmagazine_m_area['id']) && !empty($mailmagazine_m_area['id'])) {
                            // 登録済みのデータは更新
                            MailmagazineMArea::where('id', $mailmagazine_m_area['id'])
                                ->update([
                                    'prefecture_id' => $mailmagazine_m_area['prefecture_id'],
                                    'city_id' => $mailmagazine_m_area['city_id'],
                                ]);
                        } else {
                            // 未登録データは登録
                            $mailmagazine_config->mailmagazineMAreas()->create($mailmagazine_m_area);
                        }
                    }
                } else {
                    // 入力がない場合は削除
                    $mailmagazine_config->mailmagazineMAreas()->delete();
                }

                // 会員希望職種
                if (isset($data['m_lp_job_category_ids']) && is_array($data['m_lp_job_category_ids']) && count($data['m_lp_job_category_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMLpJobCategory::where('mailmagazine_config_id', $id)
                        ->whereNotIn('lp_job_category_id', $data['m_lp_job_category_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_lp_job_category_ids'] as $m_lp_job_category_id) {
                        $count = MailmagazineMLpJobCategory::where('mailmagazine_config_id', $id)
                            ->where('lp_job_category_id', $m_lp_job_category_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'lp_job_category_id' => $m_lp_job_category_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMLpJobCategories()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMLpJobCategories()->delete();
                }

                // 会員希望勤務地
                if (isset($data['m_emp_prefecture_ids']) && is_array($data['m_emp_prefecture_ids']) && count($data['m_emp_prefecture_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMEmpPrefecture::where('mailmagazine_config_id', $id)
                        ->whereNotIn('emp_prefecture_id', $data['m_emp_prefecture_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_emp_prefecture_ids'] as $m_emp_prefecture_id) {
                        $count = MailmagazineMEmpPrefecture::where('mailmagazine_config_id', $id)
                            ->where('emp_prefecture_id', $m_emp_prefecture_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'emp_prefecture_id' => $m_emp_prefecture_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMEmpPrefectures()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMEmpPrefectures()->delete();
                }

                // 会員希望体系
                if (isset($data['m_employment_ids']) && is_array($data['m_employment_ids']) && count($data['m_employment_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMEmployment::where('mailmagazine_config_id', $id)
                        ->whereNotIn('employment_id', $data['m_employment_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_employment_ids'] as $m_employment_id) {
                        $count = MailmagazineMEmployment::where('mailmagazine_config_id', $id)
                            ->where('employment_id', $m_employment_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'employment_id' => $m_employment_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMEmployments()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMEmployments()->delete();
                }

                // 会員保有資格
                if (isset($data['m_qualification_ids']) && is_array($data['m_qualification_ids']) && count($data['m_qualification_ids']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMQualification::where('mailmagazine_config_id', $id)
                        ->whereNotIn('qualification_id', $data['m_qualification_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_qualification_ids'] as $m_qualification_id) {
                        $count = MailmagazineMQualification::where('mailmagazine_config_id', $id)
                            ->where('qualification_id', $m_qualification_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'qualification_id' => $m_qualification_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMQualifications()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMQualifications()->delete();
                }

                // 会員状態
                if (isset($data['m_statuses']) && is_array($data['m_statuses']) && count($data['m_statuses']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMStatus::where('mailmagazine_config_id', $id)
                        ->whereNotIn('status', $data['m_statuses'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_statuses'] as $m_status) {
                        $count = MailmagazineMStatus::where('mailmagazine_config_id', $id)
                            ->where('status', $m_status)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'status' => $m_status,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMStatuses()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMStatuses()->delete();
                }

                // 会員希望転職時期
                if (isset($data['m_change_times']) && is_array($data['m_change_times']) && count($data['m_change_times']) > 0) {
                    // 入力があったID以外は削除
                    MailmagazineMChangeTime::where('mailmagazine_config_id', $id)
                        ->whereNotIn('change_time', $data['m_change_times'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['m_change_times'] as $m_change_time) {
                        $count = MailmagazineMChangeTime::where('mailmagazine_config_id', $id)
                            ->where('change_time', $m_change_time)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'change_time' => $m_change_time,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $mailmagazine_config->mailmagazineMChangeTimes()->createMany($insert_data);
                    }
                } else {
                    $mailmagazine_config->mailmagazineMChangeTimes()->delete();
                }
            });
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * メルマガ設定データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $mailmagazine_config = MailmagazineConfig::find($id);
            if (!$mailmagazine_config) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($mailmagazine_config) {
                // メルマガ設定削除
                // 関連データは削除しない
                $mailmagazine_config->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Mailmgazine Config not found'], 404);
        }
    }

    /**
     * メルマガ設定データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // メルマガ設定削除
                // 関連データは削除しない
                $deleted_count = MailmagazineConfig::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more mailmagazine configs not found'], 404);
        }
    }

    /**
     * メルマガ送信リストダウンロード
     */
    public function downloadSendList(Request $request, $id)
    {
        $mailmagazine_config = MailmagazineConfig::find($id);
        if (!$mailmagazine_config) {
            return response()->json([
                'result' => 'ok',
                'message' => '存在しないメルマガ設定が選択されてます。',
            ]);
        }

        // CSVファイル作成コールバック
        $callback = function () use ($mailmagazine_config, $request) {
            // メルマガ対象の会員情報を取得
            $members = self::getMatchingMember($mailmagazine_config);
            // メルマガ送信リストを取得
            $mailmagazine_list = self::createMailmagazineList($mailmagazine_config, $members);

            // CSVファイル作成
            $csv = fopen('php://output', 'w');
            // CSVヘッダ
            $columns = [
                'email' => 'メールアドレス',
                'name' => '名前',
            ];
            for ($i = 1; $i <= $mailmagazine_config->job_count_limit; $i++) {
                $columns["job_{$i}_salon_name"] = "求人{$i}サロン名";
                $columns["job_{$i}_job_category"] = "求人{$i}職種";
                $columns["job_{$i}_position"] = "求人{$i}役職/役割";
                $columns["job_{$i}_employment"] = "求人{$i}雇用形態";
                $columns["job_{$i}_prefecture"] = "求人{$i}都道府県";
                $columns["job_{$i}_city"] = "求人{$i}市区町村";
                $columns["job_{$i}_access"] = "求人{$i}アクセス";
                $columns["job_{$i}_detail_url"] = "求人{$i}URL";
                $columns["job_{$i}_entry_url"] = "求人{$i}応募URL";
                $columns["job_{$i}_image_url"] = "求人{$i}画像URL";
                $columns["job_{$i}_salary"] = "求人{$i}給与";
                $columns["job_{$i}_catch_copy"] = "求人{$i}キャッチコピー";
            }
            // SJIS変換
            if ($request->char_code == 'ShiftJIS') {
                mb_convert_variables('SJIS-win', 'UTF-8', $columns);
            }
            // ヘッダを追加
            fputcsv($csv, $columns);

            foreach ($mailmagazine_list as $row) {
                $send_data = [
                    'email' => $row['email'],
                    'name' => $row['name'],
                ];
                for ($i = 1; $i <= $mailmagazine_config->job_count_limit; $i++) {
                    $send_data["job_{$i}_salon_name"] = $row["job_{$i}_salon_name"];
                    $send_data["job_{$i}_job_category"] = $row["job_{$i}_job_category"];
                    $send_data["job_{$i}_position"] = $row["job_{$i}_position"];
                    $send_data["job_{$i}_employment"] = $row["job_{$i}_employment"];
                    $send_data["job_{$i}_prefecture"] = $row["job_{$i}_prefecture"];
                    $send_data["job_{$i}_city"] = $row["job_{$i}_city"];
                    $send_data["job_{$i}_access"] = $row["job_{$i}_access"];
                    $send_data["job_{$i}_detail_url"] = $row["job_{$i}_detail_url"];
                    $send_data["job_{$i}_entry_url"] = $row["job_{$i}_entry_url"];
                    $send_data["job_{$i}_image_url"] = $row["job_{$i}_image_url"];
                    $send_data["job_{$i}_salary"] = $row["job_{$i}_salary"];
                    $send_data["job_{$i}_catch_copy"] = $row["job_{$i}_catch_copy"];
                }

                // SJIS変換
                if ($request->char_code == 'ShiftJIS') {
                    mb_convert_variables('SJIS-win', 'UTF-8', $send_data);
                }
                // CSVファイルのデータを追加
                fputcsv($csv, $send_data);
            }
            
            // CSV閉じる
            fclose($csv);
        };

        // ファイル名
        $filename = 'メルマガ送信リスト_' . $mailmagazine_config->title . '_' . date('Ymd') . '.csv';

        // レスポンスヘッダー情報
        $response_header = [
            'Content-type' => 'text/csv',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ];

        return response()->streamDownload($callback, $filename, $response_header);
    }

    /**
     * メルマガ送信リストにマッチする会員情報を取得
     */
    private function getMatchingMember($mailmagazine_config)
    {
        $query = Member::join('member_lp_job_categories', 'members.id', '=', 'member_lp_job_categories.member_id')
            ->join('member_qualifications', 'members.id', '=', 'member_qualifications.member_id')
            ->leftJoin('cities', function($join) {
                $join->on('members.address', 'LIKE', DB::raw('concat(cities.name, \'%\')'))
                    ->on('members.prefecture_id', '=', 'cities.prefecture_id');
            })
            ->whereNotNull('members.email');
        
        // 住所（都道府県1 or (都道府県2 and 市区町村2)）
        if (count($mailmagazine_config->mailmagazineMAreas) > 0) {
            $m_areas = $mailmagazine_config->mailmagazineMAreas;
            $query = $query->where(function ($query) use ($m_areas) {
                foreach ($m_areas as $m_area) {
                    $query->orWhere(function ($query) use ($m_area) {
                        $query->where('members.prefecture_id', '=', $m_area->prefecture_id);
                        if ($m_area->city_id) {
                            $query->where('members.address', 'LIKE', $m_area->city->name . '%');
                        }
                    });
                }
            });
        }
        // 希望勤務地
        if (count($mailmagazine_config->mailmagazineMEmpPrefectures) > 0) {
            $m_emp_prefectures = $mailmagazine_config->mailmagazineMEmpPrefectures;
            $emp_prefecture_ids = array_column($m_emp_prefectures->toArray(), 'emp_prefecture_id');
            $query = $query->whereIn('members.emp_prefecture_id', $emp_prefecture_ids);
        }
        // 希望職種
        if (count($mailmagazine_config->mailmagazineMLpJobCategories) > 0) {
            $m_lp_job_categories = $mailmagazine_config->mailmagazineMLpJobCategories;
            $lp_job_category_ids = array_column($m_lp_job_categories->toArray(), 'lp_job_category_id');
            $query = $query->whereIn('member_lp_job_categories.lp_job_category_id', $lp_job_category_ids);
        }
        // 希望勤務体系
        if (count($mailmagazine_config->mailmagazineMEmployments) > 0) {
            $m_employments = $mailmagazine_config->mailmagazineMEmployments;
            $employment_ids = array_column($m_employments->toArray(), 'employment_id');
            $query = $query->whereIn('members.employment_id', $employment_ids);
        }
        // 保有資格
        if (count($mailmagazine_config->mailmagazineMQualifications) > 0) {
            $m_qualifications = $mailmagazine_config->mailmagazineMQualifications;
            $qualification_ids = array_column($m_qualifications->toArray(), 'qualification_id');
            $query = $query->whereIn('member_qualifications.qualification_id', $qualification_ids);
        }
        // ステータス
        if (count($mailmagazine_config->mailmagazineMStatuses) > 0) {
            $m_statuses = $mailmagazine_config->mailmagazineMStatuses;
            $statuses = array_column($m_statuses->toArray(), 'status');
            $query = $query->whereIn('members.status', $statuses);
        }
        // 希望転職時期
        if (count($mailmagazine_config->mailmagazineMChangeTimes) > 0) {
            $m_change_times = $mailmagazine_config->mailmagazineMChangeTimes;
            $change_times = array_column($m_change_times->toArray(), 'change_time');
            $query = $query->whereIn('members.change_time', $change_times);
        }
        // 生まれ年
        if ($mailmagazine_config->member_birthyear_from) {
            $query = $query->where('members.birthyear', '>=', $mailmagazine_config->member_birthyear_from);
        }
        if ($mailmagazine_config->member_birthyear_to) {
            $query = $query->where('members.birthyear', '<=', $mailmagazine_config->member_birthyear_to);
        }
        $members = $query->groupBy('members.id')
            ->select(
                'members.id',
                'members.name',
                'members.email',
                'members.prefecture_id',
                DB::raw('max(cities.id) as city_id'),
                'members.address',
                'members.employment_id',
                DB::raw('group_concat(member_lp_job_categories.lp_job_category_id) as lp_job_category_id'),
                'members.lat',
                'members.lng',
            )
            ->get();

        return $members;
    }

    /**
     * 求人情報を付与したメルマガ送信リストを作成
     */
    private function createMailmagazineList($mailmagazine_config, $members)
    {
        // 求人取得のベースのクエリ作成
        $base_query = self::getBaseJobQuery();

        // 会員情報ごとにメルマガに載せる情報を取得
        $mailmagazine_list = [];
        foreach ($members as $member) {
            $jobs = [];
            $other_jobs = [];
            // 求人上限、他企業からも検索するかの条件追加
            if ($mailmagazine_config->search_other_corporation) {
                // 他企業からも検索する場合
                // 選択した法人、キーワードで1件取得
                $query = self::getJobSearchQuery(clone $base_query, $mailmagazine_config, $member, false);
                if ($query === false) {
                    continue;
                }
                $jobs = $query->limit(1)->get();
                // 他企業も検索
                $query = self::getJobSearchQuery(clone $base_query, $mailmagazine_config, $member, true);
                if ($query === false) {
                    continue;
                }
                $other_jobs = $query->limit($mailmagazine_config->job_count_limit - 1)->get();
            } else {
                // 同じ企業からのみ検索する場合
                $query = self::getJobSearchQuery(clone $base_query, $mailmagazine_config, $member, false);
                if ($query === false) {
                    continue;
                }
                $jobs = $query->limit($mailmagazine_config->job_count_limit)->get();
            }

            // 該当求人がない場合、その会員には送信しない
            if (count($jobs) == 0) {
                continue;
            }

            $row = [
                'email' => $member->email,
                'name' => $member->name,
            ];
            // 事前に上限分のカラムを作成
            for ($i = 1; $i <= $mailmagazine_config->job_count_limit; $i++) {
                $row["job_{$i}_salon_name"] = '';
                $row["job_{$i}_job_category"] = '';
                $row["job_{$i}_position"] = '';
                $row["job_{$i}_employment"] = '';
                $row["job_{$i}_prefecture"] = '';
                $row["job_{$i}_city"] = '';
                $row["job_{$i}_access"] = '';
                $row["job_{$i}_detail_url"] = '';
                $row["job_{$i}_entry_url"] = '';
                $row["job_{$i}_image_url"] = '';
                $row["job_{$i}_salary"] = '';
                $row["job_{$i}_catch_copy"] = '';
            }
            // 求人情報を埋め込み
            $today = date('Ymd');
            foreach ($jobs as $i => $job) {
                $index = $i + 1;
                $row["job_{$index}_salon_name"] = $job->office_name;
                $row["job_{$index}_job_category"] = $job->job_category_name;
                $row["job_{$index}_position"] = $job->position_name;
                $row["job_{$index}_employment"] = $job->employment_name;
                $row["job_{$index}_prefecture"] = $job->prefecture_name;
                $row["job_{$index}_city"] = $job->city_name;
                if (is_null($job->station_name) && is_null($job->move_type) && is_null($job->time)) {
                    $row["job_{$index}_access"] = $job->station_name . '駅' . OfficeAccess::MOVE_TYPE[$job->move_type] . $job->time . '分';
                }
                $row["job_{$index}_detail_url"] = "https://hair-work.jp/detail/{$job->job_id}?utm_source=mailmagazine&utm_medium=mail&utm_campaign={$today}";
                $row["job_{$index}_entry_url"] = "https://hair-work.jp/entry/{$job->job_id}?utm_source=mailmagazine&utm_medium=mail&utm_campaign={$today}";
                $row["job_{$index}_image_url"] = self::getJobImageUrl($job);
                $row["job_{$index}_salary"] = self::getSalary($job);
                $row["job_{$index}_catch_copy"] = $job->catch_copy;
            }
            foreach ($other_jobs as $i => $job) {
                $i = $index + 2;
                $row["job_{$index}_salon_name"] = $job->office_name;
                $row["job_{$index}_job_category"] = $job->job_category_name;
                $row["job_{$index}_position"] = $job->position_name;
                $row["job_{$index}_employment"] = $job->employment_name;
                $row["job_{$index}_prefecture"] = $job->prefecture_name;
                $row["job_{$index}_city"] = $job->city_name;
                if (is_null($job->station_name) && is_null($job->move_type) && is_null($job->time)) {
                    $row["job_{$index}_access"] = $job->station_name . '駅' . OfficeAccess::MOVE_TYPE[$job->move_type] . $job->time . '分';
                }
                $row["job_{$index}_detail_url"] = "https://hair-work.jp/detail/{$job->job_id}?utm_source=mailmagazine&utm_medium=mail&utm_campaign={$today}";
                $row["job_{$index}_entry_url"] = "https://hair-work.jp/entry/{$job->job_id}?utm_source=mailmagazine&utm_medium=mail&utm_campaign={$today}";
                $row["job_{$index}_image_url"] = self::getJobImageUrl($job);
                $row["job_{$index}_salary"] = self::getSalary($job);
                $row["job_{$index}_catch_copy"] = $job->catch_copy;
            }

            $mailmagazine_list[] = $row;
        }

        return $mailmagazine_list;
    }

    /**
     * 求人取得のベースのクエリを取得
     */
    private function getBaseJobQuery()
    {
        $query = Office::join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->leftJoin('stations', function ($join) {
                $join->on('office_accesses.station_id', '=', 'stations.id')
                    ->where('stations.status', 0);
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where('jobs.status', 10)
            ->where('jobs.private', 0)
            ->where('job_categories.status', 1)
            ->where('positions.status', 1)
            ->where('employments.status', 1)
            ->whereIn('office_accesses.id', function ($query) {
                $query->select(DB::raw('min(tmp.id)'))
                    ->from('office_accesses as tmp')
                    ->whereRaw('office_accesses.office_id = tmp.office_id')
                    ->groupBy('tmp.office_id');
            })
            ->select(
                'corporations.id as corporation_id',
                'corporations.name as corporation_name',
                'offices.id as office_id',
                'offices.name as office_name',
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
                'stations.name as station_name',
                'office_accesses.move_type',
                'office_accesses.time',
                'jobs.id as job_id',
                'job_categories.name as job_category_name',
                'positions.name as position_name',
                'employments.name as employment_name',
                'jobs.catch_copy',
                'jobs.m_salary_lower',
                'jobs.m_salary_upper',
                'jobs.t_salary_lower',
                'jobs.t_salary_upper',
                'jobs.d_salary_lower',
                'jobs.d_salary_upper',
                'jobs.commission_lower',
                'jobs.commission_upper',
                'jobs.publish_start_date',
            );
        return $query;
    }

    /**
     * 求人検索クエリを取得
     */
    private function getJobSearchQuery($query, $mailmagazine_config, $member, $search_other_corporation)
    {
        // 法人
        if (count($mailmagazine_config->mailmagazineJCorporations) > 0) {
            $j_corporations = $mailmagazine_config->mailmagazineJCorporations;
            $corporation_ids = array_column($j_corporations->toArray(), 'corporation_id');
            if ($search_other_corporation) {
                // 他企業から検索する場合は、NOT検索
                $query = $query->whereNotIn('corporations.id', $corporation_ids);
            } else {
                $query = $query->whereIn('corporations.id', $corporation_ids);
            }
        }

        // キーワード
        if ($mailmagazine_config->job_keyword) {
            $keyword = $mailmagazine_config->job_keyword;
            if ($search_other_corporation) {
                // 他企業から検索する場合は、NOT検索
                $query = $query->where('corporations.name', 'not like', '%' . $keyword . '%')
                    ->where('offices.name', 'not like', '%' . $keyword . '%');
            } else {
                $query = $query->where(function ($query) use ($keyword) {
                    $query->where('corporations.name', 'LIKE', '%' . $keyword . '%')
                        ->orWhere('offices.name', 'LIKE', '%' . $keyword . '%');
                });
            }
        }

        // 求人職種
        if (count($mailmagazine_config->mailmagazineJJobCategories) > 0) {
            $j_job_categories = $mailmagazine_config->mailmagazineJJobCategories;
            $job_category_ids = array_column($j_job_categories->toArray(), 'job_category_id');
            $query = $query->whereIn('jobs.job_category_id', $job_category_ids);
        }

        // 役職/役割が同じ
        if ($mailmagazine_config->job_match_lp_job_category) {
            $position_ids = [];
            foreach (explode(',', $member->lp_job_category_id) as $id) {
                if ($id == '1') {
                    $position_ids[] = 1;
                } else if ($id == '2' || $id == '3') {
                    $position_ids[] = 2;
                } else if ($id == '4') {
                    $position_ids[] = 6;
                } else if ($id == '5') {
                    $position_ids[] = 7;
                } else if ($id == '6') {
                    $position_ids[] = 8;
                } else if ($id == '7') {
                    $position_ids[] = 5;
                }
            }
            $query = $query->whereIn('jobs.position_id', $position_ids);
        }

        // 雇用形態が同じ
        if ($mailmagazine_config->job_match_employment) {
            $query = $query->where('jobs.employment_id', $member->employment_id);
        }

        // 送信求人種別ごとの処理
        if ($mailmagazine_config->deliver_job_type == 0) {
            // 新着求人の場合、掲載開始日から14日以内（新着）で、半径〇〇km以内の求人を割り当て
            $query = $query->whereRaw('DATEDIFF(now(), jobs.publish_start_date) <= 14')
                ->whereRaw(self::createDistanceQuery($member->lat ? $member->lat : 0, $member->lng ? $member->lng : 0, '') . ' <= ?', $mailmagazine_config->job_match_distance)
                ->orderBy('jobs.publish_start_date', 'desc');
        } else if ($mailmagazine_config->deliver_job_type == 1) {
            // 半径〇〇km以内の求人の場合、距離が近い求人順に割り当て
            $query = $query->whereRaw(self::createDistanceQuery($member->lat ? $member->lat : 0, $member->lng ? $member->lng : 0, '') . ' <= ?', $mailmagazine_config->job_match_distance)
                ->addSelect(DB::raw(self::createDistanceQuery($member->lat ? $member->lat : 0, $member->lng ? $member->lng : 0, 'distance')))
                ->orderBy('distance');
        } else if ($mailmagazine_config->deliver_job_type == 2) {
            // 同じ都道府県の求人の場合、都道府県が同じ求人のうち、距離が近い求人順に割り当て
            $query = $query->where('offices.prefecture_id', $member->prefecture_id)
                ->addSelect(DB::raw(self::createDistanceQuery($member->lat ? $member->lat : 0, $member->lng ? $member->lng : 0, 'distance')))
                ->orderBy('distance');
        } else if ($mailmagazine_config->deliver_job_type == 3) {
            // 同じ市区町村の求人の場合、市区町村が同じ求人のうち、距離が近い求人順に割り当て
            if ($member->city_id) {
                return false;
            }
            $query = $query->where('offices.prefecture_id', $member->prefecture_id)
                ->where('offices.city_id', $member->city_id)
                ->addSelect(DB::raw(self::createDistanceQuery($member->lat ? $member->lat : 0, $member->lng ? $member->lng : 0, 'distance')))
                ->orderBy('distance');
        }

        return $query;
    }

    /**
     * 距離を算出するクエリ作成
     */
    private function createDistanceQuery($lat, $lng, $alias)
    {
        $query_string = "(6371 * acos(cos(radians({$lat})) * cos(radians(offices.lat)) * cos(radians(offices.lng) - radians({$lng})) + sin(radians({$lat})) * sin(radians(offices.lat))))";
        if ($alias) {
            $query_string .= " as {$alias}";
        }
        return $query_string;
    }

    /**
     * 給与を文字列化
     */
    private function getSalary($job)
    {
        $salary = '';
        if ($job->m_salary_lower || $job->m_salary_upper) {
            $salary .= '月給：';
            if ($job->m_salary_lower) {
                $salary .= ($job->m_salary_lower / 10000) . '万円';
            }
            $salary .= '〜';
            if ($job->m_salary_upper) {
                $salary .= ($job->m_salary_upper / 10000) . '万円';
            }
        }
        if ($job->t_salary_lower || $job->t_salary_upper) {
            $salary .= ($salary ? '、' : '') . '時給：';
            if ($job->t_salary_lower) {
                $salary .= $job->t_salary_lower . '円';
            }
            $salary .= '〜';
            if ($job->t_salary_upper) {
                $salary .= $job->t_salary_upper . '円';
            }
        }
        if ($job->d_salary_lower || $job->d_salary_upper) {
            $salary .= ($salary ? '、' : '') . '日給：';
            if ($job->d_salary_lower) {
                $salary .= $job->d_salary_lower . '円';
            }
            $salary .= '〜';
            if ($job->d_salary_upper) {
                $salary .= $job->d_salary_upper . '円';
            }
        }
        if ($job->commission_lower || $job->commission_upper) {
            $salary .= ($salary ? '、' : '') . '歩合：';
            if ($job->commission_lower) {
                $salary .= $job->commission_lower . '%';
            }
            $salary .= '〜';
            if ($job->commission_upper) {
                $salary .= $job->commission_upper . '%';
            }
        }

        return $salary;
    }

    /**
     * 求人画像URLを取得
     */
    private function getJobImageUrl($job)
    {
        $job_image = JobImage::where('job_id', $job->job_id)
            ->orderBy('sort')
            ->first();
        $office_image = OfficeImage::where('office_id', $job->office_id)
            ->orderBy('sort')
            ->first();
        $corporation_image = CorporationImage::where('corporation_id', $job->corporation_id)
            ->orderBy('sort')
            ->first();

        if (!$job_image && !$office_image && !$corporation_image) {
            return '';
        } else if ($job_image && !$office_image && !$corporation_image) {
            return 'https://hair-work.jp' . config('uploadimage.job_image_relative_path') . $job_image->office_id . '/' . $job_image->image;
        } else if (!$job_image && $office_image && !$corporation_image) {
            return 'https://hair-work.jp' . config('uploadimage.office_image_relative_path') . $office_image->office_id . '/' . $office_image->image;
        } else if (!$job_image && !$office_image && $corporation_image) {
            return 'https://hair-work.jp' . config('uploadimage.corporation_image_relative_path') . $corporation_image->corporation_id . '/' . $corporation_image->image;
        }

        // 2つ以上設定している場合、更新日時が最新の方を使用する
        $base_datetime = new \Datetime('2000-01-01');
        $max_job_image_updated_at = $job_image ? $job_image->updated_at : $base_datetime;
        $max_office_image_updated_at = $office_image ? $office_image->updated_at : $base_datetime;
        $max_corporation_image_updated_at = $corporation_image ? $corporation_image->updated_at : $base_datetime;
        if (strtotime($max_job_image_updated_at) > strtotime($max_corporation_image_updated_at) && strtotime($max_job_image_updated_at) > strtotime($max_office_image_updated_at)) {
            return 'https://hair-work.jp' . config('uploadimage.job_image_relative_path') . $job_image->office_id . '/' . $job_image->image;
        } else if (strtotime($max_office_image_updated_at) > strtotime($max_corporation_image_updated_at)) {
            return 'https://hair-work.jp' . config('uploadimage.office_image_relative_path') . $office_image->office_id . '/' . $office_image->image;
        } else {
            return 'https://hair-work.jp' . config('uploadimage.corporation_image_relative_path') . $corporation_image->corporation_id . '/' . $corporation_image->image;
        }
    }
}
