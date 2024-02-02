<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\Applicant;
use App\Library\Chatwork;
use App\Library\MemberUtil;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AccreteSmsConnectController extends Controller
{
    /**
     * SMS受信
     */
    public function recive(Request $request)
    {
        try {
            $data = $request->validate([
                'destination' => 'required',
                'receive_id' => 'required',
                'telno' => 'required',
                'text' => 'required',
            ]);
            \Log::debug('SMS受信処理');
            \Log::debug(json_encode($data));

            try {
                // 電話番号をパラメータより取得
                $phone = $data['telno'];
                if (str_starts_with($phone, '81')) {
                    // 国際表記の場合、先頭の"81"を"0"に変更
                    // 例）819012345678 → 09012345678
                    $phone = preg_replace('/^81/', '0', $phone);
                    \Log::debug("携帯番号：{$phone}");
                }

                
                // 電話番号で該当の会員を取得
                $member = Member::where('phone', $phone)
                    ->orderBy('id', 'desc')
                    ->first();

                // 人材紹介求人に応募した求職者かチェック
                $is_applicant_recommend_job = false;
                $first_applicant = Applicant::where('member_id', $member->id)
                    ->orderBy('id')
                    ->first();
                if ($first_applicant) {
                    $is_applicant_recommend_job = $first_applicant->job->recommend ? true : false;
                }

                // Chatwork通知
                Chatwork::noticeReciveSmsForAccete(
                    $member,
                    $data['text'],
                    $member->register_site == 1 ? false : MemberUtil::isSendCustomerFromAgentToJobad($member),
                    $is_applicant_recommend_job
                );
            } catch (\Exception $e) {
                \Log::error($e);
                Chatwork::noticeSystemError(json_encode($data) . "\n" . $e->getMessage());
                return self::responseInternalServerError();
            }

            return response()->json(['plain' => '0'], 200);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}