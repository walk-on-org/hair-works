<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantProposalDatetime extends Model
{
    use HasFactory;
    protected  $fillable = [
        'applicant_id',
        'number',
        'date',
        'time_am',
        'time_12_14',
        'time_14_16',
        'time_16_18',
        'time_18_20',
        'time_all',
    ];
}
