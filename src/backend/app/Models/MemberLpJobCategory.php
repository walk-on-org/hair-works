<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberLpJobCategory extends Model
{
    use HasFactory;
    protected  $fillable = [
        'member_id',
        'lp_job_category_id',
    ];
}
