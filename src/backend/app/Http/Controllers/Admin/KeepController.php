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
    public function index(Request $request)
    {
        $query = Keep::join('jobs', function ($join) {
                $join->on('keeps.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('corporations', function ($join) {
                $join->on('offices.corporation_id', '=', 'corporations.id')
                    ->whereNull('corporations.deleted_at');
            })
            ->leftJoin('members', function ($join) {
                $join->on('keeps.member_id', '=', 'members.id')
                    ->whereNull('members.deleted_at');
            });

        // 検索条件指定
        if ($request->corporation_name) {
            $query = $query->where('corporations.name', 'LIKE', '%' . $request->corporation_name . '%');
        }
        if ($request->office_name) {
            $query = $query->where('offices.name', 'LIKE', '%' . $request->office_name . '%');
        }
        if ($request->job_name) {
            $query = $query->where('jobs.name', 'LIKE', '%' . $request->job_name . '%');
        }
        if ($request->job_category_id) {
            $job_category_id = is_array($request->job_category_id) ? $request->job_category_id : explode(',', $request->job_category_id);
            $query = $query->whereIn('jobs.job_category_id', $job_category_id);
        }
        if ($request->position_id) {
            $position_id = is_array($request->position_id) ? $request->position_id : explode(',', $request->position_id);
            $query = $query->whereIn('jobs.position_id', $position_id);
        }
        if ($request->employment_id) {
            $employment_id = is_array($request->employment_id) ? $request->employment_id : explode(',', $request->employment_id);
            $query = $query->whereIn('jobs.employment_id', $employment_id);
        }
        if ($request->status) {
            $status = is_array($request->status) ? $request->status : explode(',', $request->status);
            $query = $query->whereIn('keeps.status', $status);
        }

        // 件数取得
        $count = $query->count();

        // データ取得
        $query = $query->select(
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
            );
        if ($request->order && $request->orderBy) {
            $query = $query->orderBy($request->orderBy, $request->order);
        }
        $limit = $request->limit ? intval($request->limit) : 10;
        $page = $request->page ? intval($request->page) : 1;
        $keeps = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->get();

        foreach ($keeps as $k) {
            $k->status_name = Keep::STATUS[$k->status];
        }
        return response()->json(['keeps' => $keeps, 'keeps_count' => $count]);
    }
}
