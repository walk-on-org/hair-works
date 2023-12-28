<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\EmploymentConcernPoint;
use Illuminate\Http\Request;

class EmploymentConcernPointController extends Controller
{
    /**
     * 雇用形態気になるポイントマスタ全件取得
     */
    public function index(Request $request)
    {
        $query = EmploymentConcernPoint::leftJoin('commitment_terms', 'employment_concern_points.commitment_term_id', '=', 'commitment_terms.id')
            ->where('employment_concern_points.employment_id', $request->employment_id);
        if ($request->position_id) {
            $query = $query->where(function ($q) use ($request) {
                $q->where('employment_concern_points.position_id', $request->position_id)
                    ->orWhereNull('employment_concern_points.position_id');
            });
        }
        $employment_concern_points = $query->orderByRaw('employment_concern_points.position_id is null asc')
            ->orderBy('employment_concern_points.position_id')
            ->orderBy('employment_concern_points.sort')
            ->select(
                'employment_concern_points.id',
                'employment_concern_points.title',
                'employment_concern_points.description',
                'employment_concern_points.commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'commitment_terms.permalink as commitment_term_roman',
            )
            ->limit(3)
            ->get();
        return self::responseSuccess(['employment_concern_points' => $employment_concern_points]);
    }
}