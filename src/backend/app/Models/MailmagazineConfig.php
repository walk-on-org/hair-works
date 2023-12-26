<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailmagazineConfig extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'deliver_job_type',
        'job_keyword',
        'member_birthyear_from',
        'member_birthyear_to',
        'job_match_lp_job_category',
        'job_match_employment',
        'job_match_distance',
        'job_count_limit',
        'search_other_corporation',
    ];

    const DELIVER_JOB_TYPE = [
        0 => '新着求人',
        1 => '半径〇〇km以内の求人',
        2 => '同じ都道府県の求人',
        3 => '同じ市区町村の求人',
    ];

    const JOB_MATCH_LP_JOB_CATEGORY = [
        0 => 'いいえ',
        1 => 'はい',
    ];

    const JOB_MATCH_EMPLOYMENT = [
        0 => 'いいえ',
        1 => 'はい',
    ];

    const SEARCH_OTHER_CORPORATION = [
        0 => 'いいえ',
        1 => 'はい',
    ];

    // 求人法人
    public function jCorporations() {
        return $this->belongsToMany('App\Models\Corporation', 'mailmagazine_j_corporations');
    }
    public function mailmagazineJCorporations() {
        return $this->hasMany('App\Models\MailmagazineJCorporation');
    }

    // 求人職種
    public function jJobCategories() {
        return $this->belongsToMany('App\Models\JobCategory', 'mailmagazine_j_job_categories');
    }
    public function mailmagazineJJobCategories() {
        return $this->hasMany('App\Models\MailmagazineJJobCategory');
    }

    // 会員住所
    public function mailmagazineMAreas() {
        return $this->hasMany('App\Models\MailmagazineMArea');
    }

    // 会員希望転職時期
    public function mailmagazineMChangeTimes() {
        return $this->hasMany('App\Models\MailmagazineMChangeTime');
    }

    // 会員希望勤務体系
    public function mEmployments() {
        return $this->belongsToMany('App\Models\Employment', 'mailmagazine_m_employments');
    }
    public function mailmagazineMEmployments() {
        return $this->hasMany('App\Models\MailmagazineMEmployment');
    }

    // 会員希望勤務地
    public function mEmpPrefectures() {
        return $this->belongsToMany('App\Models\Prefecture', 'mailmagazine_m_emp_prefectures', 'mailmagazine_config_id', 'emp_prefecture_id');
    }
    public function mailmagazineMEmpPrefectures() {
        return $this->hasMany('App\Models\MailmagazineMEmpPrefecture');
    }

    // 会員希望職種
    public function mLpJobCategories() {
        return $this->belongsToMany('App\Models\LpJobCategory', 'mailmagazine_m_lp_job_categories');
    }
    public function mailmagazineMLpJobCategories() {
        return $this->hasMany('App\Models\MailmagazineMLpJobCategory');
    }

    // 会員保有資格
    public function mQualifications() {
        return $this->belongsToMany('App\Models\Qualification', 'mailmagazine_m_qualifications');
    }
    public function mailmagazineMQualifications() {
        return $this->hasMany('App\Models\MailmagazineMQualification');
    }

    // 会員状態
    public function mailmagazineMStatuses() {
        return $this->hasMany('App\Models\MailmagazineMStatus');
    }
}
