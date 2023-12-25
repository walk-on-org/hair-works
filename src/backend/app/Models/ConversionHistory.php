<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversionHistory extends Model
{
    use HasFactory;
    protected  $fillable = [
        'unique_id',
        'utm_source',
        'utm_medium',
        'utm_campaign'
        'utm_term',
        'lp_url',
        'lp_date',
        'cv_url',
        'cv_date',
        'member_id',
        'applicant_id',
        'inquiry_id',
    ];

    public function member() {
        return $this->belongsTo('App\Models\Member')->withDefault();
    }

    public function applicant() {
        return $this->belongsTo('App\Models\Applicant')->withDefault();
    }

    public function inquiry() {
        return $this->belongsTo('App\Models\Inquiry')->withDefault();
    }
}
