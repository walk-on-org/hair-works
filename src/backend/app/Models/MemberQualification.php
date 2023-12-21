<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberQualification extends Model
{
    use HasFactory;
    protected  $fillable = [
        'member_id',
        'qualification_id',
    ];
}
