<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected  $fillable = [
        'salesforce_id',
        'name',
        'name_kana',
        'birthyear',
        'postcode',
        'prefecture_id',
        'address',
        'phone',
        'email',
        'password',
        'auth_token',
        'job_change_feeling',
        'change_time',
        'retirement_time',
        'employment_id',
        'emp_prefecture_id',
        'status',
        'register_site',
        'register_form',
        'job_id',
        'introduction_name',
        'introduction_member_id',
        'introduction_gift_status',
        'lat',
        'lng',
    ];

    const JOB_CHANGE_FEELING = [
        1 => '近いうちに転職したい',
        2 => '今は情報収集したい',
    ];

    const CHANGE_TIME = [
        0 => '1ヶ月以内',
        1 => '3ヶ月以内',
        2 => '6ヶ月以内',
        3 => '12ヶ月以内',
        4 => '新卒での就職希望',
        5 => '求人が見たいだけ',
    ];

    const RETIREMENT_TIME = [
        0 => '離職中/退職確定済み',
        1 => 'すぐに辞めたい',
        2 => '良い転職先があれば辞めたい',
        3 => 'まだ辞められるとは決められない',
        4 => '在学中（今年度卒業予定）',
        5 => '在学中（来年度以降卒業予定）',
    ];

    const STATUS = [
        0 => '未対応',
        1 => '連絡不通',
        2 => '辞退',
        3 => '連絡済',
        4 => '面接済',
        5 => '内定',
        6 => '入社済',
        7 => '該当求人なし',
        8 => '番号他人',
        9 => '応募済',
        10 => '重複',
        11 => '追客中',
        12 => '登録解除',
        13 => '面接設定済',
        14 => '日程調整中',
        15 => '時期先',
        16 => '見学設定済',
        17 => 'リリース（コンタクト有）',
        18 => 'リリース（コンタクト無）',
        19 => '追客中',
        20 => '面談済',
    ];

    const REGISTER_SITE = [
        1 => 'ヘアワークス',
        2 => 'ヘアワークスエージェント',
    ];

    const REGISTER_FORM = [
        1 => '会員登録フォーム',
        2 => '応募フォーム',
        3 => 'お友達紹介フォーム',
    ];

    const INTRODUCTION_GIFT_STATUS = [
        0 => '【対象外】お友達紹介LP以外',
        1 => '未確認',
        2 => '紹介者該当あり',
        3 => '登録者通電済み',
        4 => 'プレゼント済',
        90 => '【対象外】紹介者該当なし',
        91 => '【対象外】重複登録',
    ];

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function employment() {
        return $this->belongsTo('App\Models\Employment');
    }

    public function empPrefecture() {
        return $this->belongsTo('App\Models\Prefecture', 'emp_prefecture_id', 'id');
    }

    public function job() {
        return $this->belongsTo('App\Models\Job')->withDefault();
    }

    public function introductionMember() {
        return $this->belongsTo('App\Models\Member', 'introduction_member_id', 'id')->withDefault();
    }

    public function qualifications() {
        return $this->belongsToMany('App\Models\Qualification', 'member_qualifications');
    }

    public function lpJobCategories() {
        return $this->belongsToMany('App\Models\LpJobCategory', 'member_lp_job_categories');
    }

    public function memberQualifications() {
        return $this->hasMany('App\Models\MemberQualification');
    }

    public function memberLpJobCategories() {
        return $this->hasMany('App\Models\MemberLpJobCategory');
    }

    public function memberProposalDatetimes() {
        return $this->hasMany('App\Models\MemberProposalDatetime');
    }

    public function memberProposalDatetimesText() {
        $text_list = [];
        foreach ($this->memberProposalDatetimes as $row) {
            $times = [];
            if ($row->time_am == 1) {
                $times[] = '午前中';
            }
            if ($row->time_12_14 == 1) {
                $times[] = '12時～14時';
            }
            if ($row->time_14_16 == 1) {
                $times[] = '14時～16時';
            }
            if ($row->time_16_18 == 1) {
                $times[] = '16時～18時';
            }
            if ($row->time_18_20 == 1) {
                $times[] = '18時～20時';
            }
            if ($row->time_all == 1) {
                $times[] = '終日可';
            }
            $text_list[] = '第' . $row->number . '希望：' . date('Y/m/d', strtotime($row->date)) . ' ' . implode('、', $times);
        }
        return implode("\n", $text_list);
    }

    public function applicants() {
        return $this->hasMany('App\Models\Applicant');
    }
}
