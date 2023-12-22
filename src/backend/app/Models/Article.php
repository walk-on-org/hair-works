<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected  $fillable = [
        'title',
        'description',
        'article_category_id',
        'permalink',
        'status',
        'main_image',
        'content',
        'add_cta',
        'commitment_term_id',
        'position_id',
        'm_salary_lower',
    ];

    const STATUS = [
        0 => '掲載準備中',
        1 => '掲載中',
        2 => '掲載停止',
    ];

    const ADD_CTA = [
        0 => 'なし',
        1 => 'あり',
    ];

    public function articleCategory() {
        return $this->belongsTo('App\Models\ArticleCategory');
    }

    public function commitmentTerm() {
        return $this->belongsTo('App\Models\CommitmentTerm')->withDefault();
    }

    public function position() {
        return $this->belongsTo('App\Models\Position')->withDefault();
    }
}
