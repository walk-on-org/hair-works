<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;

class ArticleCategoryController extends Controller
{
    /**
     * 特集記事カテゴリマスタ全件取得
     */
    public function index(Request $request)
    {
        $query = ArticleCategory::join('articles', 'article_categories.id', '=', 'articles.article_category_id')
            ->where('article_categories.status', 1)
            ->where('articles.status', 1);
        if ($request->category) {
            $query = $query->where('article_categories.permalink', $request->category);
        }
        $article_categories = $query->distinct()
            ->select(
                'article_categories.id',
                'article_categories.name',
                'article_categories.permalink',
            )
            ->get();
        return self::responseSuccess(['article_categories' => $article_categories]);
    }
}