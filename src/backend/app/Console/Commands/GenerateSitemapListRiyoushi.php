<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Job;
use App\Models\Office;

class GenerateSitemapListRiyoushi extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate-list-riyoushi';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '求人一覧（理容師）ページのsitemap.xml作成';

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

        // 都道府県 × 職種（理容師）の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->where('jobs.status', 10)
            ->where('jobs.job_category_id', 2) // 理容師
            ->where('job_categories.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('job_categories.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'job_categories.permalink as job_category_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->job_category_roman, $row->updated_at));
        }

        // 政令指定都市 × 職種（理容師）の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->where('jobs.status', 10)
            ->where('jobs.job_category_id', 2) // 理容師
            ->where('job_categories.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->groupBy('job_categories.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                'job_categories.permalink as job_category_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/' . $row->job_category_roman, $row->updated_at));
        }

        // 市区町村 × 職種（理容師）の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->where('jobs.status', 10)
            ->where('jobs.job_category_id', 2) // 理容師
            ->where('job_categories.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('job_categories.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'job_categories.permalink as job_category_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->job_category_roman, $row->updated_at));
        }

        // 路線 × 職種（理容師）の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->where('jobs.status', 10)
            ->where('jobs.job_category_id', 2) // 理容師
            ->where('lines.status', 0)
            ->where('job_categories.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->groupBy('job_categories.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                'job_categories.permalink as job_category_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/'. $row->job_category_roman, $row->updated_at));
        }

        // 駅 × 職種（理容師）の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
            ->where('jobs.status', 10)
            ->where('jobs.job_category_id', 2) // 理容師
            ->where('stations.status', 0)
            ->where('job_categories.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->groupBy('job_categories.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                'job_categories.permalink as job_category_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->station_roman . '/'. $row->job_category_roman, $row->updated_at));
        }

        $sitemap->writeToFile(public_path('sitemaps/list_riyoushi/sitemap.xml'));

        // TODO gz圧縮
    }

    /**
     * URLタグの作成
     */
    private function createUrlTag($url, $updated_at)
    {
        return Url::create($url)
            ->setLastModificationDate((new Carbon(date('Y-m-d H:i:s', strtotime($updated_at))))->timezone('Asia/Tokyo'))
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            ->setPriority(0.5);
    }
}