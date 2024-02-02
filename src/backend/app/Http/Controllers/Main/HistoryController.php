<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class HistoryController extends Controller
{
    /**
     * 求人閲覧
     */
    public function view(Request $request)
    {
        try {
            $data = $request->validate([
                'job_id' => 'required|exists:jobs,id',
                'unique_id' => '',
            ]);

            // ユニークIDがない場合は、発行
            if (!isset($data['unique_id']) || !$data['unique_id']) {
                $data['unique_id'] = Str::uuid();
            }

            // ログインしている会員IDを取得
            $member_id = null;
            if ($request->headers->get('Authorization')) {
                $auth = $request->headers->get('Authorization');
                $token = str_replace('Bearer ', '', $auth);
                $member = Member::where('auth_token', $token)->first();
                if ($member) {
                    $member_id = $member->id;
                }
            }

            // 登録済かどうか判定
            $query = History::where('job_id', $data['job_id']);
            if ($member_id) {
                $query = $query->where('member_id', $member_id);
            } else {
                $query = $query->where('unique_id', $data['unique_id']);
            }
            $history = $query->first();

            // 閲覧履歴データ登録・更新
            DB::beginTransaction();
            try {
                if (!$history) {
                    // 登録
                    History::create([
                        'unique_id' => $data['unique_id'],
                        'job_id' => $data['job_id'],
                        'member_id' => $member_id,
                        'viewed_at' => date('Y-m-d H:i:s'),
                    ]);
                } else {
                    // 更新
                    $history->update([
                        'viewed_at' => date('Y-m-d H:i:s'),
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
                'unique_id' => $data['unique_id'],
            ]);
        } catch (ValidationException $e) {
            return self::responseBadRequest();
        }
    }
}