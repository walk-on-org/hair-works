<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\ApplicantQualification;
use App\Models\ApplicantLpJobCategory;
use App\Models\Member;
use App\Models\MemberQualification;
use App\Models\MemberLpJobCategory;
use App\Models\Job;
use App\Models\Office;
use App\Models\ConversionHistory;
use App\Library\Chatwork;
use App\Library\Salesforce;
use App\Mail\EntryToApplicantMail;
use App\Mail\EntryToSalonMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ApplicantController extends Controller
{
    /**
     * 応募者登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'proposaltype' => '',
                'jobid' => 'required',
                'name' => 'required',
                'namekana' => 'required',
                'qualificationid' => 'required|array',
                'lpjobcategoryid' => 'required|exists:lp_job_categories,id',
                'birthyear' => 'required',
                'postcode' => '',
                'prefecture' => 'required|exists:prefectures,id',
                'address' => 'required',
                'tel' => 'required',
                'email' => 'required',
                'changetime' => 'required',
                'retirementtime' => '',
                'employment' => 'required|exists:employments,id',
                'empprefecture' => 'required|exists:prefectures,id',
                'utm_unique' => '',
                'cv_url' => '',
            ]);
            $job = Job::find($data['jobid']);
            if (!$job) {
                return self::responseBadRequest();    
            }
            $office = Office::find($job->office_id);

            // ログイン会員情報を取得
            $member_id = null;
            $member = null;
            if ($request->headers->get('Authorization')) {
                $auth = $request->headers->get('Authorization');
                $token = str_replace('Bearer ', '', $auth);
                $member = Member::where('auth_token', $token)->first();
                if ($member) {
                    $member_id = $member->id;
                }
            }

            DB::beginTransaction();
            try {
                // ログインしていなくて、同じ会員情報がなければ会員登録
                $is_member_create = false;
                if (!$member) {
                    // 電話番号、メールアドレスが重複する会員取得
                    $member = Member::where('phone', $data['tel'])
                        ->where('email', $data['email'])
                        ->orderBy('id', 'desc')
                        ->first();
                    // 重複する会員がいない場合は会員登録
                    if (!$member) {
                        $member = self::registerMember($data);
                        $is_member_create = true;
                    }
                    $member_id = $member->id;
                }

                // 応募者登録
                $applicant = Applicant::create([
                    'job_id' => $data['jobid'],
                    'name' => $data['name'],
                    'name_kana' => $data['namekana'],
                    'birthyear' => $data['birthyear'],
                    'postcode' => $data['postcode'],
                    'prefecture_id' => $data['prefecture'],
                    'address' => $data['address'],
                    'phone' => $data['tel'],
                    'mail' => $data['email'],
                    'change_time' => $data['changetime'],
                    'retirement_time' => !isset($data['retirementtime']) ? null : $data['retirementtime'],
                    'employment_id' => $data['employment'],
                    'emp_prefecture_id' => $data['empprefecture'],
                    'status' => 0, // 未対応
                    'proposal_type' => !isset($data['proposaltype']) ? null : $data['proposaltype'],
                    'member_id' => $member_id,
                ]);

                // 応募者資格情報登録
                if (isset($data['qualificationid']) && is_array($data['qualificationid']) && count($data['qualificationid']) > 0) {
                    foreach ($data['qualificationid'] as $qualification_id) {
                        ApplicantQualification::create([
                            'applicant_id' => $applicant->id,
                            'qualification_id' => $qualification_id,
                        ]);
                    }
                }
                // 応募者職種情報登録
                if (isset($data['lpjobcategoryid'])) {
                    ApplicantLpJobCategory::create([
                        'applicant_id' => $applicant->id,
                        'lp_job_category_id' => $data['lpjobcategoryid'],
                    ]);
                }

                // CV経路登録・更新
                $cvh = null;
                if (isset($data['utm_unique'])) {
                    $cvh = ConversionHistory::where('unique_id', $data['utm_unique'])->first();
                }
                if (!$cvh) {
                    ConversionHistory::create([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'applicant_id' => $applicant->id,
                        'member_id' => $is_member_create ? $member->id : null,
                    ]);
                } else {
                    $cvh->update([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'applicant_id' => $applicant->id,
                        'member_id' => $is_member_create ? $member->id : null,
                    ]);
                }

                // 応募者へメール送信
                Mail::send(new EntryToApplicantMail($applicant, $office, $job));
                // サロンへメール送信
                $to_list = [];
                foreach ($office->corporation->adminUsers as $user) {
                    $to_list[] = $user->email;
                }
                Mail::send(new EntryToSalonMail($applicant, $office, $job, $to_list));

                // SF連携
                if ($is_member_create) {
                    // 応募で会員登録した場合、SF求職者オブジェクトを作成
                    if (false === Salesforce::createKyuusyokusya($member, $cvh, $job)) {
                        Chatwork::noticeSystemError('応募時に会員情報のSF連携に失敗しました。会員ID=' . $member->id);
                    }
                } else {
                    // 上記以外は会員の状態を応募済に更新
                    if (!in_array($member->status, [4, 5, 6, 9])) {
                        $member->update([
                            'status' => 9, // 応募済
                        ]);
                    }
                    // 会員登録済の求職者の場合、SF求職者オブジェクトを更新
                    if (false === Salesforce::updateKyuusyokusya($member)) {
                        Chatwork::noticeSystemError('応募時に会員情報のSF連携に失敗しました。会員ID=' . $member->id);
                    }
                }

                // Chatwork通知
                if ($is_member_create) {
                    Chatwork::noticeRegisterMember($member, false, $job->recommend);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }

            return self::responseSuccess([
                'result' => 1,
                'applicant_id' => 'TODO', // 暗号化した応募者ID
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * 会員情報を登録
     */
    private function registerMember($data)
    {
        // パスワード自動生成
        $data['password'] = Str::random(12);

        // 会員登録
        $member = Member::create([
            'auth_token' => Str::random(48),
            'email' => $data['email'],
            'password' => $data['password'],
            'name' => $data['name'],
            'name_kana' => $data['namekana'],
            'birthyear' => $data['birthyear'],
            'postcode' => $data['postcode'],
            'prefecture_id' => $data['prefecture'],
            'address' => $data['address'],
            'phone' => $data['tel'],
            'change_time' => $data['changetime'],
            'retirement_time' => !isset($data['retirementtime']) ? null : $data['retirementtime'],
            'employment_id' => $data['employment'],
            'emp_prefecture_id' => $data['empprefecture'],
            'status' => 9, // 応募済
            'register_site' => 1, // ヘアワークス
            'register_form' => 2, // 応募フォーム
        ]);

        // 会員資格情報登録
        if (isset($data['qualificationid']) && is_array($data['qualificationid']) && count($data['qualificationid']) > 0) {
            foreach ($data['qualificationid'] as $qualification_id) {
                MemberQualification::create([
                    'member_id' => $member->id,
                    'qualification_id' => $qualification_id,
                ]);
            }
        }
        // 会員職種情報登録
        if (isset($data['lpjobcategoryid'])) {
            MemberLpJobCategory::create([
                'member_id' => $member->id,
                'lp_job_category_id' => $data['lpjobcategoryid'],
            ]);
        }

        return $member;
    }
}