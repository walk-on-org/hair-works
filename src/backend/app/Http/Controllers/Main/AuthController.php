<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberQualification;
use App\Models\MemberLpJobCategory;
use App\Models\ConversionHistory;
use App\Models\Keep;
use App\Models\History;
use App\Library\LatLngAddress;
use App\Library\Chatwork;
use App\Library\Salesforce;
use App\Library\MemberUtil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * ログイン認証
     */
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required',
                'password' => 'required',
                'user_unique' => '',
            ]);

            $member = Member::where('email', $data['email'])
                ->where('password', $data['password'])
                ->first();
            if (!$member) {
                return self::responseSuccess([
                    'result' => 0,
                    'message' => 'メールアドレスまたはパスワードが違います。',
                ]);
            }

            // お気に入り、閲覧履歴の会員ID補完
            if ($data['user_unique']) {
                Keep::where('unique_id', $data['user_unique'])
                    ->update([
                        'member_id' => $member->id,
                    ]);
                History::where('unique_id', $data['user_unique'])
                    ->update([
                        'member_id' => $member->id,
                    ]);
            }
            
            return response()->json(['token' => $member->auth_token]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * 新規登録
     */
    public function signup(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required',
                'namekana' => '',
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
                'job_id' => '',
                'user_unique' => '',
                'introductionname' => '',
            ]);

            // パスワード自動生成
            $data['password'] = Str::random(12);
            
            // 緯度経度を取得
            $latlng = LatLngAddress::getLatLngInfoByAddress($data['prefecture'], $data['address'], false);
            $data['lat'] = $latlng['lat'];
            $data['lng'] = $latlng['lng'];

            DB::beginTransaction();
            try {
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
                    'status' => 0, // 未対応
                    'register_site' => 1, // ヘアワークス
                    'register_form' => !isset($data['introductionname']) ? 1 : 3, // 会員登録フォーム or お友達紹介フォーム
                    'job_id' => !isset($data['job_id']) ? null : $data['job_id'],
                    'introduction_name' => !isset($data['introductionname']) ? null : $data['introductionname'],
                    'introduction_gift_status' => !isset($data['introductionname']) ? 0 : 1,
                    'lat' => $data['lat'],
                    'lng' => $data['lng'],
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

                // 求職者へおすすめする求人情報取得

                // TODO 会員登録メール送信

                // TODO 会員登録メール送信（TO：管理者）

                // CV経路登録・更新
                $cvh = null;
                if (isset($data['utm_unique'])) {
                    $cvh = ConversionHistory::where('unique_id', $data['utm_unique'])->first();
                }
                if (!$cvh) {
                    ConversionHistory::create([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'member_id' => $member->id,
                    ]);
                } else {
                    $cvh->update([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'member_id' => $member->id,
                    ]);
                }

                // お気に入り、閲覧履歴の会員ID補完
                if ($data['user_unique']) {
                    Keep::where('unique_id', $data['user_unique'])
                        ->update([
                            'member_id' => $member->id,
                        ]);
                    History::where('unique_id', $data['user_unique'])
                        ->update([
                            'member_id' => $member->id,
                        ]);
                }

                // SF連携
                if (false === Salesforce::createKyuusyokusya($member, $cvh)) {
                    Chatwork::noticeSystemError('会員登録時に会員情報のSF連携に失敗しました。会員ID=' . $member->id);
                }

                // Chatwork通知
                Chatwork::noticeRegisterMember($member);

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }

            return self::responseSuccess([
                'result' => 1,
                'password' => $data['password'],
                'member_id' => 'TODO', // 暗号化した会員ID
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * 会員情報更新
     */
    public function edit(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required',
                'namekana' => '',
                'qualificationid' => 'required|array',
                'lpjobcategoryid' => 'required|exists:lp_job_categories,id',
                'birthyear' => 'required',
                'postcode' => '',
                'prefectureid' => 'required|exists:prefectures,id',
                'address' => 'required',
                'tel' => 'required',
                'email' => 'required',
                'password' => '',
                'changetime' => 'required',
                'retirementtime' => '',
                'employmentid' => 'required|exists:employments,id',
                'empprefectureid' => 'required|exists:prefectures,id',
            ]);

            DB::beginTransaction();
            try {
                // 会員情報取得
                $auth = $request->headers->get('Authorization');
                $token = str_replace('Bearer ', '', $auth);
                $member = Member::where('auth_token', $token)->first();
                if (!$member) {
                    return self::responseUnauthorized();
                }

                // 会員情報更新
                $member->update([
                    'email' => $data['email'],
                    'name' => $data['name'],
                    'name_kana' => $data['namekana'],
                    'birthyear' => $data['birthyear'],
                    'postcode' => $data['postcode'],
                    'prefecture_id' => $data['prefectureid'],
                    'address' => $data['address'],
                    'phone' => $data['tel'],
                    'change_time' => $data['changetime'],
                    'retirement_time' => !isset($data['retirementtime']) ? null : $data['retirementtime'],
                    'employment_id' => $data['employmentid'],
                    'emp_prefecture_id' => $data['empprefectureid'],
                ]);
                // パスワードは入力した時のみ更新
                if ($data['password']) {
                    $member->update([
                        'password' => $data['password'],
                    ]);
                }
                // 会員資格情報登録
                if (isset($data['qualificationid'])) {
                    MemberQualification::where('member_id', $member->id)
                        ->delete();
                    if (is_array($data['qualificationid']) && count($data['qualificationid']) > 0) {
                        foreach ($data['qualificationid'] as $qualification_id) {
                            MemberQualification::create([
                                'member_id' => $member->id,
                                'qualification_id' => $qualification_id,
                            ]);
                        }
                    }
                }
                // 会員職種情報登録
                if (isset($data['lpjobcategoryid'])) {
                    MemberLpJobCategory::where('member_id', $member->id)
                        ->delete();
                    MemberLpJobCategory::create([
                        'member_id' => $member->id,
                        'lp_job_category_id' => $data['lpjobcategoryid'],
                    ]);
                }

                // SF連携
                if (false === Salesforce::updateKyuusyokusya($member)) {
                    Chatwork::noticeSystemError('会員更新時に会員情報のSF連携に失敗しました。会員ID=' . $member->id);
                }
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }

            return self::responseSuccess(['result' => 1]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * ログイン情報取得
     */
    public function member(Request $request)
    {
        // 会員情報取得
        $auth = $request->headers->get('Authorization');
        $token = str_replace('Bearer ', '', $auth);
        $member = Member::where('auth_token', $token)
            ->join('prefectures', 'members.prefecture_id', '=', 'prefectures.id')
            ->join('prefectures as emp_prefectures', 'members.emp_prefecture_id', '=', 'emp_prefectures.id')
            ->join('employments', 'members.employment_id', '=', 'employments.id')
            ->select(
                'members.id',
                'members.email',
                'members.auth_token',
                'members.name',
                'members.name_kana as namekana',
                'members.birthyear',
                'members.postcode',
                'members.prefecture_id as prefectureid',
                'prefectures.name as prefecturename',
                'prefectures.permalink as prefectureroman',
                'members.address',
                'members.lat',
                'members.lng',
                'members.phone as tel',
                'members.change_time as changetime',
                'members.retirement_time as retirementtime',
                'members.employment_id as employmentid',
                'employments.name as employmentname',
                'members.emp_prefecture_id as empprefectureid',
                'emp_prefectures.name as empprefecturename',
            )
            ->first();
        if ($member) {
            // 会員資格情報取得
            $member_qualifications = MemberQualification::join('qualifications', 'member_qualifications.qualification_id', '=', 'qualifications.id')
                ->where('member_id', $member->id)
                ->select(
                    'qualifications.id',
                    'qualifications.name',
                )
                ->get();
            $member['qualificationid'] = array_column($member_qualifications->toArray(), 'id');
            $member['qualificationname'] = array_column($member_qualifications->toArray(), 'name');
            // 会員職種情報取得
            $member_lp_job_category = MemberLpJobCategory::join('lp_job_categories', 'member_lp_job_categories.lp_job_category_id', '=', 'lp_job_categories.id')
                ->where('member_id', $member->id)
                ->select(
                    'lp_job_categories.id',
                    'lp_job_categories.name',
                )
                ->first();
            $member['lpjobcategoryid'] = $member_lp_job_category ? $member_lp_job_category->id : '';
            $member['lpjobcategoryname'] = $member_lp_job_category ? $member_lp_job_category->name : '';
        }
        return response()->json(['member' => $member]);
    }

    /**
     * 新規登録（エージェント）
     */
    public function signupagent(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required',
                'namekana' => '',
                'qualificationid' => 'required|array',
                'lpjobcategoryid' => 'required|exists:lp_job_categories,id',
                'birthyear' => 'required',
                'postcode' => '',
                'prefecture' => 'required|exists:prefectures,id',
                'address' => 'required',
                'tel' => 'required',
                'email' => 'required',
                'jobchangefeeling' => 'required',
                'changetime' => 'required',
                'retirementtime' => '',
                'employment' => 'required|exists:employments,id',
                'empprefecture' => 'required|exists:prefectures,id',
                'utm_unique' => '',
                'cv_url' => '',
            ]);

            // パスワード自動生成
            $data['password'] = Str::random(12);

            DB::beginTransaction();
            try {
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
                    'job_change_feeling' => $data['jobchangefeeling'],
                    'change_time' => $data['changetime'],
                    'retirement_time' => !isset($data['retirementtime']) ? null : $data['retirementtime'],
                    'employment_id' => $data['employment'],
                    'emp_prefecture_id' => $data['empprefecture'],
                    'status' => 0, // 未対応
                    'register_site' => 2, // ヘアワークスエージェント
                    'register_form' => 1, // 会員登録フォーム
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

                // TODO 会員登録メール送信

                // TODO 会員登録メール送信（TO：管理者）

                // CV経路登録・更新
                $cvh = null;
                if (isset($data['utm_unique'])) {
                    $cvh = ConversionHistory::where('unique_id', $data['utm_unique'])->first();
                }
                if (!$cvh) {
                    ConversionHistory::create([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'member_id' => $member->id,
                    ]);
                } else {
                    $cvh->update([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'member_id' => $member->id,
                    ]);
                }

                // SF連携
                if (false === Salesforce::createKyuusyokusya($member, $cvh)) {
                    Chatwork::noticeSystemError('会員登録時に会員情報のSF連携に失敗しました。会員ID=' . $member->id);
                }

                // Chatwork通知
                Chatwork::noticeRegisterMember($member, MemberUtil::isSendCustomerFromAgentToJobad($member));

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }

            return self::responseSuccess([
                'result' => 1,
                'password' => $data['password'],
                'member_id' => 'TODO', // 暗号化した会員ID
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}