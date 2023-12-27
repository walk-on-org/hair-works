<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class PlanController extends Controller
{
    /**
     * プランマスタ一覧取得
     */
    public function index()
    {
        $plans = Plan::all();
        foreach ($plans as $p) {
            $p['status_name'] = Plan::STATUS[$p->status];
        }
        return response()->json(['plans' => $plans]);
    }

    /**
     * プランマスタ取得
     */
    public function show($id)
    {
        try {
            $plan = Plan::find($id);
            if (!$plan) {
                throw new ModelNotFoundException();
            }
            $plan['status_name'] = Plan::STATUS[$plan->status];
            return response()->json(['plan' => $plan]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Plan not found'], 404);
        }
    }

    /**
     * プランマスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'term' => 'numeric',
                'amount' => 'numeric',
                'status' => 'required',
            ]);
            Plan::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * プランマスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'term' => 'numeric',
                'amount' => 'numeric',
                'status' => 'required',
            ]);
            $plan = Plan::findOrFail($id);
            $plan->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * プランマスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $plan = Plan::find($id);
            if (!$plan) {
                throw new ModelNotFoundException();
            }
            $plan->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Plan not found'], 404);
        }
    }

    /**
     * プランマスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = Plan::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more plans not found'], 404);
        }
    }
}
