<?php

namespace App\Http\Controllers;

use App\Models\Employment;
use App\Models\EmploymentConcernPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class EmploymentController extends Controller
{
    /**
     * 雇用形態マスタ一覧取得
     */
    public function index()
    {
        $employments = Employment::all();
        foreach ($employments as $e) {
            $e['status_name'] = Employment::STATUS[$e->status];
        }
        return response()->json(['employments' => $employments]);
    }

    /**
     * 雇用形態マスタ取得
     */
    public function show($id)
    {
        try {
            $employment = Employment::find($id);
            if (!$employment) {
                throw new ModelNotFoundException();
            }
            $employment['status_name'] = Employment::STATUS[$employment->status];

            // 気になるポイントを取得
            $employment_concern_points = DB::table('employment_concern_points')
                ->leftJoin('positions', 'employment_concern_points.position_id', '=', 'positions.id')
                ->leftJoin('commitment_terms', 'employment_concern_points.commitment_term_id', '=', 'commitment_terms.id')
                ->where('employment_concern_points.employment_id', $id)
                ->select(
                    'employment_concern_points.id',
                    'employment_concern_points.employment_id',
                    'employment_concern_points.position_id',
                    'positions.name as position_name',
                    'employment_concern_points.commitment_term_id',
                    'commitment_terms.name as commitment_term_name',
                    'employment_concern_points.title',
                    'employment_concern_points.description',
                    'employment_concern_points.sort',
                )
                ->get();
            $employment['employment_concern_points'] = $employment_concern_points;
            return response()->json(['employment' => $employment]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Employment not found'], 404);
        }
    }

    /**
     * 雇用形態マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
                'employment_concern_points' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data) {
                $employment = Employment::create($data);
                if ($data['employment_concern_points'] && is_array($data['employment_concern_points'])) {
                    $employment->employmentConcernPoints()->createMany($data['employment_concern_points']);
                }
            });
            
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 雇用形態マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
                'employment_concern_points' => 'nullable|array',
            ]);

            DB::transaction(function () use ($data, $id) {
                $employment = Employment::findOrFail($id);
                $employment->update($data);

                // 気になるポイントは一度削除して、再度作成
                $employment->employmentConcernPoints()->delete();
                if ($data['employment_concern_points'] && is_array($data['employment_concern_points'])) {
                    $employment->employmentConcernPoints()->createMany($data['employment_concern_points']);
                }
            });
            
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 雇用形態マスタ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $employment = Employment::find($id);
            if (!$employment) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($employment) {
                // 雇用形態気になるポイント削除
                $employment->employmentConcernPoints()->delete();
                // 雇用形態削除
                $employment->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Employment not found'], 404);
        }
    }

    /**
     * 雇用形態マスタ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 雇用形態気になるポイント削除
                EmploymentConcernPoint::whereIn('employment_id', $ids)
                    ->delete();
                // 雇用形態削除
                $deleted_count = Employment::whereIn('id', $ids)
                    ->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more employments not found'], 404);
        }
    }
}
