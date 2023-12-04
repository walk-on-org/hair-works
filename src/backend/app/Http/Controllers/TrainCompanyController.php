<?php

namespace App\Http\Controllers;

use App\Models\TrainCompany;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class TrainCompanyController extends Controller
{
    /**
     * 鉄道事業者マスタ一覧取得
     */
    public function index()
    {
        $train_companies = TrainCompany::all();
        foreach ($train_companies as $c) {
            $c['status_name'] = TrainCompany::STATUS[$c->stats];
        }
        return response()->json(['train_companies' => $train_companies]);
    }

    /**
     * 鉄道事業者マスタ取得
     */
    public function show($id)
    {
        try {
            $train_company = TrainCompany::find($id);
            if (!$train_company) {
                throw new ModelNotFoundException();
            }
            $train_company['status_name'] = TrainCompany::STATUS[$train_company->status];
            return response()->json(['train_company' => $train_company]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'TrainCompany not found'], 404);
        }
    }

    /**
     * 鉄道事業者マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_r' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
            ]);
            TrainCompany::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 鉄道事業者マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'name_r' => 'required|string',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
            ]);
            $train_company = TrainCompany::findOrFail($id);
            $train_company->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
