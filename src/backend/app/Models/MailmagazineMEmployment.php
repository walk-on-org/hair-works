<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMEmployment extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'employment_id',
    ];
}
