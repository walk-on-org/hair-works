<?php

namespace App\Library;

use App\Models\MemberLpJobCategory;
use App\Models\MemberQualification;
use Illuminate\Support\Facades\Facade;

class MemberUtil extends Facade
{
    /**
     * エージェント→求人広告へのDV判定
     * 
     * 年齢45歳より上
     * 希望職種がアイリスト/カラーリスト/ヘアメイク/レセプション
     * 保有資格が学生（通信制）
     */
    public static function isSendCustomerFromAgentToJobad($member)
    {
        // 年齢45歳より上
        $age = intval(date('Y')) - $member->birthyear;
        if ($age > 45) {
            return true;
        }

        // 希望職種がアイリスト/カラーリスト/ヘアメイク/レセプション
        $lp_job_category = MemberLpJobCategory::where('member_id', $member->id)
            ->first();
        if ($lp_job_category
            && in_array($lp_job_category->lp_job_category_id, [4, 5, 6, 7])) {
            return true;
        }

        // 保有資格が学生（通信制）
        $qualifications = MemberQualification::where('member_id', $member->id)
            ->get();
        if (in_array(7, array_column($qualifications->toArray(), 'qualification_id'))) {
            return true;
        }

        // 上記以外は送客しない
        return false;
    }

    /**
     * LP職種より役職/役割のIDに変換
     */
    public static function convertLpJobCategoryToPosition($member_id)
    {
        $lp_job_category = MemberLpJobCategory::where('member_id', $member_id)
            ->first();
        if ($lp_job_category) {
            if ($lp_job_category->lp_job_category_id == 1) {
                return 1;
            } else if (in_array($lp_job_category->lp_job_category_id, [2, 3])) {
                return 2;
            } else if ($lp_job_category->lp_job_category_id == 4) {
                return 6;
            } else if ($lp_job_category->lp_job_category_id == 5) {
                return 7;
            } else if ($lp_job_category->lp_job_category_id == 6) {
                return 8;
            } else if ($lp_job_category->lp_job_category_id == 7) {
                return 5;
            }
        }

        return null;
    }
}