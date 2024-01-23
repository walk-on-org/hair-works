<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\AdminRole;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * ログイン
     */
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // メールアドレス、パスワードチェック
            $admin_user = AdminUser::where('email', $data['email'])->first();
            if (!$admin_user) {
                throw new \Exception('入力したメールアドレスが存在しません。');
            }
            if (!Hash::check($data['password'], $admin_user->password)) {
                throw new \Exception('パスワードが一致しませんでした。');
            }

            // 法人ID
            $admin_user_corporations = $admin_user->adminUserCorporations;
            $corporation_ids = array_column($admin_user_corporations->toArray(), 'corporation_id');

            // トークン発行
            $credentials = request(['email', 'password']);
            if (! $token = auth('adminapi')->attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return response()->json([
                'accessToken' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('adminapi')->factory()->getTTL() * 60,
                'user' => [
                    'email' => $admin_user->email,
                    'name' => $admin_user->name,
                    'role' => AdminRole::find($admin_user->admin_role_id)->name,
                    'corporation' => $corporation_ids,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * ログインユーザ取得
     */
    public function user()
    {
        return response()->json(auth()->user());
    }
    
    /**
     * ログアウト
     */
    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ログアウト'], 200);
    }

    /**
     * パスワードリセットのリクエスト要求
     */
    public function sendRequestForgotPassword(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
            ]);

            // TODO token付きでパスワードリセットページをメール送信

        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * パスワードリセット
     */
    public function resetPassword(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
                'token' => 'required',
                'password' => ['required', 'confirmed', Password::min(8)],
                //'password_confirmation'
            ]);

            // TODO TOkenチェックして、パスワード変更

        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}