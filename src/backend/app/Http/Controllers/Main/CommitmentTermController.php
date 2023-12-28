<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\CommitmentTerm;
use Illuminate\Http\Request;

class CommitmentTermController extends Controller
{
    /**
     * こだわり条件マスタ全件取得
     */
    public function index(Request $request)
    {
        $query = CommitmentTerm::where('status', 1);
        if ($request->category) {
            $query = $query->where('category', $request->category);
        }
        if ($request->recommend) {
            $query = $query->where('recommend', 1);
        }
        $commitment_terms = $query->orderBy('category')
            ->orderBy('id')
            ->select(
                'id',
                'name',
                'permalink as name_roma',
                'category',
            )
            ->get();
        foreach ($commitment_terms as $commitment_term) {
            $commitment_term->category = CommitmentTerm::CATEGORY[$commitment_term->category];
        }
        return self::responseSuccess(['commitment_terms' => $commitment_terms]);
    }

    /**
     * こだわり条件マスタ1件取得
     */
    public function show($id)
    {
        $commitment_term = CommitmentTerm::where('status', 1)
            ->where('id', $id)
            ->select(
                'id',
                'name',
                'permalink as name_roma',
                'category',
            )
            ->first();
        if ($commitment_term) {
            $commitment_term->category = CommitmentTerm::CATEGORY[$commitment_term->category];
        }
        return self::responseSuccess(['commitment_term' => $commitment_term]);
    }
}