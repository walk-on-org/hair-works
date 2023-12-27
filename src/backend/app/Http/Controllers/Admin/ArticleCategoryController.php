<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ArticleCategoryController extends Controller
{
    /**
     * 特集記事カテゴリ一覧取得
     */
    public function index()
    {
        $article_categories = ArticleCategory::all();
        foreach ($article_categories as $a) {
            $a['status_name'] = ArticleCategory::STATUS[$a->status];
        }
        return response()->json(['article_categories' => $article_categories]);
    }

    /**
     * 特集記事カテゴリ取得
     */
    public function show($id)
    {
        try {
            $article_category = ArticleCategory::find($id);
            if (!$article_category) {
                throw new ModelNotFoundException();
            }
            $article_category['status_name'] = ArticleCategory::STATUS[$article_category->status];
            return response()->json(['article_category' => $article_category]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Article category not found'], 404);
        }
    }

    /**
     * 特集記事カテゴリ登録
     */
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            ArticleCategory::create($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 特集記事カテゴリ更新
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'permalink' => 'required|string',
                'status' => 'required',
            ]);
            $article_category = ArticleCategory::findOrFail($id);
            $article_category->update($data);
            return response()->json(['result' => 'ok']);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    }

    /**
     * 特集記事カテゴリ削除
     */
    public function destroy(Request $request, $id)
    {
        try {
            $article_category = ArticleCategory::find($id);
            if (!$article_category) {
                throw new ModelNotFoundException();
            }
            $article_category->delete();
            return response()->json(['result' => 'ok']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Article category not found'], 404);
        }
    }

    /**
     * 特集記事カテゴリ複数削除
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $ids = $request->input('ids');
            if (!$ids || !is_array($ids)) {
                throw new \InvalidArgumentException('Invalid or missing IDs parameter');
            }
            
            // 削除
            $deleted_count = ArticleCategory::whereIn('id', $ids)
                ->delete();
            return response()->json(['result' => 'ok']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'One or more article categories not found'], 404);
        }
    }
}
