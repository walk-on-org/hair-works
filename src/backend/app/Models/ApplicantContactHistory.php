<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicantContactHistory extends Model
{
    use HasFactory;
    protected  $fillable = [
        'applicant_id',
        'contact_date',
        'contact_memo',
    ];
}
