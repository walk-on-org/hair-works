<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantLpJobCategory extends Model
{
    use HasFactory;
    protected  $fillable = [
        'applicant_id',
        'lp_job_category_id',
    ];
}
