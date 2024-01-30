<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Office;

class GenerateSitemapSalon extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate-salon';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'サロンページのsitemap.xml作成';

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

        // サロンページ
        $offices = Office::join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('offices.id')
            ->select(
                'offices.id as office_id',
                DB::raw('max(jobs.publish_start_date) as publish_start_date'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($offices as $office) {
            $now = strtotime('now');
            $lastmod = strtotime($office->updated_at);
            if ($now - strtotime($office->updated_at . ' 6 month') > 0) {
                // 更新日が現在から半年より経過している場合、掲載開始日 + 6n月後
                $lastmod = strtotime($office->publish_start_date);
                while ($now - strtotime(date('Y-m-d H:i:s', $lastmod) . ' 6 month') >= 0) {
                    $lastmod = strtotime(date('Y-m-d H:i:s', $lastmod) . ' 6 month');
                }
            }
            
            $url = Url::create($host . '/salon/' . $office->office_id)
                ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', $lastmod)))->timezone('Asia/Tokyo'))
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.5);
            $sitemap->add($url);
        }

        $sitemap->writeToFile(public_path('sitemaps/salon/sitemap.xml'));

        // TODO gz圧縮
    }
}