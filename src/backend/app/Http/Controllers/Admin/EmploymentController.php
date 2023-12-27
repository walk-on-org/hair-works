<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
                if (isset($data['employment_concern_points']) && is_array($data['employment_concern_points'])) {
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
                'employment_concern_points.*.id' => '',
                'employment_concern_points.*.position_id' => '',
                'employment_concern_points.*.commitment_term_id' => '',
                'employment_concern_points.*.title' => 'required|string',
                'employment_concern_points.*.description' => 'required|string',
                'employment_concern_points.*.sort' => 'numeric',
            ]);

            DB::transaction(function () use ($data, $id) {
                $employment = Employment::findOrFail($id);
                $employment->update($data);

                // 気になるポイント
                if (isset($data['employment_concern_points']) && is_array($data['employment_concern_points'])) {
                    // 入力があったID以外は削除
                    $ids = array_column($data['employment_concern_points'], 'id');
                    if (count($ids) > 0) {
                        EmploymentConcernPoint::where('employment_id', $id)
                            ->whereNotIn('id', $ids)
                            ->delete();
                    } else {
                        $employment->employmentConcernPoints()->delete();
                    }
                    
                    // 入力があったデータは登録or更新
                    foreach ($data['employment_concern_points'] as $point) {
                        if (isset($point['id']) && !empty($point['id'])) {
                            // 登録済みのデータは更新
                            EmploymentConcernPoint::where('id', $point['id'])
                                ->update([
                                    'position_id' => $point['position_id'],
                                    'commitment_term_id' => $point['commitment_term_id'],
                                    'title' => $point['title'],
                                    'description' => $point['description'],
                                    'sort' => $point['sort'],
                                ]);
                        } else {
                            // 未登録データは登録
                            $employment->employmentConcernPoints()->create($point);
                        }
                    }
                } else {
                    // 入力がない場合は削除
                    $employment->employmentConcernPoints()->delete();
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
