<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Library\RegisterRoot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    /**
     * 問い合わせデータ一覧取得
     */
    public function index(Request $request)
    {
        $query = Inquiry::join('prefectures', 'inquiries.prefecture_id', '=', 'prefectures.id');

        // 検索条件指定
        if ($request->salon_name) {
            $query = $query->where('inquiries.salon_name', 'LIKE', '%' . $request->salon_name . '%');
        }
        if ($request->name) {
            $query = $query->where('inquiries.name', 'LIKE', '%' . $request->name . '%');
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query->leftJoin('conversion_histories', 'inquiries.id', '=', 'conversion_histories.applicant_id')
            ->groupBy('inquiries.id')
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
                DB::raw('max(conversion_histories.utm_source) as utm_source'),
                DB::raw('max(conversion_histories.utm_medium) as utm_medium'),
                DB::raw('max(conversion_histories.utm_campaign) as utm_campaign'),
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $inquiries = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();
        foreach ($inquiries as $i) {
            $i->inquiry_type_name = Inquiry::INQUIRY_TYPE[$i->inquiry_type];
            $i->status_name = Inquiry::STATUS[$i->status];
            $i->register_root = RegisterRoot::getRegisterRootByUtmParams($i->utm_source, $i->utm_medium, $i->utm_campaign, true);
        }
        return response()->json(['inquiries' => $inquiries, 'inquiries_count' => $count]);
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

            // 登録経路
            $conversion_histories = $inquiry->conversionHistories;
            foreach ($conversion_histories as $cvh) {
                $inquiry['register_root'] = RegisterRoot::getRegisterRootByUtmParams($cvh->utm_source, $cvh->utm_medium, $cvh->utm_campaign, true);
                break;
            }
            
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
