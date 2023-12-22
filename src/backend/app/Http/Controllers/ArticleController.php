<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    /**
     * 特集記事データ一覧取得
     */
    public function index()
    {
        $articles = DB::table('articles')
            ->join('article_categories', 'articles.article_category_id', '=', 'article_categories.id')
            ->leftJoin('commitment_terms', 'articles.commitment_term_id', '=', 'commitment_terms.id')
            ->leftJoin('positions', 'articles.position_id', '=', 'positions.id')
            ->select(
                'articles.id',
                'articles.title',
                'articles.description',
                'articles.article_category_id',
                'article_categories.name as article_category_name',
                'articles.permalink',
                'articles.status',
                'articles.main_image',
                'articles.content',
                'articles.add_cta',
                'articles.commitment_term_id',
                'commitment_terms.name as commitment_term_name',
                'articles.position_id',
                'positions.name as position_name',
                'articles.m_salary_lower',
                'articles.updated_at',
            )
            ->get();
        foreach ($articles as $a) {
            $a->status_name = Article::STATUS[$a->status];
            $a->add_cta_name = Article::ADD_CTA[$a->add_cta];
        }
        return response()->json(['articles' => $articles]);
    }

    /**
     * 特集記事データ取得
     */
    public function show($id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                throw new ModelNotFoundException();
            }

            $article['article_category_name'] = $article->articleCategory->name;
            $article['commitment_term_name'] = $article->commitmentTerm ? $article->commitmentTerm->name : null;
            $article['position_name'] = $article->position ? $article->position->name : null;
            $article['status_name'] = Article::STATUS[$article->status];
            $article['add_cta_name'] = Article::ADD_CTA[$article->add_cta];
            if ($article->main_image) {
                $article->main_image = config('uploadimage.article_image_path') . $article->id . '/' . $article->main_image;
            }

            return response()->json(['article' => $article]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Article not found'], 404);
        }
    }

    /**
     * 特集記事データ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'article_category_id' => 'numeric|exists:article_categories,id',
                'permalink' => 'required|string',
                'status' => 'numeric',
                'main_image' => 'file|mimes:jpeg,jpg,png,webp',
                'content' => '',
                'add_cta' => 'numeric|regex:/^[0-1]{1}$/',
                'commitment_term_id' => 'nullable|numeric|exists:commitment_terms,id',
                'position_id' => 'nullable|numeric|exists:positions,id',
                'm_salary_lower' => 'nullable|numeric',
            ]);

            if ($request->hasFile('main_image')) {
                $uploaded_file = $request->file('main_image');
                $filename = time() . '_' . $uploaded_file->getClientOriginalName();
                $data['main_image'] = $filename;
            }

            $article = Article::create($data);
            if ($request->hasFile('main_image')) {
                $uploaded_file->storeAs(config('uploadimage.article_image_storage') . $article->id, $filename);
            }

            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 特集記事データ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'article_category_id' => 'numeric|exists:article_categories,id',
                'permalink' => 'required|string',
                'status' => 'numeric',
                'main_image' => '',
                'content' => '',
                'add_cta' => 'numeric|regex:/^[0-1]{1}$/',
                'commitment_term_id' => 'nullable|numeric|exists:commitment_terms,id',
                'position_id' => 'nullable|numeric|exists:positions,id',
                'm_salary_lower' => 'nullable|numeric',
            ]);

            $article = Article::findOrFail($id);
            if ($request->hasFile('main_image')) {
                // 画像設定
                $data['main_image'] = UploadImage::uploadImageFile(
                    $request->file('main_image'),
                    config('uploadimage.article_image_storage'),
                    $article->id,
                    $article->main_image
                );
            } else {
                // 画像変更なし
                $data['main_image'] = $article->main_image;
            }
            $article->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 特集記事データ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $article = Article::find($id);
            if (!$article) {
                throw new ModelNotFoundException();
            }
            $article->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Article not found'], 404);
        }
    }

    /**
     * 特集記事データ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = Article::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more articles not found'], 404);
        }
    }
}
