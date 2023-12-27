<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailmagazineConfig;
use App\Models\MailmagazineJCorporation;
use App\Models\MailmagazineJJobCategory;
use App\Models\MailmagazineMLpJobCategory;
use App\Models\MailmagazineMEmpPrefecture;
use App\Models\MailmagazineMEmployment;
use App\Models\MailmagazineMQualification;
use App\Models\MailmagazineMStatus;
use App\Models\MailmagazineMChangeTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MailmagazineConfigController extends Controller
{
    /**
     * メルマガ設定データ一覧取得
     */
    public function index()
    {
        $mailmagazine_configs = MailmagazineConfig::all();
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
        return response()->json(['mailmagazine_configs' => $mailmagazine_configs]);
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
                    
                    $mailmagazine_config->mailmagazineMAreas()->createMany($data['mailmagazine_m_areas']);
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
}
