<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminUserCorporation extends Model
{
    use HasFactory;
    protected $fillable = [
        'admin_user_id',
        'corporation_id',
    ];
}
