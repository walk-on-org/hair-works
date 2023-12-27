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
    public function index()
    {
        $conversion_histories = DB::table('conversion_histories')
            ->leftJoin('ad_keywords', function ($join) {
                $join->on('conversion_histories.utm_source', '=', 'ad_keywords.utm_source');
                $join->on('conversion_histories.utm_medium', '=', 'ad_keywords.utm_medium');
                $join->on('conversion_histories.utm_campaign', '=', 'ad_keywords.utm_campaign');
                $join->on('conversion_histories.utm_term', '=', 'ad_keywords.keyword_id');
            })
            ->leftJoin('members', 'conversion_histories.member_id', '=', 'members.id')
            ->leftJoin('applicants', 'conversion_histories.applicant_id', '=', 'applicants.id')
            ->leftJoin('inquiries', 'conversion_histories.inquiry_id', '=', 'inquiries.id')
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
            )
            ->get();
        return response()->json(['conversion_histories' => $conversion_histories]);
    }
}
