<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * ログイン認証
     */
    public function login(Request $request)
    {
        $member = Member::where('email', $request->email)
            ->where('password', $request->password)
            ->first();
        if (!$member) {
            return self::responseSuccess([
                'result' => 0,
                'message' => 'メールアドレスまたはパスワードが違います。',
            ]);
        }

        // お気に入り、閲覧履歴の会員ID補完
        if ($request->user_unique) {
            Keep::where('unique_id', $request->user_unique)
                ->update([
                    'member_id' => $member->id,
                ]);
            History::where('unique_id', $request->user_unique)
                ->update([
                    'member_id' => $member->id,
                ]);
        }
        
        return response()->json(['token' => $member->auth_token]);
    }

    /**
     * 新規登録
     */
    public function signup(Request $request)
    {
        // パスワード自動生成
        $password = Str::randam(12);

        // 緯度経度を取得

    }
}