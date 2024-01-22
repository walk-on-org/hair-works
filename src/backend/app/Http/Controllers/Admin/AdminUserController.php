<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\AdminUserCorporation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AdminUserController extends Controller
{
    /**
     * 管理者ユーザ一覧取得
     */
    public function index()
    {
        $admin_users = AdminUser::join('admin_roles', 'admin_users.admin_role_id', '=', 'admin_roles.id')
            ->select(
                'admin_users.id',
                'admin_users.name',
                'admin_users.email',
                'admin_users.tel',
                'admin_users.admin_role_id',
                'admin_roles.name as admin_role_name',
                'admin_users.created_at',
            )
            ->get();
        foreach ($admin_users as $admin_user) {
            $corporations = $admin_user->corporations->toArray();
            $admin_user['corporation_ids'] = array_column($corporations, 'id');
            $admin_user['corporation_names'] = array_column($corporations, 'name');
        }
        return response()->json(['admin_users' => $admin_users]);
    }

    /**
     * 管理者ユーザ取得
     */
    public function show($id)
    {
        try {
            $admin_user = AdminUser::find($id);
            if (!$admin_user) {
                throw new ModelNotFoundException();
            }

            $admin_user['admin_role_name'] = $admin_user->adminRole->name;

            // 所属法人
            $corporations = $admin_user->corporations->toArray();
            $admin_user['corporation_ids'] = array_column($corporations, 'id');
            $admin_user['corporation_names'] = array_column($corporations, 'name');

            return response()->json(['admin_user' => $admin_user]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Admin user not found'], 404);
        }
    }

    /**
     * 管理者ユーザ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'tel' => '',
                'email' => 'required|string|unique:admin_users',
                'password' => ['required', 'confirmed', Password::min(8)],
                //'password_confirmation'
                'admin_role_id' => 'numeric|exists:admin_roles,id',
                'corporation_ids' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data) {
                // 管理者ユーザ登録
                $data['password'] = Hash::make($data['password']);
                $admin_user = AdminUser::create($data);

                // 管理者ユーザ法人
                if (isset($data['corporation_ids']) && is_array($data['corporation_ids']) && count($data['corporation_ids']) > 0) {
                    foreach ($data['corporation_ids'] as $corporation_id) {
                        AdminUserCorporation::create([
                            'admin_user_id' => $admin_user->id,
                            'corporation_id' => $corporation_id,
                        ]);
                    }
                }
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 管理者ユーザ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'tel' => '',
                'email' => ['required', 'email', Rule::unique('admin_users')->ignore($id)],
                'password' => ['confirmed', Password::min(8)],
                //'password_confirmation'
                'admin_role_id' => 'numeric|exists:admin_roles,id',
                'corporation_ids' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data, $id) {
                $admin_user = AdminUser::findOrFail($id);
                $data['password'] = Hash::make($data['password']);
                $admin_user->update($data);

                // 管理者ユーザ法人
                if (isset($data['corporation_ids']) && is_array($data['corporation_ids']) && count($data['corporation_ids']) > 0) {
                    // 入力があったID以外は削除
                    AdminUserCorporation::where('admin_user_id', $id)
                        ->whereNotIn('corporation_id', $data['corporation_ids'])
                        ->delete();
                    // 登録していないデータのみ登録
                    $insert_data = [];
                    foreach ($data['corporation_ids'] as $corporation_id) {
                        $count = AdminUserCorporation::where('admin_user_id', $id)
                            ->where('corporation_id', $corporation_id)
                            ->count();
                        if ($count > 0) {
                            continue; 
                        }
                        $insert_data[] = [
                            'corporation_id' => $corporation_id,
                        ];
                    }
                    if (count($insert_data) > 0) {
                        $admin_user->adminUserCorporations()->createMany($insert_data);
                    }
                } else {
                    $admin_user->adminUserCorporations()->delete();
                }
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 管理者ユーザ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $admin_user = AdminUser::find($id);
            if (!$admin_user) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($admin_user) {
                // 管理者ユーザ削除
                // 関連データは削除しない
                $admin_user->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Admin user not found'], 404);
        }
    }

    /**
     * 管理者ユーザ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 管理者ユーザ削除
                // 関連データは削除しない
                $deleted_count = AdminUser::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more admin users not found'], 404);
        }
    }
}
