<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected  $fillable = [
        'name',
        'office_id',
        'status',
        'pickup',
        'private',
        'recommend',
        'indeed_private',
        'minimum_wage_ok',
        'job_category_id',
        'position_id',
        'employment_id',
        'm_salary_lower',
        'm_salary_upper',
        't_salary_lower',
        't_salary_upper',
        'd_salary_lower',
        'd_salary_upper',
        'commission_lower',
        'commission_upper',
        'salary',
        'work_time',
        'job_description',
        'holiday',
        'welfare',
        'entry_requirement',
        'catch_copy',
        'recommend_point',
        'salon_message',
        'publish_start_date',
        'publish_end_date',
    ];

    const STATUS = [
        0 => '掲載準備中',
        5 => '掲載承認待ち',
        9 => '掲載承認済',
        10 => '掲載中',
        20 => '掲載停止',
    ];

    const PICKUP = [
        1 => 'ピックアップ',
        0 => '通常',
    ];

    const PRIVATE = [
        1 => '非公開',
        0 => '通常',
    ];

    const RECOMMEND = [
        1 => 'オススメ',
        0 => '通常',
    ];

    const INDEED_PRIVATE = [
        1 => 'はい',
        0 => 'いいえ',
    ];

    const MINIMUM_WAGE_OK = [
        1 => 'はい',
        0 => 'いいえ',
    ];

    public function office() {
        return $this->belongsTo('App\Models\Office');
    }

    public function jobCategory() {
        return $this->belongsTo('App\Models\JobCategory');
    }
    
    public function employment() {
        return $this->belongsTo('App\Models\Employment');
    }

    public function position() {
        return $this->belongsTo('App\Models\Position');
    }

    public function holidays() {
        return $this->belongsToMany('App\Models\Holiday', 'job_holidays');
    }

    public function commitmentTerms() {
        return $this->belongsToMany('App\Models\CommitmentTerm', 'job_commitment_terms');
    }

    public function qualifications() {
        return $this->belongsToMany('App\Models\Qualification', 'job_qualifications');
    }

    public function jobImages() {
        return $this->hasMany('App\Models\JobImage');
    }

    public function jobHolidays() {
        return $this->hasMany('App\Models\JobHoliday');
    }

    public function jobCommitmentTerms() {
        return $this->hasMany('App\Models\JobCommitmentTerm');
    }

    public function jobQualifications() {
        return $this->hasMany('App\Models\JobQualification');
    }
}
