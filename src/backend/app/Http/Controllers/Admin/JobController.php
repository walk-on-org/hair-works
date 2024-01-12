<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCommitmentTerm;
use App\Models\JobHoliday;
use App\Models\JobQualification;
use App\Models\JobImage;
use App\Models\Office;
use App\Models\Contract;
use App\Library\UploadImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class JobController extends Controller
{
    /**
     * 求人データ一覧取得
     */
    public function index(Request $request)
    {
        $query = Job::join('offices', 'jobs.office_id', '=', 'offices.id')
            ->join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->whereNull('offices.deleted_at')
            ->whereNull('corporations.deleted_at');

        // 検索条件指定
        if ($request->corporation_name) {
            $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
        }
        if ($request->office_name) {
            $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
        }
        if ($request->job_name) {
            $query = $query->where('jobs.name', 'LIKE', '%' . $request->job_name . '%');
        }
        if ($request->status) {
            $status = is_array($request->status) ? $request->status : explode(',', $request->status);
            $query = $query->whereIn('jobs.status', $status);
        }
        if ($request->job_category_id) {
            $job_category_id = is_array($request->job_category_id) ? $request->job_category_id : explode(',', $request->job_category_id);
            $query = $query->whereIn('jobs.job_category_id', $job_category_id);
        }
        if ($request->position_id) {
            $position_id = is_array($request->position_id) ? $request->position_id : explode(',', $request->position_id);
            $query = $query->whereIn('jobs.position_id', $position_id);
        }
        if ($request->employment_id) {
            $employment_id = is_array($request->employment_id) ? $request->employment_id : explode(',', $request->employment_id);
            $query = $query->whereIn('jobs.employment_id', $employment_id);
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query->select(
                'jobs.id',
                'jobs.name',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'jobs.office_id',
                'offices.name as office_name',
                'jobs.status',
                'jobs.pickup',
                'jobs.private',
                'jobs.recommend',
                'jobs.indeed_private',
                'jobs.minimum_wage_ok',
                'jobs.job_category_id',
                'job_categories.name as job_category_name',
                'jobs.position_id',
                'positions.name as position_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'jobs.m_salary_lower',
                'jobs.m_salary_upper',
                'jobs.t_salary_lower',
                'jobs.t_salary_upper',
                'jobs.d_salary_lower',
                'jobs.d_salary_upper',
                'jobs.commission_lower',
                'jobs.commission_upper',
                'jobs.salary',
                'jobs.work_time',
                'jobs.job_description',
                'jobs.holiday',
                'jobs.welfare',
                'jobs.entry_requirement',
                'jobs.catch_copy',
                'jobs.recommend_point',
                'jobs.salon_message',
                'jobs.publish_start_date',
                'jobs.publish_end_date',
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $jobs = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        foreach ($jobs as $j) {
            $j->status_name = Job::STATUS[$j->status];
            $j->pickup_name = Job::PICKUP[$j->pickup];
            $j->private_name = Job::PRIVATE[$j->private];
            $j->recommend_name = Job::RECOMMEND[$j->recommend];
            $j->indeed_private_name = Job::INDEED_PRIVATE[$j->indeed_private];
            $j->minimum_wage_ok_name = Job::MINIMUM_WAGE_OK[$j->minimum_wage_ok];
        }
        return response()->json(['jobs' => $jobs, 'jobs_count' => $count]);
    }

    /**
     * 求人データ取得
     */
    public function show($id)
    {
        try {
            $job = Job::find($id);
            if (!$job) {
                throw new ModelNotFoundException();
            }

            $job['office_name'] = $job->office->name;
            $job['corporation_id'] = $job->office->corporation_id;
            $job['corporation_name'] = $job->office->corporation->name;
            $job['job_category_name'] = $job->jobCategory->name;
            $job['position_name'] = $job->position->name;
            $job['employment_name'] = $job->employment->name;
            $job['status_name'] = Job::STATUS[$job->status];
            $job['pickup_name'] = Job::PICKUP[$job->pickup];
            $job['private_name'] = Job::PRIVATE[$job->private];
            $job['recommend_name'] = Job::RECOMMEND[$job->recommend];
            $job['indeed_private_name'] = Job::INDEED_PRIVATE[$job->indeed_private];
            $job['minimum_wage_ok_name'] = Job::MINIMUM_WAGE_OK[$job->minimum_wage_ok];

            // 求人一括設定画像
            $job['job_images'] = $job->jobImages;
            foreach ($job['job_images'] as $job_image) {
                $job_image['image'] = config('uploadimage.job_image_path') . $job->id . '/' . $job_image->image;
            }

            // 求人こだわり条件
            $job_commitment_terms = $job->commitmentTerms->toArray();
            $job['commitment_term_ids'] = array_column($job_commitment_terms, 'id');
            $job['commitment_term_names'] = array_column($job_commitment_terms, 'name');

            // 求人休日
            $job_holidays = $job->holidays->toArray();
            $job['holiday_ids'] = array_column($job_holidays, 'id');
            $job['holiday_names'] = array_column($job_holidays, 'name');
            
            // 求人資格
            $job_qualifications = $job->qualifications->toArray();
            $job['qualification_ids'] = array_column($job_qualifications, 'id');
            $job['qualification_names'] = array_column($job_qualifications, 'name');

            return response()->json(['job' => $job]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Job not found'], 404);
        }
    }

    /**
     * 求人データ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'office_id' => 'numeric|exists:offices,id',
                'status' => 'numeric',
                'pickup' => 'numeric',
                'private' => 'numeric',
                'recommend' => 'numeric',
                'indeed_private' => 'numeric',
                'minimum_wage_ok' => 'numeric',
                'job_category_id' => 'numeric|exists:job_categories,id',
                'position_id' => 'numeric|exists:positions,id',
                'employment_id' => 'numeric|exists:employments,id',
                'm_salary_lower' => 'nullable|numeric',
                'm_salary_upper' => 'nullable|numeric',
                't_salary_lower' => 'nullable|numeric',
                't_salary_upper' => 'nullable|numeric',
                'd_salary_lower' => 'nullable|numeric',
                'd_salary_upper' => 'nullable|numeric',
                'commission_lower' => 'nullable|numeric',
                'commission_upper' => 'nullable|numeric',
                'salary' => '',
                'work_time' => '',
                'job_description' => '',
                'holiday_ids' => 'nullable|array',
                'holiday' => '',
                'welfare' => '',
                'qualification_ids' => 'nullable|array',
                'entry_requirement' => '',
                'catch_copy' => '',
                'recommend_point' => '',
                'salon_message' => '',
                'commitment_term_ids' => 'nullable|array',
                'job_images' => 'nullable|array',
                'job_images.*.image' => 'required',
                'job_images.*.alttext' => '',
                'job_images.*.sort' => 'numeric',
            ]);

            // 最低賃金チェック
            $minimum_wage_alert = self::isUpperMinimumWage(
                $data['employment_id'],
                $data['office_id'],
                isset($data['m_salary_lower']) ? $data['m_salary_lower'] : null,
                isset($data['t_salary_lower']) ? $data['t_salary_lower'] : null,
                isset($data['holiday_ids']) ? $data['holiday_ids'] : [],
                $data['holiday'],
                $data['minimum_wage_ok']
            );

            // 掲載中の場合、有効な契約プランが存在しない場合、エラー
            $contract = self::getActiveContract($data['office_id']);
            if ($data['status'] == 10 && !$contract) {
                return response()->json(['alert' => 1, 'message' => '契約プランが存在しないため、掲載中で求人を作成できません。'], 422);
            }
            // 掲載開始日、終了日の設定
            if ($data['status'] == 10) {
                $data['publish_start_date'] = date('Y-m-d H:i:s');
                $data['publish_end_date'] = null;
            }

            DB::transaction(function () use ($data, $contract) {
                // 求人登録
                $job = Job::create($data);

                // 求人一括設定画像登録
                if (isset($data['job_images']) && is_array($data['job_images'])) {
                    foreach ($data['job_images'] as $job_image) {
                        // ファイルアップロード
                        $job_image['image'] = UploadImage::uploadImageFile(
                            $job_image['image'],
                            config('uploadimage.job_image_storage'),
                            $job->id
                        );
                        // データベースへ登録
                        $job->jobImages()->create($job_image);
                    }
                }

                // 求人こだわり条件
                if (isset($data['commitment_term_ids']) && is_array($data['commitment_term_ids']) && count($data['commitment_term_ids']) > 0) {
                    foreach ($data['commitment_term_ids'] as $commitment_term_id) {
                        JobCommitmentTerm::create([
                            'job_id' => $job->id,
                            'commitment_term_id' => $commitment_term_id,
                        ]);
                    }
                }
                
                // 求人休日
                if (isset($data['holiday_ids']) && is_array($data['holiday_ids']) && count($data['holiday_ids']) > 0) {
                    foreach ($data['holiday_ids'] as $holiday_id) {
                        JobHoliday::create([
                            'job_id' => $job->id,
                            'holiday_id' => $holiday_id,
                        ]);
                    }
                }

                // 求人資格
                if (isset($data['qualification_ids']) && is_array($data['qualification_ids']) && count($data['qualification_ids']) > 0) {
                    foreach ($data['qualification_ids'] as $qualification_id) {
                        JobQualification::create([
                            'job_id' => $job->id,
                            'qualification_id' => $qualification_id,
                        ]);
                    }
                }

                // 掲載中にした場合、まだ開始していない契約プランの開始日および終了日を設定
                if ($data['status'] == 10) {
                    if (is_null($contract->start_date) || is_null($contract->end_plan_date)) {
                        Contract::where('id', $contract->contract_id)
                            ->update([
                                'start_date' => date('Y-m-d'),
                                'end_plan_date' => date("Y-m-d", strtotime("YYYY-mm-dd +{$contract->term} month +1 day")), // 開始した日付は除くため、+1日
                            ]);
                    }
                }

                // TODO IndexingAPI送信
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 求人データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'office_id' => 'numeric|exists:offices,id',
                'status' => 'numeric',
                'pickup' => 'numeric',
                'private' => 'numeric',
                'recommend' => 'numeric',
                'indeed_private' => 'numeric',
                'minimum_wage_ok' => 'numeric',
                'job_category_id' => 'numeric|exists:job_categories,id',
                'position_id' => 'numeric|exists:positions,id',
                'employment_id' => 'numeric|exists:employments,id',
                'm_salary_lower' => 'nullable|numeric',
                'm_salary_upper' => 'nullable|numeric',
                't_salary_lower' => 'nullable|numeric',
                't_salary_upper' => 'nullable|numeric',
                'd_salary_lower' => 'nullable|numeric',
                'd_salary_upper' => 'nullable|numeric',
                'commission_lower' => 'nullable|numeric',
                'commission_upper' => 'nullable|numeric',
                'salary' => '',
                'work_time' => '',
                'job_description' => '',
                'holiday_ids' => 'nullable|array',
                'holiday' => '',
                'welfare' => '',
                'qualification_ids' => 'nullable|array',
                'entry_requirement' => '',
                'catch_copy' => '',
                'recommend_point' => '',
                'salon_message' => '',
                'commitment_term_ids' => 'nullable|array',
                'job_images' => 'nullable|array',
                'job_images.*.id' => '',
                'job_images.*.image' => 'required',
                'job_images.*.alttext' => '',
                'job_images.*.sort' => 'numeric',
            ]);

            $job = Job::findOrFail($id);

            // 最低賃金のチェック
            $minimum_wage_alert = self::isUpperMinimumWage(
                $data['employment_id'],
                $data['office_id'],
                isset($data['m_salary_lower']) ? $data['m_salary_lower'] : null,
                isset($data['t_salary_lower']) ? $data['t_salary_lower'] : null,
                isset($data['holiday_ids']) ? $data['holiday_ids'] : [],
                $data['holiday'],
                $data['minimum_wage_ok']
            );

            // 掲載中の場合、有効な契約プランが存在しない場合、エラー
            $contract = self::getActiveContract($data['office_id']);
            if ($data['status'] == 10 && !$contract) {
                return response()->json(['alert' => 1, 'message' => '契約プランが存在しないため、掲載中で求人を作成できません。'], 422);
            }

            // 掲載開始日、終了日の設定
            if ($data['status'] == 10 && $job->status != 10) {
                $data['publish_start_date'] = date('Y-m-d H:i:s');
                $data['publish_end_date'] = null;
            } else if ($data['status'] != 10 && $job->status == 10) {
                $data['publish_end_date'] = date('Y-m-d H:i:s');
            }

            DB::transaction(function () use ($job, $data, $id, $contract) {
                // 求人情報更新
                $job->update($data);

                // 求人一括設定画像
                self::updateJobImage($job, isset($data['job_images']) ? $data['job_images'] : null);

                // 求人こだわり条件
                if (isset($data['commitment_term_ids']) && is_array($data['commitment_term_ids']) && count($data['commitment_term_ids']) > 0) {
                    // 入力があったID以外は削除
                    JobCommitmentTerm::where('job_id', $id)
                        ->whereNotIn('commitment_term_id', $data['commitment_term_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['commitment_term_ids'] as $commitment_term_id) {
                        $count = JobCommitmentTerm::where('job_id', $id)
                            ->where('commitment_term_id', $commitment_term_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'commitment_term_id' => $commitment_term_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $job->jobCommitmentTerms()->createMany($insert_data);
                    }
                } else {
                    $job->jobCommitmentTerms()->delete();
                }

                // 求人休日
                if (isset($data['holiday_ids']) && is_array($data['holiday_ids']) && count($data['holiday_ids']) > 0) {
                    // 入力があったID以外は削除
                    JobHoliday::where('job_id', $id)
                        ->whereNotIn('holiday_id', $data['holiday_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['holiday_ids'] as $holiday_id) {
                        $count = JobHoliday::where('job_id', $id)
                            ->where('holiday_id', $holiday_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'holiday_id' => $holiday_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $job->jobHolidays()->createMany($insert_data);
                    }
                } else {
                    $job->jobHolidays()->delete();
                }

                // 求人資格
                if (isset($data['qualification_ids']) && is_array($data['qualification_ids']) && count($data['qualification_ids']) > 0) {
                    // 入力があったID以外は削除
                    JobQualification::where('job_id', $id)
                        ->whereNotIn('qualification_id', $data['qualification_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['qualification_ids'] as $qualification_id) {
                        $count = JobQualification::where('job_id', $id)
                            ->where('qualification_id', $qualification_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'qualification_id' => $qualification_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $job->jobQualifications()->createMany($insert_data);
                    }
                } else {
                    $job->jobQualifications()->delete();
                }

                // 掲載中にした場合、まだ開始していない契約プランの開始日および終了日を設定
                if ($data['status'] == 10) {
                    if (is_null($contract->start_date) || is_null($contract->end_plan_date)) {
                        Contract::where('id', $contract->contract_id)
                            ->update([
                                'start_date' => date('Y-m-d'),
                                'end_plan_date' => date("Y-m-d", strtotime("+{$contract->term} month +1 day")), // 開始した日付は除くため、+1日
                            ]);
                    }
                }

                // TODO IndexingAPI送信
            });

            return response()->json([
                'result' => 'ok',
                'message' => $minimum_wage_alert !== true ? $minimum_wage_alert : '',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 求人データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $job = Job::find($id);
            if (!$job) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($job) {
                // 求人削除
                // 関連データは削除しない
                $job->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Job not found'], 404);
        }
    }

    /**
     * 求人データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 求人削除
                // 関連データは削除しない
                $deleted_count = Job::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more jobs not found'], 404);
        }
    }

    /**
     * 求人一括設定画像更新処理
     */
    private function updateJobImage($job, $job_images)
    {
        if (isset($job_images) && is_array($job_images)) {
            // 入力があったID以外は削除
            $ids = array_column($job_images, 'id');
            $ids = array_filter($ids, function ($val) {
                return !(is_null($val) || $val === "");
            });
            $delete_query = JobImage::where('job_id', $job->id);
            if (count($ids) > 0) {
                $delete_query = $delete_query->whereNotIn('id', $ids);
            }
            $delete_data = $delete_query->get();
            foreach ($delete_data as $row) {
                UploadImage::deleteImageFile(
                    $row->image,
                    config('uploadimage.job_image_storage'),
                    $job->id
                );
                $row->delete();
            }

            foreach ($job_images as $job_image) {
                if (isset($job_image['id']) && !empty($job_image['id'])) {
                    // 登録済みのデータは更新
                    $registered_data = JobImage::find($job_image['id']);
                    if (is_string($job_image['image'])) {
                        // 文字列の場合は画像変更していないため、説明、ソート順が変更されている場合のみ更新
                        if ($registered_data->alttext != $job_image['alttext']
                            || $registered_data->sort != $job_image['sort']) {
                            $registered_data->update([
                                'alttext' => $job_image['alttext'],
                                'sort' => $job_image['sort'],
                            ]);
                        }
                    } else {
                        // ファイル形式の場合は画像変更しているため、更新
                        // ファイルアップロード
                        $job_image['image'] = UploadImage::uploadImageFile(
                            $job_image['image'],
                            config('uploadimage.job_image_storage'),
                            $job->id,
                            $registered_data->image
                        );
                        // データベースに保存
                        $registered_data->update([
                            'image' => $job_image['image'],
                            'alttext' => $job_image['alttext'],
                            'sort' => $job_image['sort'],
                        ]);
                    }
                } else {
                    // 未登録データは登録
                    // ファイルアップロード
                    $job_image['image'] = UploadImage::uploadImageFile(
                        $job_image['image'],
                        config('uploadimage.job_image_storage'),
                        $job->id
                    );
                    // データベースへ登録
                    $job->jobImages()->create($job_image);
                }
            }
        } else {
            // 全くない場合は全削除
            foreach ($job->jobImages as $job_image) {
                UploadImage::deleteImageFile(
                    $job_image->image,
                    config('uploadimage.job_image_storage'),
                    $job->id
                );
            }
            $job->jobImages()->delete();
        }
    }

    /**
     * 有効な契約プランを取得
     */
    private function getActiveContract($office_id)
    {
        $contract = Office::join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
            ->join('plans', 'contracts.plan_id', '=', 'plans.id')
            ->whereNull('corporations.deleted_at')
            ->where('offices.id', $office_id)
            ->where('contracts.expire', 0)
            ->select(
                'contracts.id as contract_id',
                'contracts.corporation_id',
                'contracts.plan_id',
                'contracts.start_date',
                'contracts.end_date',
                'contracts.end_plan_date',
                'plans.term',
            )
            ->orderBy('contracts.id')
            ->first();
        return $contract;
    }

    /**
     * 最低賃金チェック
     */
    private function isUpperMinimumWage($employment_id, $office_id, $m_salary_lower, $t_salary_lower, $holiday_ids, $holiday, $minimum_wage_ok)
    {
        // 最低賃金チェックをしないにチェックがある場合、チェックしない
        if ($minimum_wage_ok) return true;
        // 業務委託・フリーランス or 紹介・派遣の場合、チェックしない
        if (in_array($employment_id, ['4', '5'])) return true;
        // 該当の都道府県の最低賃金を取得
        $office = Office::find($office_id);
        if (!$office) return true;
        $prefecture = $office->prefecture;
        if (!$prefecture) return true;

        if (in_array($employment_id, ['1', '2'])) {
            // 正社員（中途）or 正社員（新卒）の場合
            if (!$m_salary_lower) return true;
            // 休日数を算出
            $holiday_count = 0;
            if (in_array('2', $holiday_ids)) {
                $holiday_count = preg_match('/完全週休2日/', $holiday) ? 9 : 8;
            } else if (in_array('1', $holiday_ids)) {
                $holiday_count = preg_match('/完全週休2日/', $holiday) ? 8 : 6;
            } else {
                if (preg_match('/完全週休2日/', $holiday)) {
                    $holiday_count = 8;
                } else if (preg_match('/隔週休2日/', $holiday)) {
                    $holiday_count = 6;
                } else if (preg_match('/週休2日/', $holiday)) {
                    $holiday_count = 5;
                } else if (preg_match('/4週(\d+)休/', $holiday, $match)) {
                    $holiday_count = $match[1];
                } else if (preg_match('/月(\d+)日休み/', $holiday, $match)) {
                    $holiday_count = $match[1];
                } else if (preg_match('/月(\d+)日〜/', $holiday, $match)) {
                    $holiday_count = $match[1];
                } else if (preg_match('/月(\d+)〜/', $holiday, $match)) {
                    $holiday_count = $match[1];
                } else {
                    return '休日数が算出できません。休日か休日メモを入力してください。';
                }
            }
            \Log::debug("休日数：{$holiday_count}");
            // 休日数から稼働時間を算出
            $operating_time = (31 - intval($holiday_count)) * 8;
            \Log::debug("稼働時間：{$operating_time}");
            // 月給÷稼働時間と最低賃金をチェック
            $t_salary = round($m_salary_lower / $operating_time, 2);
            if ($t_salary < $prefecture->minimum_wage) {
                return "最低賃金を下回っています。（{$prefecture->name}の最低賃金：{$prefecture->minimum_wage}円、休日数：{$holiday_count}、稼働時間：{$operating_time}時間、月給を時給変換：{$t_salary}円）";
            }
        } else if (in_array($employment_id, ['3'])) {
            // 契約社員・パートの場合、時給下限と比較
            if (!$t_salary_lower) return true;
            if ($t_salary_lower < $prefecture->minimum_wage) {
                return "最低賃金を下回っています。（{$prefecture->name}の最低賃金：{$prefecture->minimum_wage}円）";
            }
        }

        return true;
    }
}
