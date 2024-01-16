<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\ApplicantQualification;
use App\Models\ApplicantLpJobCategory;
use App\Models\ApplicantProposalDatetime;
use App\Models\ApplicantContactHistory;
use App\Library\RegisterRoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ApplicantController extends Controller
{
    /**
     * 応募者データ一覧取得
     */
    public function index(Request $request)
    {
        $query = Applicant::join('jobs', function ($join) {
                $join->on('applicants.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->join('prefectures as office_prefectures', 'offices.prefecture_id', '=', 'office_prefectures.id')
            ->join('prefectures', 'applicants.prefecture_id', '=', 'prefectures.id')
            ->join('employments', 'applicants.employment_id', '=', 'employments.id')
            ->join('prefectures as emp_prefectures', 'applicants.emp_prefecture_id', '=', 'emp_prefectures.id');

        // 検索条件指定
        if ($request->corporation_name) {
            $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
        }
        if ($request->office_name) {
            $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
        }
        if ($request->name) {
            $query = $query->where('applicants.name', 'LIKE', '%' . $request->name . '%');
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query->leftJoin('members', function ($join) {
                $join->on('applicants.member_id', '=', 'members.id')
                    ->whereNull('members.deleted_at');
            })
            ->leftJoin('conversion_histories', 'applicants.id', '=', 'conversion_histories.applicant_id')
            ->groupBy('applicants.id')
            ->select(
                'applicants.id',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'jobs.office_id',
                'offices.name as office_name',
                'offices.prefecture_id as office_prefecture_id',
                'office_prefectures.name as office_prefecture_name',
                'applicants.job_id',
                'jobs.name as job_name',
                'jobs.recommend as job_recommend',
                'applicants.status',
                'applicants.proposal_type',
                'applicants.name',
                'applicants.name_kana',
                'applicants.birthyear',
                'applicants.postcode',
                'applicants.prefecture_id',
                'prefectures.name as prefecture_name',
                'applicants.address',
                'applicants.phone',
                'applicants.mail',
                'applicants.change_time',
                'applicants.retirement_time',
                'applicants.employment_id',
                'employments.name as employment_name',
                'applicants.emp_prefecture_id',
                'emp_prefectures.name as emp_prefecture_name',
                'applicants.note',
                'applicants.created_at',
                DB::raw('max(conversion_histories.utm_source) as utm_source'),
                DB::raw('max(conversion_histories.utm_medium) as utm_medium'),
                DB::raw('max(conversion_histories.utm_campaign) as utm_campaign'),
                DB::raw('max(members.created_at) as member_created_at'),
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $applicants = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        foreach ($applicants as $a) {
            $a->status_name = Applicant::STATUS[$a->status];
            $a->job_recommend_name = $a->job_recommend ? '人材紹介' : '';
            $a->proposal_type_name = $a->proposal_type ? Applicant::PROPOSAL_TYPE[$a->proposal_type] : "";
            $a->change_time_name = $a->change_time ? Applicant::CHANGE_TIME[$a->change_time] : "";
            $a->retirement_time_name = $a->retirement_time ? Applicant::RETIREMENT_TIME[$a->retirement_time] : "";
            $a->register_root = RegisterRoot::getApplicantRegisterRootByUtmParams($a->utm_source, $a->utm_medium, $a->utm_campaign, $a->member_created_at, $a->created_at, true);
        }
        return response()->json(['applicants' => $applicants, 'applicants_count' => $count]);
    }

    /**
     * 応募データCSVダウンロード
     */
    public function downloadCsv(Request $request)
    {
        // CSVファイル作成コールバック
        $callback = function () use ($request) {
            // CSVファイル作成
            $csv = fopen('php://output', 'w');

            // CSVヘッダ
            $columns = [
                'office_name' => 'サロン名',
                'applicant_date' => '応募日',
                'proposal_type' => '申込種類',
                'proposal_datetime' => '希望日時',
                'status' => '状態',
                'name' => '氏名',
                'name_kana' => 'カナ名',
                'birthyear' => '生まれ年',
                'postcode' => '郵便番号',
                'prefecture' => '都道府県',
                'address' => '住所',
                'phone' => '電話番号',
                'mail' => 'メールアドレス',
                'change_time' => '希望転職時期',
                'retirement_time' => '退職意向',
                'employment' => '希望勤務体系',
                'emp_prefecture' => '希望勤務地',
                'qualification' => '保有資格',
                'lp_job_category' => '希望職種',
                'register_root' => '登録経路',
                'note' => '備考',
            ];
            // SJIS変換
            if ($request->char_code == 'ShiftJIS') {
                mb_convert_variables('SJIS-win', 'UTF-8', $columns);
            }
            // ヘッダを追加
            fputcsv($csv, $columns);

            // CSVデータ
            $query = Applicant::join('jobs', function ($join) {
                    $join->on('applicants.job_id', '=', 'jobs.id')
                        ->whereNull('jobs.deleted_at');
                })
                ->join('offices', function ($join) {
                    $join->on('jobs.office_id', '=', 'offices.id')
                        ->whereNull('offices.deleted_at');
                })
                ->join('corporations', function ($join) {
                    $join->on('offices.corporation_id', '=', 'corporations.id')
                        ->whereNull('corporations.deleted_at');
                })
                ->join('prefectures as office_prefectures', 'offices.prefecture_id', '=', 'office_prefectures.id')
                ->join('prefectures', 'applicants.prefecture_id', '=', 'prefectures.id')
                ->join('employments', 'applicants.employment_id', '=', 'employments.id')
                ->join('prefectures as emp_prefectures', 'applicants.emp_prefecture_id', '=', 'emp_prefectures.id');

            // 検索条件指定
            if ($request->corporation_name) {
                $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
            }
            if ($request->office_name) {
                $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
            }
            if ($request->name) {
                $query = $query->where('applicants.name', 'LIKE', '%' . $request->name . '%');
            }

            // 選択チェック指定
            if ($request->applicant_ids) {
                $applicant_ids = is_array($request->applicant_ids) ? $request->applicant_ids : explode(',', $request->applicant_ids);
                $query = $query->whereIn('applicants.id', $applicant_ids);
            }
            // データ取得
            $applicants = $query->leftJoin('members', function ($join) {
                    $join->on('applicants.member_id', '=', 'members.id')
                        ->whereNull('members.deleted_at');
                })
                ->leftJoin('conversion_histories', 'applicants.id', '=', 'conversion_histories.applicant_id')
                ->groupBy('applicants.id')
                ->select(
                    'applicants.id',
                    'offices.name as office_name',
                    'applicants.created_at',
                    'applicants.proposal_type',
                    'applicants.status',
                    'applicants.name',
                    'applicants.name_kana',
                    'applicants.birthyear',
                    'applicants.postcode',
                    'prefectures.name as prefecture_name',
                    'applicants.address',
                    'applicants.phone',
                    'applicants.mail',
                    'applicants.change_time',
                    'applicants.retirement_time',
                    'employments.name as employment_name',
                    'emp_prefectures.name as emp_prefecture_name',
                    'applicants.note',
                    DB::raw('max(conversion_histories.utm_source) as utm_source'),
                    DB::raw('max(conversion_histories.utm_medium) as utm_medium'),
                    DB::raw('max(conversion_histories.utm_campaign) as utm_campaign'),
                    DB::raw('max(members.created_at) as member_created_at'),
                )
                ->orderBy('applicants.id', 'desc')
                ->get();

            // 関連情報を取得
            $applicant_ids = array_column($applicants->toArray(), 'id');
            // 保有資格
            $applicant_qualifications = ApplicantQualification::join('qualifications', 'applicant_qualifications.qualification_id', '=', 'qualifications.id')
                ->whereIn('applicant_qualifications.applicant_id', $applicant_ids)
                ->select(
                    'applicant_qualifications.applicant_id',
                    'qualifications.name',
                )
                ->get();
            // 希望職種
            $applicant_lp_job_categories = ApplicantLpJobCategory::join('lp_job_categories', 'applicant_lp_job_categories.lp_job_category_id', '=', 'lp_job_categories.id')
                ->whereIn('applicant_lp_job_categories.applicant_id', $applicant_ids)
                ->select(
                    'applicant_lp_job_categories.applicant_id',
                    'lp_job_categories.name',
                )
                ->get();
            // 連絡可能日時
            $applicant_proposal_datetimes = ApplicantProposalDatetime::whereIn('applicant_proposal_datetimes.applicant_id', $applicant_ids)
                ->select(
                    'applicant_proposal_datetimes.applicant_id',
                    'applicant_proposal_datetimes.number',
                    'applicant_proposal_datetimes.date',
                    'applicant_proposal_datetimes.time_am',
                    'applicant_proposal_datetimes.time_12_14',
                    'applicant_proposal_datetimes.time_14_16',
                    'applicant_proposal_datetimes.time_16_18',
                    'applicant_proposal_datetimes.time_18_20',
                    'applicant_proposal_datetimes.time_all',
                )
                ->get();

            foreach ($applicants as $a) {
                // 保有資格の整形
                $qualification_list = [];
                foreach ($applicant_qualifications as $qualification) {
                    if ($qualification->applicant_id != $a->id) {
                        continue;
                    }
                    $qualification_list[] = $qualification->name;
                }
                // 希望職種の整形
                $lp_job_category_list = [];
                foreach ($applicant_lp_job_categories as $lp_job_category) {
                    if ($lp_job_category->applicant_id != $a->id) {
                        continue;
                    }
                    $lp_job_category_list[] = $lp_job_category->name;
                }
                // 連絡可能日時の整形
                $proposal_datetimes_list = [];
                foreach ($applicant_proposal_datetimes as $proposal_datetime) {
                    if ($proposal_datetime->applicant_id != $a->id) {
                        continue;
                    }
                    $times = [];
                    if ($proposal_datetime->time_am == 1) {
                        $times[] = '午前中';
                    }
                    if ($proposal_datetime->time_12_14 == 1) {
                        $times[] = '12時～14時';
                    }
                    if ($proposal_datetime->time_14_16 == 1) {
                        $times[] = '14時～16時';
                    }
                    if ($proposal_datetime->time_16_18 == 1) {
                        $times[] = '16時～18時';
                    }
                    if ($proposal_datetime->time_18_20 == 1) {
                        $times[] = '18時～20時';
                    }
                    if ($proposal_datetime->time_all == 1) {
                        $times[] = '終日可';
                    }
                    $proposal_datetimes_list[] = '第' . $proposal_datetime->number . '希望：' . date('Y/m/d', strtotime($proposal_datetime->date)) . ' ' . implode('、', $times);
                }

                $applicant_data = [
                    'office_name' => $a->office_name,
                    'applicant_date' => date('Y/m/d H:i:s', strtotime($a->created_at)),
                    'proposal_type' => $a->proposal_type ? Applicant::PROPOSAL_TYPE[$a->proposal_type] : "",
                    'proposal_datetime' => implode("\n", $proposal_datetimes_list),
                    'status' => Applicant::STATUS[$a->status],
                    'name' => $a->name,
                    'name_kana' => $a->name_kana,
                    'birthyear' => $a->birthyear,
                    'postcode' => $a->postcode,
                    'prefecture' => $a->prefecture_name,
                    'address' => $a->address,
                    'phone' => $a->phone,
                    'mail' => $a->mail,
                    'change_time' => $a->change_time ? Applicant::CHANGE_TIME[$a->change_time] : "",
                    'retirement_time' => $a->retirement_time ? Applicant::RETIREMENT_TIME[$a->retirement_time] : "",
                    'employment' => $a->employment_name,
                    'emp_prefecture' => $a->emp_prefecture_name,
                    'qualification' => implode('|', $qualification_list),
                    'lp_job_category' => implode('|', $lp_job_category_list),
                    'register_root' => RegisterRoot::getApplicantRegisterRootByUtmParams($a->utm_source, $a->utm_medium, $a->utm_campaign, $a->member_created_at, $a->created_at, true),
                    'note' => $a->note,
                ];
                // SJIS変換
                if ($request->char_code == 'ShiftJIS') {
                    mb_convert_variables('SJIS-win', 'UTF-8', $applicant_data);
                }
                // CSVファイルのデータを追加
                fputcsv($csv, $applicant_data);
            }

            // CSV閉じる
            fclose($csv);
        };

        // ファイル名
        $filename = 'applicants-' . date('Y-m-d') . '.csv';

        // レスポンスヘッダー情報
        $response_header = [
            'Content-type' => 'text/csv',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ];

        return response()->streamDownload($callback, $filename, $response_header);
    }

    /**
     * 応募データ取得
     */
    public function show($id)
    {
        try {
            $applicant = Applicant::find($id);
            if (!$applicant) {
                throw new ModelNotFoundException();
            }

            $applicant['job_name'] = $applicant->job->name;
            $applicant['job_recommend_name'] = $applicant->job->recommend ? '人材紹介' : '';
            $applicant['office_id'] = $applicant->job->office_id;
            $applicant['office_name'] = $applicant->job->office->name;
            $applicant['office_prefecture_id'] = $applicant->job->office->prefecture_id;
            $applicant['office_prefecture_name'] = $applicant->job->office->prefecture->name;
            $applicant['corporation_id'] = $applicant->job->office->corporation_id;
            $applicant['corporation_name'] = $applicant->job->office->corporation->name;
            $applicant['prefecture_name'] = $applicant->prefecture->name;
            $applicant['employment_name'] = $applicant->employment->name;
            $applicant['emp_prefecture_name'] = $applicant->empPrefecture->name;
            $applicant['status_name'] = Applicant::STATUS[$applicant->status];
            $applicant['proposal_type_name'] = $applicant->proposal_type ? Applicant::PROPOSAL_TYPE[$applicant->proposal_type] : "";
            $applicant['change_time_name'] = $applicant->change_time ? Applicant::CHANGE_TIME[$applicant->change_time] : "";
            $applicant['retirement_time_name'] = $applicant->retirement_time ? Applicant::RETIREMENT_TIME[$applicant->retirement_time] : "";
        
            // 応募者資格
            $applicant_qualifications = $applicant->qualifications->toArray();
            $applicant['qualification_ids'] = array_column($applicant_qualifications, 'id');
            $applicant['qualification_names'] = array_column($applicant_qualifications, 'name');

            // 応募者LP職種
            $applicant_lp_job_categories = $applicant->lpJobCategories->toArray();
            $applicant['lp_job_category_ids'] = array_column($applicant_lp_job_categories, 'id');
            $applicant['lp_job_category_names'] = array_column($applicant_lp_job_categories, 'name');
 
            // 応募者コンタクト履歴
            $applicant['applicant_contact_histories'] = $applicant->applicantContactHistories;

            // 応募者連絡可能日時
            $applicant['applicant_proposal_datetimes'] = $applicant->applicantProposalDatetimes;
            $applicant['applicant_proposal_datetimes_text'] = $applicant->applicantProposalDatetimesText();
 
             // 登録経路
            $conversion_histories = $applicant->conversionHistories;
            foreach ($conversion_histories as $cvh) {
                $applicant['register_root'] = RegisterRoot::getApplicantRegisterRootByUtmParams(
                    $cvh->utm_source,
                    $cvh->utm_medium,
                    $cvh->utm_campaign,
                    $applicant->member ? $applicant->member->member_created_at : null,
                    $applicant->created_at,
                    true
                );
                break;
            }

            return response()->json(['applicant' => $applicant]);            
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Applicant not found'], 404);
        }
    }

    /**
     * 応募者データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'status' => 'numeric',
                'applicant_contact_histories' => 'nullable|array',
                'applicant_contact_histories.*.id' => '',
                'applicant_contact_histories.*.contact_date' => 'required|date',
                'applicant_contact_histories.*.contact_memo' => 'required|string',
            ]);

            DB::transaction(function () use ($data, $id) {
                $applicant = Applicant::findOrFail($id);
                $applicant->update($data);

                // 応募コンタクト履歴
                if (isset($data['applicant_contact_histories']) && is_array($data['applicant_contact_histories'])) {
                    // 入力があったID以外は削除
                    $ids = array_column($data['applicant_contact_histories'], 'id');
                    $ids = array_filter($ids, function ($val) {
                        return !(is_null($val) || $val === "");
                    });
                    if (count($ids) > 0) {
                        ApplicantContactHistory::where('applicant_id', $id)
                            ->whereNotIn('id', $ids)
                            ->delete();
                    } else {
                        $applicant->applicantContactHistories()->delete();
                    }
                    
                    // 入力があったデータは登録or更新
                    foreach ($data['applicant_contact_histories'] as $applicant_contact_history) {
                        if (isset($applicant_contact_history['id']) && !empty($applicant_contact_history['id'])) {
                            // 登録済みのデータは更新
                            ApplicantContactHistory::where('id', $applicant_contact_history['id'])
                                ->update([
                                    'contact_date' => $applicant_contact_history['contact_date'],
                                    'contact_memo' => $applicant_contact_history['contact_memo'],
                                ]);
                        } else {
                            // 未登録データは登録
                            $applicant->applicantContactHistories()->create($applicant_contact_history);
                        }
                    }
                } else {
                    $applicant->applicantContactHistories()->delete();
                }
            });
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422); 
        }
    }
}
