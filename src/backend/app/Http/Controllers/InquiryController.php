<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    /**
     * 問い合わせデータ一覧取得
     */
    public function index()
    {
        $inquiries = DB::table('inquiries')
            ->join('prefectures', 'inquiries.prefecture_id', '=', 'prefectures.id')
            ->select(
                'inquiries.id',
                'inquiries.salon_name',
                'inquiries.name',
                'inquiries.prefecture_id',
                'prefectures.name as prefecture_name',
                'inquiries.tel',
                'inquiries.mail',
                'inquiries.inquiry_type',
                'inquiries.inquiry_note',
                'inquiries.status',
                'inquiries.created_at',
            )
            ->get();
        foreach ($inquiries as $i) {
            $i->inquiry_type_name = Inquiry::INQUIRY_TYPE[$i->inquiry_type];
            $i->status_name = Inquiry::STATUS[$i->status];
        }
        return response()->json(['inquiries' => $inquiries]);
    }

    /**
     * 問い合わせデータ取得
     */
    public function show($id)
    {
        try {
            $inquiry = Inquiry::find($id);
            if (!$inquiry) {
                throw new ModelNotFoundException();
            }

            $inquiry['prefecture_name'] = $inquiry->prefecture->name;
            $inquiry['inquiry_type_name'] = Inquiry::INQUIRY_TYPE[$inquiry->inquiry_type];
            $inquiry['status_name'] = Inquiry::STATUS[$inquiry->status];

            return response()->json(['inquiry' => $inquiry]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Inquiry not found'], 404);
        }
    }

    /**
     * 問い合わせデータ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'status' => 'numeric',
            ]);

            DB::transaction(function () use ($data, $id) {
                $inquiry = Inquiry::findOrFail($id);
                $inquiry->update($data);
            });

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 問い合わせデータ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $inquiry = Inquiry::find($id);
            if (!$inquiry) {
                throw new ModelNotFoundException();
            }
            DB::transaction(function () use ($member) {
                // 問い合わせ削除
                $inquiry->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Inquiry not found'], 404);
        }
    }

    /**
     * 問い合わせデータ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            DB::transaction(function () use ($ids) {
                // 問い合わせ削除
                $deleted_count = Inquiry::whereIn('id', $ids)->delete();
            });
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more inquiries not found'], 404);
        }
    }
}
