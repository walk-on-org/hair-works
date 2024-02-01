<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberProposalDatetime;
use App\Library\Chatwork;
use App\Library\Salesforce;
use App\Library\MemberUtil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MemberProposalDatetimeController extends Controller
{
    /**
     * 会員連絡可能日時取得
     */
    public function index(Request $request)
    {
        try {
            $data = $request->validate([
                'member_enc_id' => 'required',
            ]);

            // TODO ID複合化
            $data['member_id'] = $data['member_enc_id'];

            // 会員データ取得
            $member = Member::find($data['member_id']);
            if (!$member) {
                return self::responseBadRequest();
            }

            // 会員連絡可能日時データ取得
            $member_proposal_datetimes = MemberProposalDatetime::where('member_id', $data['member_id'])
                ->select(
                    'number',
                    'date',
                    'time_am',
                    'time_12_14',
                    'time_14_16',
                    'time_16_18',
                    'time_18_20',
                    'time_all',
                )
                ->order('number')
                ->get();
            foreach ($member_proposal_datetimes as $row) {
                $row->time_am = $row->time_am ? true : false;
                $row->time_12_14 = $row->time_12_14 ? true : false;
                $row->time_14_16 = $row->time_14_16 ? true : false;
                $row->time_16_18 = $row->time_16_18 ? true : false;
                $row->time_18_20 = $row->time_18_20 ? true : false;
                $row->time_all = $row->time_all ? true : false;
            }

            return self::responseSuccess([
                'member_proposal_datetimes' => $member_proposal_datetimes,
                'member_id' => $data['member_id'],
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * 会員連絡可能日時適用
     */
    public function apply(Request $request)
    {
        try {
            $data = $request->validate([
                'memberid' => 'required',
                'proposaldatetimes' => 'nullable|array',
                'proposaldatetimes.*.number' => 'required',
                'proposaldatetimes.*.date' => 'required',
                'proposaldatetimes.*.time_am' => '',
                'proposaldatetimes.*.time_12_14' => '',
                'proposaldatetimes.*.time_14_16' => '',
                'proposaldatetimes.*.time_16_18' => '',
                'proposaldatetimes.*.time_18_20' => '',
                'proposaldatetimes.*.time_all' => '',
            ]);

            DB::beginTransaction();
            try {
                // 会員連絡可能日時削除
                $delete_count = MemberProposalDatetime::where('member_id', $data['memberid'])
                    ->delete();

                // 会員連絡可能日時登録
                if (isset($data['proposaldatetimes']) && is_array($data['proposaldatetimes'])) {
                    foreach ($data['proposaldatetimes'] as $row) {
                        if (!$row['date']) {
                            continue;
                        }
                        MemberProposalDatetime::create([
                            'member_id' => $data['memberid'],
                            'number' => $row['number'],
                            'date' => $row['date'],
                            'time_am' => $row['time_am'],
                            'time_12_14' => $row['time_12_14'],
                            'time_14_16' => $row['time_14_16'],
                            'time_16_18' => $row['time_16_18'],
                            'time_18_20' => $row['time_18_20'],
                            'time_all' => $row['time_all'],
                        ]);
                    }
                }

                // SF連携
                $member = Member::find($data['memberid']);
                if (false === Salesforce::updateKyuusyokusyaProposalDatetime($member)) {
                    Chatwork::noticeSystemError('会員更新時に会員情報のSF連携に失敗しました。会員ID=' . $member->id . '、パラメータ=' . json_encode($data));
                }

                // Chatwork通知
                Chatwork::noticeMemberProposalDatetime(
                    $member,
                    $deleted_count > 0 ? false : true,
                    $member->register_site == 1 ? false : MemberUtil::isSendCustomerFromAgentToJobad($member)
                );
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                Chatwork::noticeSystemError($e);
                return self::responseInternalServerError();
            }
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}