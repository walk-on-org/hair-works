<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Article;

class GenerateSitemapOther extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate-other';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'その他ページのsitemap.xml作成';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $host = config('app.front_url');
        $sitemap = Sitemap::create();

        // TOPページ
        $sitemap->add(
            Url::create($host . '/')
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s')))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_ALWAYS)
                ->setPriority(1.0)
        );

        // 求人検索ページ
        $sitemap->add(
            Url::create($host . '/search')
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s')))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5)
        );

        // 問い合わせページ
        $sitemap->add(
            Url::create($host . '/inquiry')
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s')))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5)
        );

        // 特集記事一覧ページ（カテゴリなし）
        $result = Article::where('articles.status', 1)
            ->select(
                DB::raw('max(articles.updated_at) as updated_at')
            )
            ->get();
        foreach ($result as $row) {
            $url = Url::create($host . '/article')
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', strtotime($row->updated_at))))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5);
            $sitemap->add($url);
        }

        // 特集記事一覧ページ（カテゴリあり）
        $result = Article::join('article_categories', 'articles.article_category_id', '=', 'article_categories.id')
            ->where('articles.status', 1)
            ->where('article_categories.status', 1)
            ->groupBy('article_categories.permalink')
            ->select(
                'article_categories.permalink as permalink',
                DB::raw('max(articles.updated_at) as updated_at')
            )
            ->get();
        foreach ($result as $row) {
            $url = Url::create($host . '/article/' . $row->permalink)
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', strtotime($row->updated_at))))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5);
            $sitemap->add($url);
        }

        // 特集記事ページ
        $articles = Article::join('article_categories', 'articles.article_category_id', '=', 'article_categories.id')
            ->where('articles.status', 1)
            ->where('article_categories.status', 1)
            ->select(
                'article_categories.permalink as category_permalink',
                'articles.permalink as article_permalink',
                'articles.updated_at',
            )
            ->get();
        foreach ($articles as $article) {            
            $url = Url::create($host . '/article/' . $article->category_permalink . '/' . $article->article_permalink)
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', strtotime($article->updated_at))))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5);
            $sitemap->add($url);
        }

        $sitemap->writeToFile(public_path('sitemaps/other/sitemap.xml'));

        // TODO gz圧縮
    }
}