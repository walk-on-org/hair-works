<?php

namespace App\Http\Controllers;

use App\Models\Line;
use App\Models\TrainCompany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class LineController extends Controller
{
    /**
     * 路線マスタ一覧取得
     */
    public function index()
    {
        $lines = DB::table('lines')
            ->join('train_companies', 'lines.train_company_id', '=', 'train_companies.id')
            ->select(
                'lines.id',
                'lines.name',
                'lines.permalink',
                'lines.train_company_id',
                'train_companies.name as train_company_name',
                'lines.status',
                'lines.sort',
            )
            ->get();
        foreach ($lines as $l) {
            $l->status_name = Line::STATUS[$l->status];
        }
        return response()->json(['lines' => $lines]);
    }

    /**
     * 路線マスタ取得
     */
    public function show($id)
    {
        try {
            $line = Line::find($id);
            if (!$line) {
                throw new ModelNotFoundException();
            }
            $line['train_company_name'] = $line->trainCompany->name;
            $line['status_name'] = Line::STATUS[$line->status];
            return response()->json(['line' => $line]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Line not found'], 404);
        }
    }

    /**
     * 路線マスタ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'id' => 'numeric|unique:lines,id',
                'name' => 'required|string',
                'permalink' => 'required|string',
                'train_company_id' => 'numeric|exists:train_companies,id',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
            ]);

            Line::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 路線マスタ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'id' => 'numeric|unique:lines,id,' . $id . ',id',
                'name' => 'required|string',
                'permalink' => 'required|string',
                'train_company_id' => 'numeric|exists:train_companies,id',
                'status' => 'numeric|regex:/^[0-2]{1}$/',
                'sort' => 'numeric',
            ]);

            $line = Line::findOrFail($id);
            $line->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }
}
