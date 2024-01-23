<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\ConversionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    /**
     * 問い合わせ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'salon_name' => 'required',
                'name' => 'required',
                'prefecture_id' => 'numeric|exists:prefectures,id',
                'tel' => 'required',
                'mail' => '',
                'inquiry_type' => 'required|number',
                'inquiry_note' => '',
                'utm_unique' => '',
                'cv_url' => '',
            ]);

            DB::transaction(function () use ($data) {
                // 問い合わせ登録
                $data['status'] = 0;
                $inquiry = Inquiry::create($data);

                // CV経路登録
                if ($data['utm_unique']) {
                    $cvh = ConversionHistory::where('unique_id', $data['unique_id'])
                        ->first();
                }
                if ($cvh) {
                    $cvh->update([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'inquiry_id' => $inquiry->id,
                    ]);
                } else {
                    $cvh = ConversionHistory::create([
                        'cv_url' => $data['cv_url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                        'inquiry_id' => $inquiry->id,
                    ]);
                }

                // TODO メール送信

                // TODO SalesForce連携

                // TODO Chatwork連携
            });

            return self::responseSuccess(['result' => 1]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}