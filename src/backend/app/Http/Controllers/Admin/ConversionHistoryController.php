<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConversionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConversionHistoryController extends Controller
{
    /**
     * CV経路データ一覧取得
     */
    public function index(Request $request)
    {
        $query = ConversionHistory::leftJoin('ad_keywords', function ($join) {
                $join->on('conversion_histories.utm_source', '=', 'ad_keywords.utm_source');
                $join->on('conversion_histories.utm_medium', '=', 'ad_keywords.utm_medium');
                $join->on('conversion_histories.utm_campaign', '=', 'ad_keywords.utm_campaign');
                $join->on('conversion_histories.utm_term', '=', 'ad_keywords.keyword_id');
            });
        
        // 検索条件指定
        if ($request->utm_source) {
            $query = $query->where('conversion_histories.utm_source', 'LIKE', '%' . $request->utm_source . '%');
        }
        if ($request->utm_medium) {
            $query = $query->where('conversion_histories.utm_medium', 'LIKE', '%' . $request->utm_medium . '%');
        }
        if ($request->utm_campaign) {
            $query = $query->where('conversion_histories.utm_campaign', 'LIKE', '%' . $request->utm_campaign . '%');
        }
        if ($request->utm_term) {
            $query = $query->where('conversion_histories.utm_term', 'LIKE', '%' . $request->utm_term . '%');
        }
        if ($request->lp_url) {
            $query = $query->where('conversion_histories.lp_url', 'LIKE', '%' . $request->lp_url . '%');
        }
        if ($request->lp_start_date) {
            $query = $query->whereDate('conversion_histories.lp_date', '>=', $request->lp_start_date);
        }
        if ($request->lp_end_date) {
            $query = $query->whereDate('conversion_histories.lp_date', '<=', $request->lp_end_date);
        }
        if ($request->cv_url) {
            $query = $query->where('conversion_histories.cv_url', 'LIKE', '%' . $request->cv_url . '%');
        }
        if ($request->cv_start_date) {
            $query = $query->whereDate('conversion_histories.cv_date', '>=', $request->cv_start_date);
        }
        if ($request->cv_end_date) {
            $query = $query->whereDate('conversion_histories.cv_date', '<=', $request->cv_end_date);
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query
            ->leftJoin('members', function ($join) {
                $join->on('conversion_histories.member_id', '=', 'members.id')
                    ->whereNull('members.deleted_at');
            })
            ->leftJoin('applicants', function ($join) {
                $join->on('conversion_histories.applicant_id', '=', 'applicants.id')
                    ->whereNull('applicants.deleted_at');
            })
            ->leftJoin('inquiries', function ($join) {
                $join->on('conversion_histories.inquiry_id', '=', 'inquiries.id')
                    ->whereNull('inquiries.deleted_at');
            })
            ->select(
                'conversion_histories.id',
                'conversion_histories.utm_source',
                'conversion_histories.utm_medium',
                'conversion_histories.utm_campaign',
                'conversion_histories.utm_term',
                'ad_keywords.keyword',
                'conversion_histories.lp_url',
                'conversion_histories.lp_date',
                'conversion_histories.cv_url',
                'conversion_histories.cv_date',
                'conversion_histories.member_id',
                'members.name as member_name',
                'conversion_histories.applicant_id',
                'applicants.name as applicant_name',
                'conversion_histories.inquiry_id',
                'inquiries.name as inquiry_name',
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $conversion_histories = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        return response()->json(['conversion_histories' => $conversion_histories, 'conversion_histories_count' => $count]);
    }
}
