<?php

namespace App\Http\Controllers;

use App\Models\CommitmentTerm;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CommitmentTermController extends Controller
{
    /**
     * こだわり条件マスタ一覧取得
     */
    public function index()
    {
        $commitment_terms = CommitmentTerm::all();
        foreach ($commitment_terms as $c) {
            $c['category_name'] = CommitmentTerm::CATEGORY[$c->category];
            $c['recommend_name'] = CommitmentTerm::RECOMMEND[$c->recommend];
            $c['status_name'] = CommitmentTerm::STATUS[$c->status];
        }
        return response()->json(['commitment_terms' => $commitment_terms]);
    }

    /**
     * こだわり条件マスタ取得
     */
    public function show($id)
    {
        try {
            $commitment_term = CommitmentTerm::find($id);
            if (!$commitment_term) {
                throw new ModelNotFoundException();
            }
            $commitment_term['category_name'] = CommitmentTerm::CATEGORY[$commitment_term->category];
            $commitment_term['recommend_name'] = CommitmentTerm::RECOMMEND[$commitment_term->recommend];
            $commitment_term['status_name'] = CommitmentTerm::STATUS[$commitment_term->status];
            return response()->json(['commitment_term' => $commitment_term]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'CommitmentTerm not found'], 404);
        }
    }

    /**
     * こだわり条件マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'category' => 'numeric',
                'recommend' => 'numeric',
                'status' => 'required',
            ]);
            CommitmentTerm::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * こだわり条件マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'category' => 'numeric',
                'recommend' => 'numeric',
                'status' => 'required',
            ]);
            $commitment_term = CommitmentTerm::findOrFail($id);
            $commitment_term->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
