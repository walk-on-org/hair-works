<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\ApplicantContactHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ApplicantController extends Controller
{
    /**
     * 応募者データ一覧取得
     */
    public function index()
    {
        $applicants = DB::table('applicants')
            ->join('jobs', 'applicants.job_id', '=', 'jobs.id')
            ->join('offices', 'jobs.office_id', '=', 'offices.id')
            ->join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->join('prefectures as office_prefectures', 'offices.prefecture_id', '=', 'office_prefectures.id')
            ->join('prefectures', 'applicants.prefecture_id', '=', 'prefectures.id')
            ->join('employments', 'applicants.employment_id', '=', 'employments.id')
            ->join('prefectures as emp_prefectures', 'applicants.emp_prefecture_id', '=', 'emp_prefectures.id')
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
            )
            ->get();
        foreach ($applicants as $a) {
            $a->status_name = Applicant::STATUS[$a->status];
            $a->job_recommend_name = $a->job_recommend ? '人材紹介' : '';
            $a->proposal_type_name = $a->proposal_type ? Applicant::PROPOSAL_TYPE[$a->proposal_type] : "";
            $a->change_time_name = $a->change_time ? Applicant::CHANGE_TIME[$a->change_time] : "";
            $a->retirement_time_name = $a->retirement_time ? Applicant::RETIREMENT_TIME[$a->retirement_time] : "";
        }
        return response()->json(['applicants' => $applicants]);
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
