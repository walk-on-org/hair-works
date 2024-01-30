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

class CreateIndeedXml extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:create-indeed-xml';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'indeed.xml作成';

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
                ->join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
                ->join('cities', 'offices.city_id', '=', 'cities.id')
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
                    'job_categories.id as job_category_id',
                    'job_categories.name as job_category_name',
                    'employments.id as employment_id',
                    'employments.name as employment_name',
                    'positions.id as position_id',
                    'positions.name as position_name',
                    'offices.postcode as postcode',
                    'prefectures.name as prefecture_name',
                    'cities.name as city_name',
                    'offices.address as address',
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
            $xml->addChild('publisher', 'HairWorks');
            $xml->addChild('publisherurl', config('app.front_url') . '/');
            $xml->addChild('lastBuildDate', date('Y/m/d H:i:s'));
            foreach ($jobs as $job) {
                $jobtag = $xml->addChild('job');
                $jobtag->addChild('title', self::addCdata(self::getTitle($job)));
                $jobtag->addChild('date', self::addCdata(self::getDate($job)));
                $jobtag->addChild('referencenumber', self::addCdata($job->job_id));
                $jobtag->addChild('url', self::addCdata(config('app.front_url') . '/detail/' . $job->job_id));
                $jobtag->addChild('apply_url', self::addCdata(config('app.front_url') . '/entry/' . $job->job_id . str_replace('&', '&amp;', '?utm_source=Indeed&utm_medium=cpc&utm_campaign=Indeed')));
                $jobtag->addChild('company', self::addCdata($job->office_name));
                $jobtag->addChild('sourcename', self::addCdata(self::getSourcename($job)));
                $jobtag->addChild('city', self::addCdata($job->city_name . preg_replace('/(\s).*/m', '', preg_replace('/(　)+/', "\s", $job->address))));
                $jobtag->addChild('state', self::addCdata($job->prefecture_name));
                $jobtag->addChild('station', self::addCdata(self::getStation($job)));
                $jobtag->addChild('country', self::addCdata('JP'));
                $jobtag->addChild('postalcode', self::addCdata(substr($job->postcode, 0, 3) . '-' . substr($job->postcode, 3)));
                $jobtag->addChild('streetaddress', self::addCdata('〒' . substr($job->postcode, 0, 3) . '-' . substr($job->postcode, 3) . ' ' . $job->prefecture_name . $job->city_name . preg_replace('/(\s).*/m', '', preg_replace('/(　)+/', "\s", $job->address))));
                $jobtag->addChild('description', self::addCdata(self::getDescriptionInfo($job)));
                $jobtag->addChild('salary', self::addCdata(self::getSalary($job)));
                $jobtag->addChild('jobtype', self::addCdata(self::getJobType($job)));
                $jobtag->addChild('category', self::addCdata(self::getCategory($job)));
                $jobtag->addChild('timeshift', self::addCdata($job->work_time));
                $jobtag->addChild('subwayaccess', self::addCdata(self::getSubwayaccess($job)));
                $jobtag->addChild('benefits', self::addCdata($job->welfare));
                $jobtag->addChild('rawsalary', self::addCdata($job->salary));
                $jobtag->addChild('keywords', self::addCdata(self::getKeyword($job)));
                $jobtag->addChild('imageUrls', self::addCdata(self::getImageUrls($job)));
            }

            // XML保存
            $xml->saveXML(public_path() . '/indeed.xml');

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
     * 最初に掲載した日付
     */
    private function getDate($job)
    {
        // 最終更新日からの日数を算出
        $today = new \DateTime();
        $updated_at = new \DateTime($job->updated_at);
        $diff = $today->diff($updated_at);

        // 最終更新日を本日としてから「差分の日数÷30の余り」日前とする
        $rtn = $updated_at->modify($diff->format('%a') . ' day');
        $remainder = $diff->format('%a') % 30;
        $rtn->modify('-' . $remainder . ' day');
        return $rtn->format('Y-m-d H:i:s');
    }

    /**
     * 会社名
     */
    private function getSourcename($job)
    {
        if ($job->corporation_name == '株式会社プラス広告') {
            return '阪南理美容グループ';
        }
        return $job->corporation_name;
    }

    /**
     * 近くの駅名
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
            )
            ->first();
        if ($access) {
            $rtn .= $access->station_name . '駅';
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
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->catch_copy) . '</p>';
        }
        if ($job->recommend_point) {
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->recommend_point) . '</p>';
        }
        $rtn .= '<h2>雇用形態:</h2><p>' . $job->employment_name . '</p>';
        $rtn .= '<h2>職種:</h2><p>' . $job->job_category_name . '</p>';
        $rtn .= '<h2>役職/役割:</h2><p>' . $job->position_name . '</p>';
        $rtn .= '<h2>勤務先:</h2><p>' . $job->prefecture_name . $job->city_name . $job->address . '</p>';
        foreach ($accesses as $access) {
            $rtn .= '<p>' . $access->station_name . '駅 ' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分 ' . $access->note . '</p>';
        }
        $rtn .= '<h2>必須資格:</h2>';
        if (count($qualifications) > 0) {
            $rtn .= '<p>' . implode('/', array_column($qualifications->toArray(), 'qualification_name')) . '</p>';
        }
        $rtn .= '<h2>こだわり:</h2>';
        if (count($commitment_terms) > 0) {
            $rtn .= '<p>' . implode('/', array_column($commitment_terms->toArray(), 'commitment_term_name')) . '</p>';
        }
        $rtn .= '<h2>給与:</h2>';
        if ($job->m_salary_lower || $job->m_salary_upper) {
            $rtn .= '<p>【月給】';
            if ($job->m_salary_lower) {
                $rtn .= $job->m_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->m_salary_upper) {
                $rtn .= $job->m_salary_upper . '円';
            }
            $rtn .= '</p>';
        }
        if ($job->t_salary_lower || $job->t_salary_upper) {
            $rtn .= '<p>【時給】';
            if ($job->t_salary_lower) {
                $rtn .= $job->t_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->t_salary_upper) {
                $rtn .= $job->t_salary_upper . '円';
            }
            $rtn .= '</p>';
        }
        if ($job->d_salary_lower || $job->d_salary_upper) {
            $rtn .= '<p>【日給】';
            if ($job->d_salary_lower) {
                $rtn .= $job->d_salary_lower . '円';
            }
            $rtn .= '〜';
            if ($job->d_salary_upper) {
                $rtn .= $job->d_salary_upper . '円';
            }
            $rtn .= '</p>';
        }
        if ($job->commission_lower || $job->commission_upper) {
            $rtn .= '<p>【歩合】';
            if ($job->commission_lower) {
                $rtn .= $job->commission_lower . '%';
            }
            $rtn .= '〜';
            if ($job->commission_upper) {
                $rtn .= $job->commission_upper . '%';
            }
            $rtn .= '</p>';
        }
        if ($job->salary) {
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->salary) . '</p>';
        }
        $rtn .= '<h2>勤務時間:</h2>';
        if ($job->work_time) {
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->work_time) . '</p>';
        }
        $rtn .= '<h2>休日:</h2>';
        if (count($holidays) > 0) {
            $rtn .= '<p>' . implode('/', array_column($holidays->toArray(), 'holiday_name')) . '</p>';
        }
        if ($job->holiday) {
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->holiday) . '</p>';
        }
        $rtn .= '<h2>福利厚生:</h2>';
        if ($job->welfare) {
            $rtn .= '<p>' . preg_replace("/\n/", '<br>', $job->welfare) . '</p>';
        }
        $rtn .= '<h2>開店・リニューアル日:</h2>';
        if ($job->open_date) {
            $rtn .= '<p>' . date('Y年m月d日', strtotime($job->open_date)) . '</p>';
        }
        $rtn .= '<h2>営業時間:</h2>';
        if ($job->business_time) {
            $rtn .= '<p>' . $job->business_time . '</p>';
        }
        $rtn .= '<h2>定休日:</h2>';
        if ($job->regular_holiday) {
            $rtn .= '<p>' . $job->regular_holiday . '</p>';
        }
        $rtn .= '<h2>店舗情報:</h2><h3>坪数:</h3>';
        if ($job->floor_space) {
            $rtn .= '<p>' . $job->floor_space . '坪</p>';
        }
        $rtn .= '<h3>セット面:</h3>';
        if ($job->seat_num) {
            $rtn .= '<p>' . $job->seat_num . '面</p>';
        }
        $rtn .= '<h3>シャンプー台:</h3>';
        if ($job->shampoo_stand) {
            $rtn .= '<p>' . $job->shampoo_stand . '</p>';
        }
        $rtn .= '<h3>スタッフ:</h3>';
        if ($job->staff) {
            $rtn .= '<p>' . $job->staff . '人</p>';
        }
        $rtn .= '<h3>新規客割合:</h3>';
        if ($job->new_customer_ratio) {
            $rtn .= '<p>' . $job->new_customer_ratio . '%</p>';
        }
        $rtn .= '<h3>標準カット単価:</h3>';
        if ($job->cut_unit_price) {
            $rtn .= '<p>' . $job->cut_unit_price . '円</p>';
        }
        $rtn .= '<h3>顧客単価:</h3>';
        if ($job->customer_unit_price) {
            $rtn .= '<p>' . $job->customer_unit_price . '円</p>';
        }
        $rtn .= '<h2>所在地:</h2><p>〒' . substr($job->postcode, 0, 3) . '-' . substr($job->postcode, 3) . '</p>';
        $rtn .= '<p>' . $job->prefecture_name . $job->city_name . $job->address . '</p>';
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
        if ($job->employment_id == 1 || $job->employment_id == 2) {
            return '正社員';
        } else if ($job->employment_id == 3) {
            return 'パートタイム';
        } else if ($job->employment_id == 4) {
            return '業務委託';
        } else if ($job->employment_id == 5) {
            return '派遣社員';
        }
        return '';
    }

    /**
     * 求人カテゴリ
     */
    private function getCategory($job)
    {
        $rtn = $job->job_category_name . ',';
        $rtn .= $job->position_name . ',';
        $rtn .= $job->employment_name . ',';
        $rtn .= $job->prefecture_name . $job->city_name;
        return $rtn;
    }

    /**
     * 交通アクセス
     */
    private function getSubwayaccess($job)
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
            $rtn .= $access->station_name . '駅から' . OfficeAccess::MOVE_TYPE[$access->move_type] . $access->time . '分 ' . $access->note;
        }
        return $rtn;
    }

    /**
     * キーワードリスト
     */
    private function getKeyword($job)
    {
        $keywords = [];
        $job_commitment_terms = JobCommitmentTerm::where('job_id', $job->job_id)
            ->select(
                'commitment_term_id',
            )
            ->get();
        foreach ($job_commitment_terms as $row) {
            if ($row->commitment_term_id == 3) {
                $keywords[] = '52HB2'; // 土日祝のみOK
            } else if ($row->commitment_term_id == 5) {
                $keywords[] = 'YCH9D'; // 寮・社宅あり
            } else if ($row->commitment_term_id == 6) {
                $keywords[] = 'NPHPU'; // 育休制度あり
            } else if ($row->commitment_term_id == 7) {
                $keywords[] = 'XNGYD'; // 育児サポートあり
            } else if ($row->commitment_term_id == 8) {
                $keywords[] = 'ZR33R'; // 独立支援あり
            } else if ($row->commitment_term_id == 9) {
                $keywords[] = '9KWAA'; // 車通勤OK
            } else if ($row->commitment_term_id == 10) {
                $keywords[] = '4PX2W'; // 副業・WワークOK
            } else if ($row->commitment_term_id == 11) {
                $keywords[] = 'N3E3Y'; // 制服貸与
            } else if ($row->commitment_term_id == 15) {
                $keywords[] = '2VTPK'; // 海外出張あり
            } else if ($row->commitment_term_id == 19) {
                $keywords[] = 'NKKX4'; // ブランクOK
            } else if ($row->commitment_term_id == 20) {
                $keywords[] = 'D9PP2'; // 未経験者歓迎
            } else if ($row->commitment_term_id == 26) {
                $keywords[] = 'NYYS2'; // オープニングスタッフ
            } else if ($row->commitment_term_id == 40) {
                $keywords[] = 'HWCF8'; // リモート面接OK
            }
        }
        return implode(',', $keywords);
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
            $rtn .= config('app.front_url') . $row->image['url'];
        }
        return $rtn;
    }
}