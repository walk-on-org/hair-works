<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Job;

class GenerateSitemapDetail extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate-detail';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '詳細ページのsitemap.xml作成';

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

        // 求人詳細ページ
        $jobs = Job::where('jobs.status', 10)
            ->select(
                'jobs.id as job_id',
                'jobs.publish_start_date',
                'jobs.updated_at',
            )
            ->get();
        foreach ($jobs as $job) {
            $now = strtotime('now');
            $lastmod = strtotime($job->updated_at);
            if ($now - strtotime($job->updated_at . ' 6 month') > 0) {
                // 更新日が現在から半年より経過している場合、掲載開始日 + 6n月後
                $lastmod = strtotime($job->publish_start_date);
                while ($now - strtotime(date('Y-m-d H:i:s', $lastmod) . ' 6 month') >= 0) {
                    $lastmod = strtotime(date('Y-m-d H:i:s', $lastmod) . ' 6 month');
                }
            }
            
            $url = Url::create($host . '/detail/' . $job->job_id)
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', $lastmod)))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5);
            $sitemap->add($url);
        }

        $sitemap->writeToFile(public_path('sitemaps/detail/sitemap.xml'));

        // TODO gz圧縮
    }
}