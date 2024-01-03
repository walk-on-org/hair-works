<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminRole;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class AdminRoleController extends Controller
{
    /**
     * 管理者ロール一覧取得
     */
    public function index()
    {
        $admin_roles = AdminRole::all();
        return response()->json(['admin_roles' => $admin_roles]);
    }

    /**
     * 管理者ロール取得
     */
    public function show($id)
    {
        try {
            $admin_role = AdminRole::find($id);
            if (!$admin_role) {
                throw new ModelNotFoundException();
            }
            return response()->json(['admin_role' => $admin_role]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Admin role not found'], 404);
        }
    }

    /**
     * 管理者ロール登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
            ]);
            AdminRole::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 管理者ロール更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
            ]);
            $admin_role = AdminRole::findOrFail($id);
            $admin_role->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 管理者ロール削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $admin_role = AdminRole::find($id);
            if (!$admin_role) {
                throw new ModelNotFoundException();
            }
            $admin_role->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Admin role not found'], 404);
        }
    }

    /**
     * 管理者ロール複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = AdminRole::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more admin roles not found'], 404);
        }
    }
}
