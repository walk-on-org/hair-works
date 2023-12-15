<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobCommitmentTerm extends Model
{
    use HasFactory;
    protected  $fillable = [
        'job_id',
        'commitment_term_id',
    ];
}
