<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantQualification extends Model
{
    use HasFactory;
    protected  $fillable = [
        'applicant_id',
        'qualification_id',
    ];
}
