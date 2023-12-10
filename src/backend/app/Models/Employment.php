<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employment extends Model
{
    use HasFactory;
    protected  $fillable = [
        'name',
        'permalink',
        'status',
    ];

    const STATUS = [
        1 => '有効',
        0 => '無効',
    ];

    public function employmentConcernPoints() {
        return $this->hasMany('App\Models\EmploymentConcernPoint');
    }
}
