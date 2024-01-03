<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminUser extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tel',
        'admin_role_id',
    ];

    public function adminRole() {
        return $this->belongsTo('App\Models\AdminRole');
    }

    public function corporations() {
        return $this->belongsToMany('App\Models\Corporation', 'admin_user_corporations');
    }

    public function adminUserCorporations() {
        return $this->hasMany('App\Models\AdminUserCorporation');
    }
}
