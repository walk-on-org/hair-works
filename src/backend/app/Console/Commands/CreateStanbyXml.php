<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\Chatwork;
use App\Models\Job;
use App\Models\JobHoliday;
use App\Models\JobQualification;
use App\Models\JobCommitmentTerm;
use App\Models\JobImage;
use App\Models\OfficeAccess;
use App\Models\OfficeImage;
use App\Models\CorporationImage;

class CreateStanbyXml extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:create-stanby-xml';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'stanby.xml作成';

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
        try {
            $jobs = Job::join('job_categories', 'jobs.job_category_id', '=', 'job_categories.id')
                ->join('positions', 'jobs.position_id', '=', 'positions.id')
                ->join('employments', 'jobs.employment_id', '=', 'employments.id')
                ->join('offices', function ($join) {
                    $join->on('jobs.office_id', '=', 'offices.id')
                        ->whereNull('offices.deleted_at');
                })
                ->join('corporations', function ($join) {
                    $join->on('offices.corporation_id', '=', 'corporations.id')
                        ->whereNull('corporations.deleted_at');
                })
                ->join('prefectures as office_pref', 'offices.prefecture_id', '=', 'office_pref.id')
                ->join('cities as office_city', 'offices.city_id', '=', 'office_city.id')
                ->join('prefectures as corporation_pref', 'corporations.prefecture_id', '=', 'corporation_pref.id')
                ->join('cities as corporation_city', 'corporations.city_id', '=', 'corporation_city.id')
                ->where('jobs.status', 10)
                ->where('jobs.private', 0)
                ->where('jobs.indeed_private', 0)
                ->where('job_categories.status', 1)
                ->where('positions.status', 1)
                ->where('employments.status', 1)
                ->select(
                    'jobs.id as job_id',
                    'jobs.name as job_name',
                    'offices.id as office_id',
                    'offices.name as office_name',
                    'corporations.id as corporation_id',
                    'corporations.name as corporation_name',
                    'corporation_pref.name as corporation_prefecture_name',
                    'corporation_city.name as corporation_city_name',
                    'corporations.address as corporation_address',
                    'job_categories.id as job_category_id',
                    'job_categories.name as job_category_name',
                    'employments.id as employment_id',
                    'employments.name as employment_name',
                    'positions.id as position_id',
                    'positions.name as position_name',
                    'offices.postcode as postcode',
                    'office_pref.name as office_prefecture_name',
                    'office_city.name as office_city_name',
                    'offices.address as office_address',
                    'offices.open_date',
                    'offices.business_time',
                    'offices.regular_holiday',
                    'offices.floor_space',
                    'offices.seat_num',
                    'offices.shampoo_stand',
                    'offices.staff',
                    'offices.new_customer_ratio',
                    'offices.cut_unit_price',
                    'offices.customer_unit_price',
                    'jobs.catch_copy',
                    'jobs.recommend_point',
                    'jobs.salary',
                    'jobs.work_time',
                    'jobs.holiday',
                    'jobs.welfare',
                    'jobs.entry_requirement',
                    'jobs.m_salary_lower',
                    'jobs.m_salary_upper',
                    'jobs.t_salary_lower',
                    'jobs.t_salary_upper',
                    'jobs.d_salary_lower',
                    'jobs.d_salary_upper',
                    'jobs.commission_lower',
                    'jobs.commission_upper',
                    'jobs.updated_at',
                )
                ->get();

            $xml = new \SimpleXmlElement('<source></source>');
            foreach ($jobs as $job) {
                $jobtag = $xml->addChild('job');
                $jobtag->addChild('url', self::addCdata('https://hair-work.jp/detail/' . $job->job_id . str_replace('&', '&amp;', '?utm_source=stanby&utm_medium=organic&utm_campaign=stanby')));
                $jobtag->addChild('referencenumber', self::addCdata($job->job_id));
                $jobtag->addChild('title', self::addCdata(self::getTitle($job)));
                $jobtag->addChild('company', self::addCdata(self::getCompany($job)));
                $jobtag->addChild('store', self::addCdata($job->office_name));
                $jobtag->addChild('country', self::addCdata('日本'));
                $jobtag->addChild('state', self::addCdata($job->office_prefecture_name));
                $jobtag->addChild('city', self::addCdata($job->office_city_name . preg_replace('/(\s).*/m', '', preg_replace('/(　)+/', "\s", $job->office_address))));
                $jobtag->addChild('rowlocation', self::addCdata($job->office_prefecture_name . $job->office_city_name . preg_replace('/(\s).*/m', '', preg_replace('/(　)+/', "\s", $job->office_address))));
                $jobtag->addChild('station', self::addCdata(self::getStation($job)));
                $jobtag->addChild('postalcode', self::addCdata(substr($job->postcode, 0, 3) . '-' . substr($job->postcode, 3)));
                $jobtag->addChild('trafficaccess', self::addCdata(''));
                $jobtag->addChild('description', self::addCdata(self::getDescriptionInfo($job)));
                $jobtag->addChild('salary', self::addCdata(self::getSalary($job)));
                $jobtag->addChild('jobtype', self::addCdata(self::getJobType($job)));
                $jobtag->addChild('education', self::addCdata(''));
                $jobtag->addChild('experience', self::addCdata(self::getExperience($job)));
                $jobtag->addChild('benefits', self::addCdata($job->welfare));
                $jobtag->addChild('insurance', self::addCdata(''));
                $jobtag->addChild('preventSmoke', self::addCdata(self::getPreventSmoke($job)));
                $jobtag->addChild('timeshift', self::addCdata($job->work_time));
                $jobtag->addChild('holiday', self::addCdata(self::getHoliday($job)));
                $jobtag->addChild('trialperiod', self::addCdata(''));
                $jobtag->addChild('contractperiod', self::addCdata(''));
                $jobtag->addChild('companyaddress', self::addCdata($job->corporation_prefecture_name . $job->corporation_city_name . preg_replace('/(\s).*/m', '', preg_replace('/(　)+/', "\s", $job->corporation_address))));
                $jobtag->addChild('businesscontents', self::addCdata(''));
                $jobtag->addChild('jobinformation', self::addCdata($job->catch_copy));
                $jobtag->addChild('date', self::addCdata(date('Y/m/d H:i:s', strtotime($job->updated_at))));
                $jobtag->addChild('expdate', self::addCdata(''));
                $jobtag->addChild('category', self::addCdata(self::getCategory($job)));
                $jobtag->addChild('imageUrls', self::addCdata(self::getImageUrls($job)));
                $jobtag->addChild('movieurls', self::addCdata(''));
                $jobtag->addChild('applyurl', self::addCdata('https://hair-work.jp/entry/' . $job->job_id . str_replace('&', '&amp;', '?utm_source=stanby&utm_medium=organic&utm_campaign=stanby')));
            }

            // XML保存
            $xml->saveXML(public_path() . '/stanby.xml');

        } catch (\Exception $e) {
            \Log::error($e);
            Chatwork::noticeSystemError($e);
        }
    }

    /**
     * CDATAセクション追加
     */
    private function addCdata($str)
    {
        return '<![CDATA[' . $str . ']]>';
    }

    /**
     * 職種名
     */
    private function getTitle($job)
    {
        $rtn = '';
        if ($job->corporation_name == '株式会社アートネイチャー') {
            // アートネイチャーの場合
            $rtn .= '大手上場企業サロンの';
            if ($job->job_category_id == 3) {
                // その他の場合、役職/役割
                $rtn .= $job->position_name;
            } else {
                // その他以外の場合、職種+役職/役割
                $rtn .= $job->job_category_name;
                if ($job->position_id == 1 || $job->position_id == 2) {
                    $rtn .= '（ウィッグ' . $job->position_name . '）';
                } else {
                    $rtn .= '（' . $job->position_name . '）';
                }
            }
            // 市区町村を追加
            $rtn .= '/' . $job->prefecture_name . $job->city_name;
            return $rtn;
        }

        // 個別対応
        if ($job->office_name == '王様の昼寝 上野店' && false !== strpos($job->job_name, 'ヘッドスパニスト')) {
            $rtn .= 'セラピスト';
            return $rtn;
        }

        // 上記以外の場合
        if ($job->job_category_id == 3) {
            // その他の場合、役職/役割
            $rtn .= $job->position_name;
        } else {
            // その他以外の場合、職種+役職/役割
            $rtn .= $job->job_category_name . '・' . $job->position_name;
        }
        return $rtn;
    }

    /**
     * 会社名
     */
    private function getCompany($job)
    {
        if ($job->corporation_name == '株式会社プラス広告') {
            return '阪南理美容グループ';
        }
        return $job->corporation_name;
    }

    /**
     * アクセス
     */
    private function getStation($job)
    {
        $rtn = '';
        $access = OfficeAccess::join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->where('office_accesses.office_id', $job->office_id)
            ->where('stations.status', 0)
            ->orderBy('office_accesses.time')
            ->select(
                'stations.name as station_name',
                'office_accesses.move_type',
                'office_accesses.time',
                'office_accesses.note',
            )
            ->first();
        if ($access) {
            $rtn .= $access->station_name . '駅 ' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分 ' . $access->note;
        }
        return $rtn;
    }

    /**
     * 職務内容
     */
    private function getDescriptionInfo($job)
    {
        // 求人関連情報取得
        $qualifications = JobQualification::join('qualifications', 'job_qualifications.qualification_id', '=', 'qualifications.id')
            ->where('job_qualifications.job_id', $job->job_id)
            ->select(
                'qualifications.name as qualification_name',
            )
            ->get();
        $holidays = JobHoliday::join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('job_holidays.job_id', $job->job_id)
            ->select(
                'holidays.name as holiday_name',
            )
            ->get();
        $commitment_terms = JobCommitmentTerm::join('commitment_terms', 'job_commitment_terms.commitment_term_id', '=', 'commitment_terms.id')
            ->where('job_commitment_terms.job_id', $job->job_id)
            ->select(
                'commitment_terms.name as commitment_term_name',
            )
            ->get();
        $accesses = OfficeAccess::join('stations', 'office_accesses.station_id', '=', 'stations.id')
            ->where('office_accesses.office_id', $job->office_id)
            ->where('stations.status', 0)
            ->orderBy('office_accesses.time')
            ->select(
                'stations.name as station_name',
                'office_accesses.move_type',
                'office_accesses.time',
                'office_accesses.note',
            )
            ->get();
        
        // description生成
        $rtn = '';
        if ($job->catch_copy) {
            $rtn .= $job->catch_copy;
        }
        if ($job->recommend_point) {
            $rtn .= "\n\n" . $job->recommend_point;
        }
        $rtn .= "【雇用形態】\n" . $job->employment_name . "\n\n";
        $rtn .= "【職種】\n" . $job->job_category_name . "\n\n";
        $rtn .= "【役割/役職】\n" . $job->position_name . "\n\n";
        $rtn .= "【勤務先】\n" . $job->office_prefecture_name . $job->office_city_name . $job->office_address . "\n\n";
        foreach ($accesses as $access) {
            $rtn .= '・' . $access->station_name . '駅 ' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分 ' . $access->note . "\n";
        }
        $rtn .= "\n【必須資格】\n";
        if (count($qualifications) > 0) {
            $rtn .= implode('/', array_column($qualifications->toArray(), 'qualification_name')) . "\n";
        }
        if ($job->entry_requirement) {
            $rtn .= $job->entry_requirement . "\n";
        }
        $rtn .= "\n【こだわり】\n";
        if (count($commitment_terms) > 0) {
            $rtn .= implode('/', array_column($commitment_terms->toArray(), 'commitment_term_name')) . "\n";
        }
        $rtn .= "\n【給与】\n";
        if ($job->m_salary_lower || $job->m_salary_upper) {
            $rtn .= '月給：';
            if ($job->m_salary_lower) {
                $rtn .= $job->m_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->m_salary_upper) {
                $rtn .= $job->m_salary_upper . '円';
            }
            $rtn .= "\n";
        }
        if ($job->t_salary_lower || $job->t_salary_upper) {
            $rtn .= '時給：';
            if ($job->t_salary_lower) {
                $rtn .= $job->t_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->t_salary_upper) {
                $rtn .= $job->t_salary_upper . '円';
            }
            $rtn .= "\n";
        }
        if ($job->d_salary_lower || $job->d_salary_upper) {
            $rtn .= '日給：';
            if ($job->d_salary_lower) {
                $rtn .= $job->d_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->d_salary_upper) {
                $rtn .= $job->d_salary_upper . '円';
            }
            $rtn .= "\n";
        }
        if ($job->commission_lower || $job->commission_upper) {
            $rtn .= '歩合：';
            if ($job->commission_lower) {
                $rtn .= $job->commission_lower . '%';
            }
            $rtn .= '〜';
            if ($job->commission_upper) {
                $rtn .= $job->commission_upper . '%';
            }
            $rtn .= "\n";
        }
        if ($job->salary) {
            $rtn .= $job->salary . "\n";
        }
        $rtn .= "\n【勤務時間】\n";
        if ($job->work_time) {
            $rtn .= $job->work_time . "\n";
        }
        $rtn .= "\n【休日】\n";
        if (count($holidays) > 0) {
            $rtn .= implode('/', array_column($holidays->toArray(), 'holiday_name')) . "\n";
        }
        if ($job->holiday) {
            $rtn .= $job->holiday . "\n";
        }
        $rtn .= "\n【福利厚生】\n";
        if ($job->welfare) {
            $rtn .= $job->welfare . "\n";
        }
        $rtn .= "\n【開店・リニューアル日】\n";
        if ($job->open_date) {
            $rtn .= date('Y年m月d日', strtotime($job->open_date)) . "\n";
        }
        $rtn .= "\n【営業時間】\n";
        if ($job->business_time) {
            $rtn .= $job->business_time . "\n";
        }
        $rtn .= "\n【定休日】\n";
        if ($job->regular_holiday) {
            $rtn .= $job->regular_holiday . "\n";
        }
        $rtn .= "\n【店舗情報】\n<坪数>\n";
        if ($job->floor_space) {
            $rtn .= $job->floor_space . "坪\n";
        }
        $rtn .= "\n<セット面>\n";
        if ($job->seat_num) {
            $rtn .= $job->seat_num . "面\n";
        }
        $rtn .= "\n<シャンプー台>\n";
        if ($job->shampoo_stand) {
            $rtn .= $job->shampoo_stand . "\n";
        }
        $rtn .= "\n<スタッフ>\n";
        if ($job->staff) {
            $rtn .= $job->staff . "人\n";
        }
        $rtn .= "\n<新規客割合>\n";
        if ($job->new_customer_ratio) {
            $rtn .= $job->new_customer_ratio . "%\n";
        }
        $rtn .= "\n<標準カット単価>\n";
        if ($job->cut_unit_price) {
            $rtn .= $job->cut_unit_price . "円\n";
        }
        $rtn .= "\n<顧客単価>\n";
        if ($job->customer_unit_price) {
            $rtn .= $job->customer_unit_price . "円\n";
        }
        return $rtn;
    }

    /**
     * 給与
     */
    private function getSalary($job)
    {
        $rtn = '';
        if ($job->m_salary_lower || $job->m_salary_upper) {
            $rtn .= '月給';
            if ($job->m_salary_lower) {
                $rtn .= floor($job->m_salary_lower / 10000) . '万円';
            }
            $rtn .= '〜';
            if ($job->m_salary_upper) {
                $rtn .= floor($job->m_salary_upper / 10000) . '万円';
            }
            return $rtn;
        }
        if ($job->t_salary_lower || $job->t_salary_upper) {
            $rtn .= '時給';
            if ($job->t_salary_lower) {
                $rtn .= $job->t_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->t_salary_upper) {
                $rtn .= $job->t_salary_upper . '円';
            }
            return $rtn;
        }
        if ($job->d_salary_lower || $job->d_salary_upper) {
            $rtn .= '日給';
            if ($job->d_salary_lower) {
                $rtn .= $job->d_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->d_salary_upper) {
                $rtn .= $job->d_salary_upper . '円';
            }
            return $rtn;
        }
        return $rtn;
    }

    /**
     * 雇用形態
     */
    private function getJobType($job)
    {
        if ($job->employment_id == 1) {
            return '正社員';
        } else if ($job->employment_id == 2) {
            return '正社員,新卒';
        } else if ($job->employment_id == 3) {
            return 'パート';
        } else if ($job->employment_id == 4) {
            return '業務委託';
        } else if ($job->employment_id == 5) {
            return '派遣社員';
        }
        return '';
    }

    /**
     * 経験
     */
    private function getExperience($job)
    {
        $qualifications = JobQualification::join('qualifications', 'job_qualifications.qualification_id', '=', 'qualifications.id')
            ->where('job_qualifications.job_id', $job->job_id)
            ->select(
                'qualifications.name as qualification_name',
            )
            ->get();
        $rtn = '';
        if (count($qualifications) > 0) {
            $rtn .= implode("\n", array_column($qualifications->toArray(), 'qualification_name'));
        }
        if ($job->entry_requirement) {
            $rtn .= "\n" . $job->entry_requirement;
        }
        return $rtn;
    }

    /**
     * 受動喫煙対策
     */
    private function getPreventSmoke($job)
    {
        if (!$job->passive_smoking) {
            return '';
        }
        if (isset(Office::PASSIVE_SMOKING[$job->passive_smoking])) {
            return Office::PASSIVE_SMOKING[$job->passive_smoking];
        }
        return '';
    }

    /**
     * 休日
     */
    private function getHoliday($job)
    {
        $holidays = JobHoliday::join('holidays', 'job_holidays.holiday_id', '=', 'holidays.id')
            ->where('job_holidays.job_id', $job->job_id)
            ->select(
                'holidays.name as holiday_name',
            )
            ->get();
        $rtn = '';
        if (count($holidays) > 0) {
            $rtn .= implode("\n", array_column($holidays->toArray(), 'holiday_name'));
        }
        if ($job->holiday) {
            $rtn .= "\n" . $job->holiday;
        }
        return $rtn;
    }

    /**
     * 求人カテゴリ
     */
    private function getCategory($job)
    {
        $rtn = $job->job_category_name . ',';
        $rtn .= $job->position_name . ',';
        $rtn .= $job->employment_name . ',';
        $rtn .= $job->office_prefecture_name . $job->office_city_name;
        return $rtn;
    }

    /**
     * 写真のURL
     */
    private function getImageUrls($job)
    {
        $rtn = '';
        $job_images = JobImage::where('job_images.job_id', $job->job_id)
            ->select(
                'job_images.job_id',
                'job_images.image',
                'job_images.updated_at',
            )
            ->orderBy('job_images.sort')
            ->get();
        foreach ($job_images as $job_image) {
            $job_image->image = [
                'url' => config('uploadimage.job_image_relative_path') . $job_image->job_id . '/' . $job_image->image,
            ];
        }
        $office_images = OfficeImage::where('office_images.office_id', $job->office_id)
            ->select(
                'office_images.office_id',
                'office_images.image',
                'office_images.updated_at',
            )
            ->orderBy('office_images.sort')
            ->get();
        foreach ($office_images as $office_image) {
            $office_image->image = [
                'url' => config('uploadimage.office_image_relative_path') . $office_image->office_id . '/' . $office_image->image,
            ];
        }
        $corporation_images = CorporationImage::where('corporation_images.corporation_id', $job->corporation_id)
            ->select(
                'corporation_images.corporation_id',
                'corporation_images.image',
                'corporation_images.updated_at',
            )
            ->orderBy('corporation_images.sort')
            ->get();
        foreach ($corporation_images as $corporation_image) {
            $corporation_image->image = [
                'url' => config('uploadimage.corporation_image_relative_path') . $corporation_image->corporation_id . '/' . $corporation_image->image,
            ];
        }

        // 最新のデータを判定
        $images = [];
        if (count($job_images) == 0 && count($office_images) == 0 && count($corporation_images) == 0) {
            return '';
        } else if (count($job_images) > 0 && count($office_images) == 0 && count($corporation_images) == 0) {
            $images = $job_images;
        } else if (count($job_images) == 0 && count($office_images) > 0 && count($corporation_images) == 0) {
            $images = $office_images;
        } else if (count($job_images) == 0 && count($office_images) == 0 && count($corporation_images) > 0) {
            $images = $corporation_images;
        } else {
            // ２つ以上設定している場合、更新日時が最新の方を使用する
            $base_datetime = '2000-01-01';
            $max_job_image_updated_at = count($job_images) > 0 ? max(array_column($job_images->toArray(), 'updated_at')) : $base_datetime;
            $max_office_image_updated_at = count($office_images) > 0 ? max(array_column($office_images->toArray(), 'updated_at')) : $base_datetime;
            $max_corporation_image_updated_at = count($corporation_images) > 0 ? max(array_column($corporation_images->toArray(), 'updated_at')) : $base_datetime;
            if (strtotime($max_job_image_updated_at) > strtotime($max_corporation_image_updated_at) && strtotime($max_job_image_updated_at) > strtotime($max_office_image_updated_at)) {
                $images = $job_images;
            } else if (strtotime($max_office_image_updated_at) > strtotime($max_corporation_image_updated_at)) {
                $images = $office_images;
            } else {
                $images = $corporation_images;
            }
        }

        foreach ($images as $index => $row) {
            if ($index > 0) {
                $rtn .= ',';
            }
            $rtn .= 'https://hair-work.jp' . $row->image['url'];
        }
        return $rtn;
    }
}