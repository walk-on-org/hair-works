<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailmagazineMQualification extends Model
{
    use HasFactory;
    protected $fillable = [
        'mailmagazine_config_id',
        'qualification_id',
    ];
}
