<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMEmpPrefecture extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'emp_prefecture_id',
    ];
}
