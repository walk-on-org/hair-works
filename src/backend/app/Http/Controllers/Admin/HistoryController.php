<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    /**
     * 閲覧履歴データ一覧取得
     */
    public function index()
    {
        $histories = DB::table('histories')
            ->join('jobs', 'histories.job_id', '=', 'jobs.id')
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('offices', 'jobs.office_id', '=', 'offices.id')
            ->join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->leftJoin('members', 'histories.member_id', '=', 'members.id')
            ->select(
                'histories.id',
                'histories.member_id',
                'members.name as member_name',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'jobs.office_id',
                'offices.name as office_name',
                'histories.job_id',
                'jobs.name as job_name',
                'jobs.job_category_id',
                'job_categories.name as job_category_name',
                'jobs.position_id',
                'positions.name as position_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'histories.viewed_at',
            )
            ->get();
        return response()->json(['histories' => $histories]);
    }
}
