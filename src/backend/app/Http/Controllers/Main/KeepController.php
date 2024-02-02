<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Keep;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class KeepController extends Controller
{
    /**
     * お気に入り設定
     */
    public function apply(Request $request)
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
            $query = Keep::where('job_id', $data['job_id']);
            if ($member_id) {
                $query = $query->where('member_id', $member_id);
            } else {
                $query = $query->where('unique_id', $data['unique_id']);
            }
            $keep = $query->first();

            // お気に入りデータ登録・更新
            DB::beginTransaction();
            try {
                if (!$keep) {
                    // 登録
                    Keep::create([
                        'unique_id' => $data['unique_id'],
                        'job_id' => $data['job_id'],
                        'member_id' => $member_id,
                        'status' => 1,
                        'keeped_at' => date('Y-m-d H:i:s'),
                    ]);
                } else {
                    // 更新
                    $keep->update([
                        'status' => 1,
                        'keeped_at' => date('Y-m-d H:i:s'),
                        'released_at' => null,
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

    /**
     * お気に入り解除
     */
    public function release(Request $request)
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
            $query = Keep::where('job_id', $data['job_id']);
            if ($member_id) {
                $query = $query->where('member_id', $member_id);
            } else {
                $query = $query->where('unique_id', $data['unique_id']);
            }
            $keep = $query->first();

            // お気に入りデータ登録・更新
            DB::beginTransaction();
            try {
                if ($keep) {
                    // 更新
                    $keep->update([
                        'status' => 2,
                        'released_at' => date('Y-m-d H:i:s'),
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