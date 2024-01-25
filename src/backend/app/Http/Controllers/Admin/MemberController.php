<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Library\LatLngAddress;
use App\Models\Member;
use App\Models\MemberQualification;
use App\Models\MemberLpJobCategory;
use App\Models\MemberProposalDatetime;
use App\Models\Applicant;
use App\Library\RegisterRoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    /**
     * 会員データ一覧取得
     */
    public function index(Request $request)
    {
        $query = Member::join('prefectures', 'members.prefecture_id', '=', 'prefectures.id')
            ->join('employments', 'members.employment_id', '=', 'employments.id')
            ->join('prefectures as emp_prefectures', 'members.emp_prefecture_id', '=', 'emp_prefectures.id');

        // 検索条件指定
        if ($request->name) {
            $query = $query->where('members.name', 'LIKE', '%' . $request->name . '%');
        }
        if ($request->email) {
            $query = $query->where('members.email', 'LIKE', '%' . $request->email . '%');
        }
        if ($request->phone) {
            $query = $query->where('members.phone', 'LIKE', '%' . $request->phone . '%');
        }
        if ($request->emp_prefecture_id) {
            $emp_prefecture_id = is_array($request->emp_prefecture_id) ? $request->emp_prefecture_id : explode(',', $request->emp_prefecture_id);
            $query = $query->whereIn('members.emp_prefecture_id', $emp_prefecture_id);
        }
        if ($request->register_site) {
            $register_site = is_array($request->register_site) ? $request->register_site : explode(',', $request->register_site);
            $query = $query->whereIn('members.register_site', $register_site);
        }
        if ($request->register_form) {
            $register_form = is_array($request->register_form) ? $request->register_form : explode(',', $request->register_form);
            $query = $query->whereIn('members.register_form', $register_form);
        }
        if ($request->introduction_gift_status) {
            $introduction_gift_status = is_array($request->introduction_gift_status) ? $request->introduction_gift_status : explode(',', $request->introduction_gift_status);
            $query = $query->whereIn('members.introduction_gift_status', $introduction_gift_status);
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query->leftJoin('jobs', function ($join) {
                $join->on('members.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->leftJoin('members as introduction_members', function ($join) {
                $join->on('members.introduction_member_id', '=', 'introduction_members.id')
                    ->whereNull('introduction_members.deleted_at');
            })
            ->leftJoin('applicants', function ($join) {
                $join->on('members.id', '=', 'applicants.member_id')
                    ->whereNull('applicants.deleted_at');
            })
            ->leftJoin('conversion_histories', 'members.id', '=', 'conversion_histories.member_id')
            ->groupBy('members.id')
            ->select(
                'members.id',
                'members.name',
                'members.name_kana',
                'members.birthyear',
                'members.postcode',
                'members.prefecture_id',
                'prefectures.name as prefecture_name',
                'members.address',
                'members.phone',
                'members.email',
                'members.job_change_feeling',
                'members.change_time',
                'members.retirement_time',
                'members.employment_id',
                'employments.name as employment_name',
                'members.emp_prefecture_id',
                'emp_prefectures.name as emp_prefecture_name',
                'members.status',
                'members.register_site',
                'members.register_form',
                'members.job_id',
                'jobs.name as job_name',
                'members.introduction_name',
                'members.introduction_member_id',
                'introduction_members.name as introduction_member_name',
                'members.introduction_gift_status',
                DB::raw('count(distinct applicants.id) as applicant_count'),
                DB::raw('max(conversion_histories.utm_source) as utm_source'),
                DB::raw('max(conversion_histories.utm_medium) as utm_medium'),
                DB::raw('max(conversion_histories.utm_campaign) as utm_campaign'),
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $members = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        foreach ($members as $m) {
            $m->job_change_feeling_name = $m->job_change_feeling ? Member::JOB_CHANGE_FEELING[$m->job_change_feeling] : "";
            $m->change_time_name = $m->change_time ? Member::CHANGE_TIME[$m->change_time] : "";
            $m->retirement_time_name = $m->retirement_time ? Member::RETIREMENT_TIME[$m->retirement_time] : "";
            $m->status_name = Member::STATUS[$m->status];
            $m->register_site_name = Member::REGISTER_SITE[$m->register_site];
            $m->register_form_name = Member::REGISTER_FORM[$m->register_form];
            $m->introduction_gift_status_name = Member::INTRODUCTION_GIFT_STATUS[$m->introduction_gift_status];
            $m->register_root = RegisterRoot::getRegisterRootByUtmParams($m->utm_source, $m->utm_medium, $m->utm_campaign, true);
        }
        return response()->json(['members' => $members, 'members_count' => $count]);
    }

    /**
     * 会員データCSVダウンロード
     */
    public function downloadCsv(Request $request)
    {
        // CSVファイル作成コールバック
        $callback = function () use ($request) {
            // CSVファイル作成
            $csv = fopen('php://output', 'w');

            // CSVヘッダ
            $columns = [
                'id' => '会員ID',
                'name' => '氏名',
                'name_kana' => 'カナ名',
                'register_date' => '登録日時',
                'birthyear' => '生まれ年',
                'postcode' => '郵便番号',
                'prefecture' => '都道府県',
                'address' => '住所',
                'phone' => '電話番号',
                'email' => 'メールアドレス',
                'job_change_feeling' => '転職への気持ち',
                'change_time' => '希望転職時期',
                'retirement_time' => '退職意向',
                'employment' => '希望勤務体系',
                'emp_prefecture' => '希望勤務地',
                'qualification' => '保有資格',
                'lp_job_category' => '希望職種',
                'applicant_count' => '応募数',
                'proposal_datetime' => '連絡可能日時',
                'register_site' => '登録サイト',
                'register_form' => '登録フォーム',
                'register_root' => '登録経路',
                'introduction_name' => '紹介者氏名（フォームでの入力値）',
                'introduction_member' => '紹介者会員情報',
                'introduction_gift_status' => '紹介プレゼントステータス',
            ];
            // SJIS変換
            if ($request->char_code == 'ShiftJIS') {
                mb_convert_variables('SJIS-win', 'UTF-8', $columns);
            }
            // ヘッダを追加
            fputcsv($csv, $columns);

            // CSVデータ
            $query = Member::join('prefectures', 'members.prefecture_id', '=', 'prefectures.id')
                ->join('employments', 'members.employment_id', '=', 'employments.id')
                ->join('prefectures as emp_prefectures', 'members.emp_prefecture_id', '=', 'emp_prefectures.id');
            // 検索条件指定
            if ($request->name) {
                $query = $query->where('members.name', 'LIKE', '%' . $request->name . '%');
            }
            if ($request->email) {
                $query = $query->where('members.email', 'LIKE', '%' . $request->email . '%');
            }
            if ($request->phone) {
                $query = $query->where('members.phone', 'LIKE', '%' . $request->phone . '%');
            }
            if ($request->emp_prefecture_id) {
                $emp_prefecture_id = is_array($request->emp_prefecture_id) ? $request->emp_prefecture_id : explode(',', $request->emp_prefecture_id);
                $query = $query->whereIn('members.emp_prefecture_id', $emp_prefecture_id);
            }
            if ($request->register_site) {
                $register_site = is_array($request->register_site) ? $request->register_site : explode(',', $request->register_site);
                $query = $query->whereIn('members.register_site', $register_site);
            }
            if ($request->register_form) {
                $register_form = is_array($request->register_form) ? $request->register_form : explode(',', $request->register_form);
                $query = $query->whereIn('members.register_form', $register_form);
            }
            if ($request->introduction_gift_status) {
                $introduction_gift_status = is_array($request->introduction_gift_status) ? $request->introduction_gift_status : explode(',', $request->introduction_gift_status);
                $query = $query->whereIn('members.introduction_gift_status', $introduction_gift_status);
            }

            // 選択チェック指定
            if ($request->member_ids) {
                $member_ids = is_array($request->member_ids) ? $request->member_ids : explode(',', $request->member_ids);
                $query = $query->whereIn('members.id', $member_ids);
            }
            // データ取得
            $members = $query->leftJoin('members as introduction_members', function ($join) {
                    $join->on('members.introduction_member_id', '=', 'introduction_members.id')
                        ->whereNull('introduction_members.deleted_at');
                })
                ->leftJoin('applicants', function ($join) {
                    $join->on('members.id', '=', 'applicants.member_id')
                        ->whereNull('applicants.deleted_at');
                })
                ->leftJoin('conversion_histories', 'members.id', '=', 'conversion_histories.member_id')
                ->groupBy('members.id')
                ->select(
                    'members.id',
                    'members.name',
                    'members.name_kana',
                    'members.created_at',
                    'members.birthyear',
                    'members.postcode',
                    'prefectures.name as prefecture_name',
                    'members.address',
                    'members.phone',
                    'members.email',
                    'members.job_change_feeling',
                    'members.change_time',
                    'members.retirement_time',
                    'employments.name as employment_name',
                    'emp_prefectures.name as emp_prefecture_name',
                    'members.register_site',
                    'members.register_form',
                    'members.introduction_name',
                    'members.introduction_member_id',
                    'introduction_members.name as introduction_member_name',
                    'members.introduction_gift_status',
                    DB::raw('count(distinct applicants.id) as applicant_count'),
                    DB::raw('max(conversion_histories.utm_source) as utm_source'),
                    DB::raw('max(conversion_histories.utm_medium) as utm_medium'),
                    DB::raw('max(conversion_histories.utm_campaign) as utm_campaign'),
                )
                ->orderBy('members.id', 'desc')
                ->get();

            // 関連情報を取得
            $member_ids = array_column($members->toArray(), 'id');
            // 保有資格
            $member_qualifications = MemberQualification::join('qualifications', 'member_qualifications.qualification_id', '=', 'qualifications.id')
                ->whereIn('member_qualifications.member_id', $member_ids)
                ->select(
                    'member_qualifications.member_id',
                    'qualifications.name',
                )
                ->get();
            // 希望職種
            $member_lp_job_categories = MemberLpJobCategory::join('lp_job_categories', 'member_lp_job_categories.lp_job_category_id', '=', 'lp_job_categories.id')
                ->whereIn('member_lp_job_categories.member_id', $member_ids)
                ->select(
                    'member_lp_job_categories.member_id',
                    'lp_job_categories.name',
                )
                ->get();
            // 連絡可能日時
            $member_proposal_datetimes = MemberProposalDatetime::whereIn('member_proposal_datetimes.member_id', $member_ids)
                ->select(
                    'member_proposal_datetimes.member_id',
                    'member_proposal_datetimes.number',
                    'member_proposal_datetimes.date',
                    'member_proposal_datetimes.time_am',
                    'member_proposal_datetimes.time_12_14',
                    'member_proposal_datetimes.time_14_16',
                    'member_proposal_datetimes.time_16_18',
                    'member_proposal_datetimes.time_18_20',
                    'member_proposal_datetimes.time_all',
                )
                ->get();

            foreach ($members as $m) {
                // 保有資格の整形
                $qualification_list = [];
                foreach ($member_qualifications as $qualification) {
                    if ($qualification->member_id != $m->id) {
                        continue;
                    }
                    $qualification_list[] = $qualification->name;
                }
                // 希望職種の整形
                $lp_job_category_list = [];
                foreach ($member_lp_job_categories as $lp_job_category) {
                    if ($lp_job_category->member_id != $m->id) {
                        continue;
                    }
                    $lp_job_category_list[] = $lp_job_category->name;
                }
                // 連絡可能日時の整形
                $proposal_datetimes_list = [];
                foreach ($member_proposal_datetimes as $proposal_datetime) {
                    if ($proposal_datetime->member_id != $m->id) {
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

                $member_data = [
                    'id' => $m->id,
                    'name' => $m->name,
                    'name_kana' => $m->name_kana,
                    'register_date' => date('Y/m/d H:i:s', strtotime($m->created_at)),
                    'birthyear' => $m->birthyear,
                    'postcode' => $m->postcode,
                    'prefecture' => $m->prefecture_name,
                    'address' => $m->address,
                    'phone' => $m->phone,
                    'email' => $m->email,
                    'job_change_feeling' => $m->job_change_feeling ? Member::JOB_CHANGE_FEELING[$m->job_change_feeling] : "",
                    'change_time' => $m->change_time ? Member::CHANGE_TIME[$m->change_time] : "",
                    'retirement_time' => $m->retirement_time ? Member::RETIREMENT_TIME[$m->retirement_time] : "",
                    'employment' => $m->employment_name,
                    'emp_prefecture' => $m->emp_prefecture_name,
                    'qualification' => implode('|', $qualification_list),
                    'lp_job_category' => implode('|', $lp_job_category_list),
                    'applicant_count' => $m->applicant_count,
                    'proposal_datetime' => implode("\n", $proposal_datetimes_list),
                    'register_site' => Member::REGISTER_SITE[$m->register_site],
                    'register_form' => Member::REGISTER_FORM[$m->register_form],
                    'register_root' => RegisterRoot::getRegisterRootByUtmParams($m->utm_source, $m->utm_medium, $m->utm_campaign, true),
                    'introduction_name' => $m->introduction_name,
                    'introduction_member' => $m->introduction_member_name,
                    'introduction_gift_status' => $m->register_form == 3 ? Member::INTRODUCTION_GIFT_STATUS[$m->introduction_gift_status] : '',
                ];
                // SJIS変換
                if ($request->char_code == 'ShiftJIS') {
                    mb_convert_variables('SJIS-win', 'UTF-8', $member_data);
                }
                // CSVファイルのデータを追加
                fputcsv($csv, $member_data);
            }

            // CSV閉じる
            fclose($csv);
        };

        // ファイル名
        $filename = 'members-' . date('Y-m-d') . '.csv';

        // レスポンスヘッダー情報
        $response_header = [
            'Content-type' => 'text/csv',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ];

        return response()->streamDownload($callback, $filename, $response_header);
    }

    /**
     * 会員データ取得
     */
    public function show($id)
    {
        try {
            $member = Member::find($id);
            if (!$member) {
                throw new ModelNotFoundException();
            }

            $member['prefecture_name'] = $member->prefecture->name;
            $member['employment_name'] = $member->employment->name;
            $member['emp_prefecture_name'] = $member->empPrefecture->name;
            $member['job_name'] = $member->job ? $member->job->name : "";
            $member['introduction_member_name'] = $member->introductionMember ? $member->introductionMember->name : "";
            $member['job_change_feeling_name'] = $member->job_change_feeling ? Member::JOB_CHANGE_FEELING[$member->job_change_feeling] : "";
            $member['change_time_name'] = $member->change_time ? Member::CHANGE_TIME[$member->change_time] : "";
            $member['retirement_time_name'] = $member->retirement_time ? Member::RETIREMENT_TIME[$member->retirement_time] : "";
            $member['status_name'] = Member::STATUS[$member->status];
            $member['register_site_name'] = Member::REGISTER_SITE[$member->register_site];
            $member['register_form_name'] = Member::REGISTER_FORM[$member->register_form];
            $member['introduction_gift_status_name'] = Member::INTRODUCTION_GIFT_STATUS[$member->introduction_gift_status];

            // 会員資格
            $member_qualifications = $member->qualifications->toArray();
            $member['qualification_ids'] = array_column($member_qualifications, 'id');
            $member['qualification_names'] = array_column($member_qualifications, 'name');

            // 会員LP職種
            $member_lp_job_categories = $member->lpJobCategories->toArray();
            $member['lp_job_category_ids'] = array_column($member_lp_job_categories, 'id');
            $member['lp_job_category_names'] = array_column($member_lp_job_categories, 'name');

            // 会員連絡可能日時
            $member['member_proposal_datetimes'] = $member->memberProposalDatetimes;
            $member['member_proposal_datetimes_text'] = $member->memberProposalDatetimesText();

            // 登録経路
            $conversion_histories = $member->conversionHistories;
            foreach ($conversion_histories as $cvh) {
                $member['register_root'] = RegisterRoot::getRegisterRootByUtmParams($cvh->utm_source, $cvh->utm_medium, $cvh->utm_campaign, true);
                break;
            }

            // 応募履歴
            $member['applicant_count'] = count($member->applicants);
            $member['applicants'] = $member->applicants;
            foreach ($member['applicants'] as $applicant) {
                $applicant['corporation_name'] = $applicant->job->office->corporation->name;
                $applicant['office_name'] = $applicant->job->office->name;
                $applicant['job_name'] = $applicant->job->name;
                $applicant['proposal_type_name'] = $applicant->proposal_type ? Applicant::PROPOSAL_TYPE[$applicant->proposal_type] : "";
                $applicant['applicant_proposal_datetimes_text'] = $applicant->applicantProposalDatetimesText();
            }

            return response()->json(['member' => $member]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Member not found'], 404);
        }
    }

    /**
     * 会員データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_kana' => 'required|string',
                'birthyear' => 'required|numeric',
                'postcode' => '',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'address' => 'required|string',
                'phone' => 'required|string',
                'email' => '',
                'job_change_feeling' => 'nullable|numeric|regex:/^[1-2]{1}$/',
                'change_time' => 'numeric|regex:/^[0-5]{1}$/',
                'retirement_time' => 'numeric|regex:/^[0-5]{1}$/',
                'employment_id' => 'numeric|exists:employments,id',
                'emp_prefecture_id' => 'numeric|exists:prefectures,id',
                'qualification_ids' => 'required|array',
                'lp_job_category_ids' => 'required|array',
                'status' => 'numeric',
                'introduction_name' => '',
                'introduction_member_id' => 'nullable|numeric|exists:members,id',
                'introduction_gift_status' => 'numeric',
                // TODO 応募履歴
            ]);

            DB::transaction(function () use ($data, $id) {
                $member = Member::findOrFail($id);
                // 緯度経度を取得
                $latlng = LatLngAddress::getLatLngInfoByAddress($member->prefecture_id, $member->address, false);
                if ($latlng !== false) {
                    $data['lat'] = $latlng['lat'];
                    $data['lng'] = $latlng['lng'];
                }
                $member->update($data);

                // 会員資格
                if (isset($data['qualification_ids']) && is_array($data['qualification_ids']) && count($data['qualification_ids']) > 0) {
                    // 入力があったID以外は削除
                    MemberQualification::where('member_id', $id)
                        ->whereNotIn('qualification_id', $data['qualification_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['qualification_ids'] as $qualification_id) {
                        $count = MemberQualification::where('member_id', $id)
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
                        $member->memberQualifications()->createMany($insert_data);
                    }
                } else {
                    $member->memberQualifications()->delete();
                }

                // 会員LP職種
                if (isset($data['lp_job_category_ids']) && is_array($data['lp_job_category_ids']) && count($data['lp_job_category_ids']) > 0) {
                    // 入力があったID以外は削除
                    MemberLpJobCategory::where('member_id', $id)
                        ->whereNotIn('lp_job_category_id', $data['lp_job_category_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['lp_job_category_ids'] as $lp_job_category_id) {
                        $count = MemberLpJobCategory::where('member_id', $id)
                            ->where('lp_job_category_id', $lp_job_category_id)
                            ->count();
                        if ($count > 0) {
                            continue;
                        }
                        $insert_data[] = [
                            'lp_job_category_id' => $lp_job_category_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $member->memberLpJobCategories()->createMany($insert_data);
                    }
                } else {
                    $member->memberLpJobCategories()->delete();
                }

                // TODO 応募促進で応募データ登録

                // TODO SFとのAPI
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 会員データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $member = Member::find($id);
            if (!$member) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($member) {
                // 会員情報削除
                // 関連データは削除しない
                $member->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Member not found'], 404);
        }
    }

    /**
     * 会員データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 会員情報削除
                // 関連データは削除しない
                $deleted_count = Member::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more members not found'], 404);
        }
    }
}
