<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmploymentConcernPoint extends Model
{
    use HasFactory;
    protected  $fillable = [
        'employment_id',
        'position_id',
        'commitment_term_id',
        'title',
        'description',
        'sort',
    ];

    public function employment() {
        return $this->belongsTo('App\Models\Employment');
    }

    public function position() {
        return $this->belongsTo('App\Models\Position');
    }

    public function commitmentTerm() {
        return $this->belongsTo('App\Models\CommitmentTerm');
    }
}
