<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    /**
     * 特集記事全件取得
     */
    public function index(Request $request)
    {
        $query = Article::join('article_categories', 'articles.article_category_id','=', 'article_categories.id')
            ->leftJoin('commitment_terms', 'articles.commitment_term_id', '=', 'commitment_terms.id')
            ->leftJoin('positions', 'articles.position_id', '=', 'positions.id')
            ->orderBy('articles.created_at', 'desc')
            ->select(
                'articles.id',
                'articles.title',
                'articles.permalink',
                'articles.description',
                'articles.main_image',
                'articles.add_cta',
                'articles.content',
                'articles.commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'articles.position_id',
                'positions.name as position_name',
                'articles.m_salary_lower',
                'article_categories.name as category_name',
                'article_categories.permalink as category_permalink',
                DB::raw('date_format(articles.created_at, \'%Y年%m月%d日\') as created_ymd'),
                DB::raw('date_format(articles.updated_at, \'%Y年%m月%d日\') as updated_ymd'),
            );
        // プレビュー
        if (!$request->preview) {
            $query = $query->where('articles.status', 1);
        }
        // カテゴリ指定
        if ($request->category) {
            $query = $query->where('article_categories.permalink', $request->category);
        }
        // アーカイブ指定
        if ($request->archive) {
            $query = $query->whereRaw('DATE_FORMAT(articles.created_at, \'%Y%m\') = ?', $request->archive);
        }
        // 記事指定
        if ($request->article) {
            $query = $query->where('articles.permalink', $request->article);
        }
        // 関連条件指定
        if ($request->commitment_term_id || $request->position_id || $request->m_salary_lower) {
            $query = $query->where(function ($q) use ($request) {
                $q->where('articles.position_id', $request->position_id);
                if ($request->commiment_term_id) {
                    $q->orWhereIn('articles.commitment_term_id', explode(',', $request->commitment_term_id));
                }
                if ($request->m_salary_lower) {
                    $q->orWhere('articles.m_salary_lower', '<=', $request->m_salary_lower);
                }
            });
        }
        // 1ページ分取得する
        $query = $query->limit($request->limit ? $request->limit : 20);
        if ($request->page) {
            $query = $query->offset(20 * (intval($request->page) - 1));
        }
        $articles = $query->get();

        // 取得結果を整形
        foreach ($articles as $article) {
            $article->add_cta = $article->add_cta ? true : false;
            $article->main_image = [
                'url' => config('uploadimage.article_image_relative_path') . $article->id . '/' . $article->main_image,
            ];
        }

        return self::responseSuccess(['articles' => $articles]);
    }

    /**
     * 特集新着記事取得
     */
    public function getNewArrival()
    {
        $articles = Article::join('article_categories', 'articles.article_category_id','=', 'article_categories.id')
            ->where('articles.status', 1)
            ->orderBy('articles.updated_at', 'desc')
            ->select(
                'articles.id',
                'articles.title',
                'articles.permalink',
                'articles.description',
                'articles.main_image',
                'articles.add_cta',
                'articles.content',
                'article_categories.name as category_name',
                'article_categories.permalink as category_permalink',
                DB::raw('date_format(articles.updated_at, \'%Y年%m月%d日\') as updated_ymd'),
            )
            ->limit(3)
            ->get();

        // 取得結果を整形
        foreach ($articles as $article) {
            $article->add_cta = $article->add_cta ? true : false;
            $article->main_image = [
                'url' => config('uploadimage.article_image_relative_path') . $article->id . '/' . $article->main_image,
            ];
        }

        return self::responseSuccess(['articles' => $articles]);
    }

    /**
     * 特集関連記事取得
     */
    public function getRelation(Request $request)
    {
        $query = Article::join('article_categories', 'articles.article_category_id','=', 'article_categories.id')
            ->where('articles.status', 1)
            ->orderByRaw('RAND()')
            ->select(
                'articles.id',
                'articles.title',
                'articles.permalink',
                'articles.description',
                'articles.main_image',
                'articles.add_cta',
                'articles.content',
                'article_categories.name as category_name',
                'article_categories.permalink as category_permalink',
                DB::raw('date_format(articles.updated_at, \'%Y年%m月%d日\') as updated_ymd'),
            )
            ->limit(3);
        if ($request->category) {
            $query = $query->where('article_categories.permalink', $request->category);
        }
        $articles = $query->get();

        // 取得結果を整形
        foreach ($articles as $article) {
            $article->add_cta = $article->add_cta ? true : false;
            $article->main_image = [
                'url' => config('uploadimage.article_image_relative_path') . $article->id . '/' . $article->main_image,
            ];
        }

        return self::responseSuccess(['articles' => $articles]);
    }

    /**
     * 特集記事件数取得
     */
    public function getCount(Request $request)
    {
        $query = Article::join('article_categories', 'articles.article_category_id','=', 'article_categories.id')
            ->where('articles.status', 1);
        // カテゴリ指定
        if ($request->category) {
            $query = $query->where('article_categories.permalink', $request->category);
        }
        // アーカイブ指定
        if ($request->archive) {
            $query = $query->whereRaw('DATE_FORMAT(articles.created_at, \'%Y%m\') = ?', $request->archive);
        }
        $count = $query->count();

        return self::responseSuccess(['count' => $count]);
    }
}