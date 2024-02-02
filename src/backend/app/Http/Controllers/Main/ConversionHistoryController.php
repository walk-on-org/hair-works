<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\ConversionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ConversionHistoryController extends Controller
{
    /**
     * LP登録
     */
    public function landingPage(Request $request)
    {
        try {
            $data = $request->validate([
                'utm_source' => 'required',
                'utm_medium' => 'required',
                'utm_campaign' => 'required',
                'utm_term' => '',
                'url' => 'required',
            ]);

            $unique_id = Str::uuid();

            DB::beginTransaction();
            try {
                ConversionHistory::create([
                    'unique_id' => $unique_id,
                    'utm_source' => $data['utm_source'],
                    'utm_medium' => $data['utm_medium'],
                    'utm_campaign' => $data['utm_campaign'],
                    'utm_term' => $data['utm_term'],
                    'lp_url' => $data['url'],
                    'lp_date' => date('Y-m-d H:i:s'),
                ]);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }
            return self::responseSuccess([
                'result' => 1,
                'unique_id' => $unique_id,
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }

    /**
     * CV登録
     */
    public function conversion(Request $request)
    {
        try {
            $data = $request->validate([
                'url' => 'required',
                'unique_id' => '',
            ]);
            
            $cvh = null;
            if (isset($data['unique_id']) && $data['unique_id']) {
                $cvh = ConversionHistory::where('unique_id', $data['unique_id'])->first();
            }

            DB::beginTransaction();
            try {
                if (!$cvh) {
                    // 登録
                    ConversionHistory::create([
                        'cv_url' => $data['url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                    ]);
                } else {
                    // 更新
                    $cvh->update([
                        'cv_url' => $data['url'],
                        'cv_date' => date('Y-m-d H:i:s'),
                    ]);
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                return self::responseInternalServerError();
            }
            return self::responseSuccess([
                'result' => 1,
                'unique_id' => $unique_id,
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}