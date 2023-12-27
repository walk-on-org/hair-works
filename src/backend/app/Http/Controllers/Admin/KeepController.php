<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KeepController extends Controller
{
    /**
     * お気に入りデータ一覧取得
     */
    public function index()
    {
        $keeps = DB::table('keeps')
            ->join('jobs', 'keeps.job_id', '=', 'jobs.id')
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('offices', 'jobs.office_id', '=', 'offices.id')
            ->join('corporations', 'offices.corporation_id', '=', 'corporations.id')
            ->leftJoin('members', 'keeps.member_id', '=', 'members.id')
            ->select(
                'keeps.id',
                'keeps.member_id',
                'members.name as member_name',
                'offices.corporation_id',
                'corporations.name as corporation_name',
                'jobs.office_id',
                'offices.name as office_name',
                'keeps.job_id',
                'jobs.name as job_name',
                'jobs.job_category_id',
                'job_categories.name as job_category_name',
                'jobs.position_id',
                'positions.name as position_name',
                'jobs.employment_id',
                'employments.name as employment_name',
                'keeps.status',
                'keeps.keeped_at',
                'keeps.released_at',
            )
            ->get();
        foreach ($keeps as $k) {
            $k->status_name = Keep::STATUS[$k->status];
        }
        return response()->json(['keeps' => $keeps]);
    }
}
