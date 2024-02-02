<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\ApplicantProposalDatetime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApplicantProposalDatetimeController extends Controller
{
    /**
     * 応募者希望日時取得
     */
    public function index(Request $request)
    {
        try {
            $data = $request->validate([
                'applicant_enc_id' => 'required',
            ]);

            // TODO ID複合化
            $data['applicant_id'] = $data['applicant_enc_id'];

            // 会員データ取得
            $applicant = Applicant::find($data['applicant_id']);
            if (!$applicant) {
                return self::responseBadRequest();
            }

            // 応募者希望日時データ取得
            $applicant_proposal_datetimes = ApplicantProposalDatetime::where('applicant_id', $data['applicant_id'])                ->select(
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
            foreach ($applicant_proposal_datetimes as $row) {
                $row->time_am = $row->time_am ? true : false;
                $row->time_12_14 = $row->time_12_14 ? true : false;
                $row->time_14_16 = $row->time_14_16 ? true : false;
                $row->time_16_18 = $row->time_16_18 ? true : false;
                $row->time_18_20 = $row->time_18_20 ? true : false;
                $row->time_all = $row->time_all ? true : false;
            }

            return self::responseSuccess([
                'applicant_proposal_datetimes' => $applicant_proposal_datetimes,
                'applicant_id' => $data['applicant_id'],
                'proposal_type' => Applicant::PROPOSAL_TYPE[$applicant->proposal_type],
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * 応募者希望日時適用
     */
    public function apply(Request $request)
    {
        try {
            $data = $request->validate([
                'applicantid' => 'required',
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
                // 応募者希望日時削除
                $delete_count = ApplicantProposalDatetime::where('applicant_id', $data['applicantid'])
                    ->delete();

                // 応募者希望日時登録
                if (isset($data['proposaldatetimes']) && is_array($data['proposaldatetimes'])) {
                    foreach ($data['proposaldatetimes'] as $row) {
                        if (!$row['date']) {
                            continue;
                        }
                        ApplicantProposalDatetime::create([
                            'applicant_id' => $data['applicantid'],
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
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}