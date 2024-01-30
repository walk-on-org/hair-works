<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Job;
use App\Models\Office;

class GenerateSitemapList extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate-list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '求人一覧ページのsitemap.xml作成';

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

        // 都道府県の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman, $row->updated_at));
        }

        // 都道府県 × 役職/役割の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->where('jobs.status', 10)
            ->where('positions.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('positions.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'positions.permalink as position_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->position_roman, $row->updated_at));
        }

        // 都道府県 × 雇用形態の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('employments.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('employments.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'employments.permalink as employment_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->employment_roman, $row->updated_at));
        }

        // 都道府県 × 休日の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
            ->join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('jobs.status', 10)
            ->where('holidays.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('holidays.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'holidays.permalink as holiday_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->holiday_roman, $row->updated_at));
        }

        // 都道府県 × 給与の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                DB::raw('max(jobs.m_salary_lower) as m_salary_lower'),
                DB::raw('max(jobs.t_salary_lower) as t_salary_lower'),
                DB::raw('max(jobs.d_salary_lower) as d_salary_lower'),
                DB::raw('max(jobs.commission_lower) as commission_lower'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            if ($row->m_salary_lower >= 160000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/gekkyu16', $row->updated_at));
            }
            if ($row->m_salary_lower >= 180000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/gekkyu18', $row->updated_at));
            }
            if ($row->m_salary_lower >= 200000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/gekkyu20', $row->updated_at));
            }
            if ($row->m_salary_lower >= 250000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/gekkyu25', $row->updated_at));
            }
            if ($row->m_salary_lower >= 300000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/gekkyu30', $row->updated_at));
            }
            if ($row->t_salary_lower >= 800) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/zikyu800', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/zikyu1000', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1200) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/zikyu1200', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1500) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/zikyu1500', $row->updated_at));
            }
            if ($row->d_salary_lower >= 8000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/nikyu8', $row->updated_at));
            }
            if ($row->d_salary_lower >= 10000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/nikyu10', $row->updated_at));
            }
            if ($row->d_salary_lower >= 15000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/nikyu15', $row->updated_at));
            }
            if ($row->d_salary_lower >= 20000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/nikyu20', $row->updated_at));
            }
            if ($row->commission_lower >= 40) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/buai40', $row->updated_at));
            }
            if ($row->commission_lower >= 50) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/buai50', $row->updated_at));
            }
            if ($row->commission_lower >= 60) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/buai60', $row->updated_at));
            }
            if ($row->commission_lower >= 70) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/buai70', $row->updated_at));
            }
            if ($row->commission_lower >= 80) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/buai80', $row->updated_at));
            }
        }

        // 都道府県 × こだわり条件の求人一覧ページ
        $result = Job::join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
            ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('jobs.status', 10)
            ->where('commitment_terms.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('commitment_terms.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->commitment_term_roman, $row->updated_at));
        }

        // 政令指定都市の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman, $row->updated_at));
        }

        // 政令指定都市 × 役職/役割の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->where('jobs.status', 10)
            ->where('positions.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->groupBy('positions.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                'positions.permalink as position_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/' . $row->position_roman, $row->updated_at));
        }

        // 政令指定都市 × 雇用形態の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('employments.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->groupBy('employments.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                'employments.permalink as employment_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/' . $row->employment_roman, $row->updated_at));
        }

        // 政令指定都市 × 休日の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
            ->join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('jobs.status', 10)
            ->where('holidays.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->groupBy('holidays.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                'holidays.permalink as holiday_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/' . $row->holiday_roman, $row->updated_at));
        }

        // 政令指定都市 × 給与の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                DB::raw('max(jobs.m_salary_lower) as m_salary_lower'),
                DB::raw('max(jobs.t_salary_lower) as t_salary_lower'),
                DB::raw('max(jobs.d_salary_lower) as d_salary_lower'),
                DB::raw('max(jobs.commission_lower) as commission_lower'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            if ($row->m_salary_lower >= 160000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/gekkyu16', $row->updated_at));
            }
            if ($row->m_salary_lower >= 180000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/gekkyu18', $row->updated_at));
            }
            if ($row->m_salary_lower >= 200000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/gekkyu20', $row->updated_at));
            }
            if ($row->m_salary_lower >= 250000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/gekkyu25', $row->updated_at));
            }
            if ($row->m_salary_lower >= 300000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/gekkyu30', $row->updated_at));
            }
            if ($row->t_salary_lower >= 800) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/zikyu800', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/zikyu1000', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1200) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/zikyu1200', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1500) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/zikyu1500', $row->updated_at));
            }
            if ($row->d_salary_lower >= 8000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/nikyu8', $row->updated_at));
            }
            if ($row->d_salary_lower >= 10000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/nikyu10', $row->updated_at));
            }
            if ($row->d_salary_lower >= 15000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/nikyu15', $row->updated_at));
            }
            if ($row->d_salary_lower >= 20000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/nikyu20', $row->updated_at));
            }
            if ($row->commission_lower >= 40) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/buai40', $row->updated_at));
            }
            if ($row->commission_lower >= 50) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/buai50', $row->updated_at));
            }
            if ($row->commission_lower >= 60) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/buai60', $row->updated_at));
            }
            if ($row->commission_lower >= 70) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/buai70', $row->updated_at));
            }
            if ($row->commission_lower >= 80) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/buai80', $row->updated_at));
            }
        }

        // 政令指定都市 × こだわり条件の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('government_cities', 'cities.government_city_id', '=', 'government_cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
            ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('jobs.status', 10)
            ->where('commitment_terms.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('government_cities.permalink')
            ->groupBy('commitment_terms.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'government_cities.permalink as government_city_roman',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->government_city_roman . '/' . $row->commitment_term_roman, $row->updated_at));
        }

        // 市区町村の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman, $row->updated_at));
        }

        // 市区町村 × 役職/役割の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->where('jobs.status', 10)
            ->where('positions.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('positions.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'positions.permalink as position_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->position_roman, $row->updated_at));
        }

        // 市区町村 × 雇用形態の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('employments.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('employments.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'employments.permalink as employment_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->employment_roman, $row->updated_at));
        }

        // 市区町村 × 休日の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
            ->join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('jobs.status', 10)
            ->where('holidays.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('holidays.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'holidays.permalink as holiday_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->holiday_roman, $row->updated_at));
        }

        // 市区町村 × 給与の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                DB::raw('max(jobs.m_salary_lower) as m_salary_lower'),
                DB::raw('max(jobs.t_salary_lower) as t_salary_lower'),
                DB::raw('max(jobs.d_salary_lower) as d_salary_lower'),
                DB::raw('max(jobs.commission_lower) as commission_lower'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            if ($row->m_salary_lower >= 160000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/gekkyu16', $row->updated_at));
            }
            if ($row->m_salary_lower >= 180000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/gekkyu18', $row->updated_at));
            }
            if ($row->m_salary_lower >= 200000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/gekkyu20', $row->updated_at));
            }
            if ($row->m_salary_lower >= 250000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/gekkyu25', $row->updated_at));
            }
            if ($row->m_salary_lower >= 300000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/gekkyu30', $row->updated_at));
            }
            if ($row->t_salary_lower >= 800) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/zikyu800', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/zikyu1000', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1200) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/zikyu1200', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1500) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/zikyu1500', $row->updated_at));
            }
            if ($row->d_salary_lower >= 8000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/nikyu8', $row->updated_at));
            }
            if ($row->d_salary_lower >= 10000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/nikyu10', $row->updated_at));
            }
            if ($row->d_salary_lower >= 15000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/nikyu15', $row->updated_at));
            }
            if ($row->d_salary_lower >= 20000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/nikyu20', $row->updated_at));
            }
            if ($row->commission_lower >= 40) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/buai40', $row->updated_at));
            }
            if ($row->commission_lower >= 50) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/buai50', $row->updated_at));
            }
            if ($row->commission_lower >= 60) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/buai60', $row->updated_at));
            }
            if ($row->commission_lower >= 70) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/buai70', $row->updated_at));
            }
            if ($row->commission_lower >= 80) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/buai80', $row->updated_at));
            }
        }

        // 市区町村 × こだわり条件の求人一覧ページ
        $result = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
            ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('jobs.status', 10)
            ->where('commitment_terms.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('commitment_terms.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->commitment_term_roman, $row->updated_at));
        }

        // 路線の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman, $row->updated_at));
        }

        // 路線 × 役職/役割の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->where('positions.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->groupBy('positions.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                'positions.permalink as position_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/'. $row->position_roman, $row->updated_at));
        }

        // 路線 × 雇用形態の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->where('employments.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->groupBy('employments.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                'employments.permalink as employment_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/'. $row->employment_roman, $row->updated_at));
        }

        // 路線 × 休日の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
            ->join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->where('holidays.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->groupBy('holidays.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                'holidays.permalink as holiday_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/'. $row->holiday_roman, $row->updated_at));
        }

        // 路線 × 給与の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                DB::raw('max(jobs.m_salary_lower) as m_salary_lower'),
                DB::raw('max(jobs.t_salary_lower) as t_salary_lower'),
                DB::raw('max(jobs.d_salary_lower) as d_salary_lower'),
                DB::raw('max(jobs.commission_lower) as commission_lower'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            if ($row->m_salary_lower >= 160000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/gekkyu16', $row->updated_at));
            }
            if ($row->m_salary_lower >= 180000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/gekkyu18', $row->updated_at));
            }
            if ($row->m_salary_lower >= 200000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/gekkyu20', $row->updated_at));
            }
            if ($row->m_salary_lower >= 250000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/gekkyu25', $row->updated_at));
            }
            if ($row->m_salary_lower >= 300000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/gekkyu30', $row->updated_at));
            }
            if ($row->t_salary_lower >= 800) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/zikyu800', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/zikyu1000', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1200) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/zikyu1200', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1500) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/zikyu1500', $row->updated_at));
            }
            if ($row->d_salary_lower >= 8000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/nikyu8', $row->updated_at));
            }
            if ($row->d_salary_lower >= 10000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/nikyu10', $row->updated_at));
            }
            if ($row->d_salary_lower >= 15000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/nikyu15', $row->updated_at));
            }
            if ($row->d_salary_lower >= 20000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/nikyu20', $row->updated_at));
            }
            if ($row->commission_lower >= 40) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/buai40', $row->updated_at));
            }
            if ($row->commission_lower >= 50) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/buai50', $row->updated_at));
            }
            if ($row->commission_lower >= 60) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/buai60', $row->updated_at));
            }
            if ($row->commission_lower >= 70) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/buai70', $row->updated_at));
            }
            if ($row->commission_lower >= 80) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/buai80', $row->updated_at));
            }
        }

        // 路線 × こだわり条件の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('lines', 'office_accesses.line_id', '=', 'lines.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
            ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('jobs.status', 10)
            ->where('lines.status', 0)
            ->where('commitment_terms.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('lines.permalink')
            ->groupBy('commitment_terms.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'lines.permalink as line_roman',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->line_roman . '/'. $row->commitment_term_roman, $row->updated_at));
        }

        // 駅の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->station_roman, $row->updated_at));
        }

        // 駅 × 役職/役割の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('positions', 'jobs.position_id', '=', 'positions.id')
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->where('positions.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->groupBy('positions.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                'positions.permalink as position_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->station_roman . '/'. $row->position_roman, $row->updated_at));
        }

        // 駅 × 雇用形態の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('employments', 'jobs.employment_id', '=', 'employments.id')
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->where('employments.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->groupBy('employments.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                'employments.permalink as employment_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/'. $row->employment_roman, $row->updated_at));
        }

        // 駅 × 休日の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_holidays', 'jobs.id', '=', 'job_holidays.job_id')
            ->join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->where('holidays.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->groupBy('holidays.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                'holidays.permalink as holiday_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/'. $row->holiday_roman, $row->updated_at));
        }

        // 路線 × 給与の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                DB::raw('max(jobs.m_salary_lower) as m_salary_lower'),
                DB::raw('max(jobs.t_salary_lower) as t_salary_lower'),
                DB::raw('max(jobs.d_salary_lower) as d_salary_lower'),
                DB::raw('max(jobs.commission_lower) as commission_lower'),
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            if ($row->m_salary_lower >= 160000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/gekkyu16', $row->updated_at));
            }
            if ($row->m_salary_lower >= 180000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/gekkyu18', $row->updated_at));
            }
            if ($row->m_salary_lower >= 200000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/gekkyu20', $row->updated_at));
            }
            if ($row->m_salary_lower >= 250000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/gekkyu25', $row->updated_at));
            }
            if ($row->m_salary_lower >= 300000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/gekkyu30', $row->updated_at));
            }
            if ($row->t_salary_lower >= 800) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/zikyu800', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/zikyu1000', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1200) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/zikyu1200', $row->updated_at));
            }
            if ($row->t_salary_lower >= 1500) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/zikyu1500', $row->updated_at));
            }
            if ($row->d_salary_lower >= 8000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/nikyu8', $row->updated_at));
            }
            if ($row->d_salary_lower >= 10000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/nikyu10', $row->updated_at));
            }
            if ($row->d_salary_lower >= 15000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/nikyu15', $row->updated_at));
            }
            if ($row->d_salary_lower >= 20000) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/nikyu20', $row->updated_at));
            }
            if ($row->commission_lower >= 40) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/buai40', $row->updated_at));
            }
            if ($row->commission_lower >= 50) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/buai50', $row->updated_at));
            }
            if ($row->commission_lower >= 60) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/buai60', $row->updated_at));
            }
            if ($row->commission_lower >= 70) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/buai70', $row->updated_at));
            }
            if ($row->commission_lower >= 80) {
                $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/'. $row->station_roman . '/buai80', $row->updated_at));
            }
        }

        // 路線 × こだわり条件の求人一覧ページ
        $result = Office::join('office_accesses', 'offices.id', '=', 'office_accesses.office_id')
            ->join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->join('cities', 'stations.city_id', '=', 'cities.id')
            ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('jobs', function ($join) {
                $join->on('offices.id', '=', 'jobs.office_id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('job_commitment_terms', 'jobs.id', '=', 'job_commitment_terms.job_id')
            ->join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('jobs.status', 10)
            ->where('stations.status', 0)
            ->where('commitment_terms.status', 1)
            ->groupBy('prefectures.permalink')
            ->groupBy('cities.permalink')
            ->groupBy('stations.permalink')
            ->groupBy('commitment_terms.permalink')
            ->select(
                'prefectures.permalink as prefecture_roman',
                'cities.permalink as city_roman',
                'stations.permalink as station_roman',
                'commitment_terms.permalink as commitment_term_roman',
                DB::raw('max(jobs.updated_at) as updated_at'),
            )
            ->get();
        foreach ($result as $row) {
            $sitemap->add(self::createUrlTag($host . '/list/' . $row->prefecture_roman . '/' . $row->city_roman . '/' . $row->station_roman . '/'. $row->commitment_term_roman, $row->updated_at));
        }


        $sitemap->writeToFile(public_path('sitemaps/list/sitemap.xml'));

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