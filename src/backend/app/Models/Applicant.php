<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Applicant extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'job_id',
        'status',
        'proposal_type',
        'name',
        'name_kana',
        'birthyear',
        'postcode',
        'prefecture_id',
        'address',
        'phone',
        'mail',
        'change_time',
        'retirement_time',
        'employment_id',
        'emp_prefecture_id',
        'note',
        'member_id',
    ];

    const PROPOSAL_TYPE = [
        1 => '面接希望',
        2 => '見学希望',
    ];

    const STATUS = [
        0 => '未対応',
        1 => '連絡不通',
        2 => '辞退',
        3 => '連絡済',
        4 => '面接済',
        5 => '内定',
        6 => '入社済',
        7 => '見学/面接後NG',
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

    public function job() {
        return $this->belongsTo('App\Models\Job');
    }

    public function prefecture() {
        return $this->belongsTo('App\Models\Prefecture');
    }

    public function employment() {
        return $this->belongsTo('App\Models\Employment');
    }

    public function empPrefecture() {
        return $this->belongsTo('App\Models\Prefecture', 'emp_prefecture_id', 'id');
    }

    public function member() {
        return $this->belongsTo('App\Models\Member')->withDefault();
    }

    public function qualifications() {
        return $this->belongsToMany('App\Models\Qualification', 'applicant_qualifications');
    }

    public function lpJobCategories() {
        return $this->belongsToMany('App\Models\LpJobCategory', 'applicant_lp_job_categories');
    }

    public function applicantQualifications() {
        return $this->hasMany('App\Models\MemberQualification');
    }

    public function applicantLpJobCategories() {
        return $this->hasMany('App\Models\ApplicantLpJobCategory');
    }

    public function applicantContactHistories() {
        return $this->hasMany('App\Models\ApplicantContactHistory');
    }

    public function applicantProposalDatetimes() {
        return $this->hasMany('App\Models\ApplicantProposalDatetime');
    }

    public function applicantProposalDatetimesText() {
        $text_list = [];
        foreach ($this->applicantProposalDatetimes as $row) {
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
}
