<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMLpJobCategory extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'lp_job_category_id',
    ];
}
