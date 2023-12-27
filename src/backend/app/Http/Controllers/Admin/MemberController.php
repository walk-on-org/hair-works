<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberQualification;
use App\Models\MemberLpJobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MemberController extends Controller
{
    /**
     * 会員データ一覧取得
     */
    public function index()
    {
        $members = DB::table('members')
            ->join('prefectures', 'members.prefecture_id', '=', 'prefectures.id')
            ->join('employments', 'members.employment_id', '=', 'employments.id')
            ->join('prefectures as emp_prefectures', 'members.emp_prefecture_id', '=', 'emp_prefectures.id')
            ->leftJoin('jobs', 'members.job_id', '=', 'jobs.id')
            ->leftJoin('members as introduction_members', 'members.introduction_member_id', '=', 'introduction_members.id')
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
            )
            ->get();
        foreach ($members as $m) {
            $m->job_change_feeling_name = $m->job_change_feeling ? Member::JOB_CHANGE_FEELING[$m->job_change_feeling] : "";
            $m->change_time_name = $m->change_time ? Member::CHANGE_TIME[$m->change_time] : "";
            $m->retirement_time_name = $m->retirement_time ? Member::RETIREMENT_TIME[$m->retirement_time] : "";
            $m->status_name = Member::STATUS[$m->status];
            $m->register_site_name = Member::REGISTER_SITE[$m->register_site];
            $m->register_form_name = Member::REGISTER_FORM[$m->register_form];
            $m->introduction_gift_status_name = Member::INTRODUCTION_GIFT_STATUS[$m->introduction_gift_status];
        }
        return response()->json(['members' => $members]);
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
