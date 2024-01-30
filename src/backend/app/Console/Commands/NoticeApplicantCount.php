<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\Chatwork;
use App\Models\Corporation;
use App\Models\Applicant;
use Illuminate\Support\Facades\DB;

class NoticeApplicantCount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:notice-applicant-count';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '応募件数通知';

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
            // 初回契約で掲載開始日から30日経過の法人を取得
            $first_contract_one_month_corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
                ->whereNotNull('contracts.start_date')
                ->where('contracts.plan_id', '<>', 10) // 成功報酬型は除く
                ->groupBy('corporations.id')
                ->select(
                    'corporations.id as corporation_id',
                    'corporations.name as corporation_name',
                    DB::raw('count(corporations.id) as contract_count'),
                    DB::raw('min(contracts.start_date) as start_date'),
                )
                ->having('contract_count', '=', 1)
                ->having('start_date', '>', date('Y-m-d', strtotime('-31 day')))
                ->having('start_date', '<', date('Y-m-d', strtotime('-30 day')));

            // 初回契約で掲載開始日から60日経過の法人を取得
            $first_contract_two_month_corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
                ->whereNotNull('contracts.start_date')
                ->where('contracts.plan_id', '<>', 10) // 成功報酬型は除く
                ->groupBy('corporations.id')
                ->select(
                    'corporations.id as corporation_id',
                    'corporations.name as corporation_name',
                    DB::raw('count(corporations.id) as contract_count'),
                    DB::raw('min(contracts.start_date) as start_date'),
                )
                ->having('contract_count', '=', 1)
                ->having('start_date', '>', date('Y-m-d', strtotime('-61 day')))
                ->having('start_date', '<', date('Y-m-d', strtotime('-60 day')));

            // 継続更新で掲載開始日から30日経過の法人を取得
            $continuation_contract_one_month_corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
                ->whereNotNull('contracts.start_date')
                ->where('contracts.plan_id', '<>', 10) // 成功報酬型は除く
                ->groupBy('corporations.id')
                ->select(
                    'corporations.id as corporation_id',
                    'corporations.name as corporation_name',
                    DB::raw('count(corporations.id) as contract_count'),
                    DB::raw('min(contracts.start_date) as start_date'),
                )
                ->having('contract_count', '>', 1)
                ->having('start_date', '>', date('Y-m-d', strtotime('-31 day')))
                ->having('start_date', '<', date('Y-m-d', strtotime('-30 day')));

            // 継続更新で掲載開始日から60日経過の法人を取得
            $continuation_contract_two_month_corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
                ->whereNotNull('contracts.start_date')
                ->where('contracts.plan_id', '<>', 10) // 成功報酬型は除く
                ->groupBy('corporations.id')
                ->select(
                    'corporations.id as corporation_id',
                    'corporations.name as corporation_name',
                    DB::raw('count(corporations.id) as contract_count'),
                    DB::raw('min(contracts.start_date) as start_date'),
                )
                ->having('contract_count', '>', 1)
                ->having('start_date', '>', date('Y-m-d', strtotime('-61 day')))
                ->having('start_date', '<', date('Y-m-d', strtotime('-60 day')));

            // 応募数判定
            // 新規契約、30日経過、応募ゼロの法人
            $send_first_contract_one_month_zero_corporations = [];
            // 新規契約、60日経過、応募ゼロの法人
            $send_first_contract_two_month_zero_corporations = [];
            // 継続契約、60日経過、応募ゼロの法人
            $send_continuation_contract_two_month_zero_corporations = [];
            // 新規契約、30日経過、応募有の法人
            $send_first_contract_one_month_not_zero_corporations = [];
            // 新規契約、60日経過、応募有の法人
            $send_first_contract_two_month_not_zero_corporations = [];
            // 継続契約、30日経過、応募有の法人
            $send_continuation_contract_one_month_not_zero_corporations = [];
            // 継続契約、60日経過、応募有の法人
            $send_continuation_contract_two_month_not_zero_corporations = [];

            // 新規契約、30日経過の法人にて、応募数を取得
            foreach ($first_contract_one_month_corporations as $c) {
                \Log::debug('法人：' . $c->corporation_name);
                \Log::debug('開始日：' . date('Y/m/d'. strtotime($c->start_date)));
                $applicant_count = self::getApplicantCount($c);
                \Log::debug('応募数：' . $applicant_count);
                if ($applicant_count == 0) {
                    $send_first_contract_one_month_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => 0,
                        'prev_applicant_count' => 0,
                    ];
                } else {
                    $send_first_contract_one_month_not_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => $applicant_count,
                        'prev_applicant_count' => self::getPrevMonthApplicantCount($c),
                    ];
                }
            }

            // 新規契約、60日経過の法人にて、応募数を取得
            foreach ($first_contract_two_month_corporations as $c) {
                \Log::debug('法人：' . $c->corporation_name);
                \Log::debug('開始日：' . date('Y/m/d'. strtotime($c->start_date)));
                $applicant_count = self::getApplicantCount($c);
                \Log::debug('応募数：' . $applicant_count);
                if ($applicant_count == 0) {
                    $send_first_contract_two_month_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => 0,
                        'prev_applicant_count' => 0,
                    ];
                } else {
                    $send_first_contract_two_month_not_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => $applicant_count,
                        'prev_applicant_count' => self::getPrevMonthApplicantCount($c),
                    ];
                }
            }

            // 継続契約、30日経過の法人にて、応募数を取得
            foreach ($continuation_contract_one_month_corporations as $c) {
                \Log::debug('法人：' . $c->corporation_name);
                \Log::debug('開始日：' . date('Y/m/d'. strtotime($c->start_date)));
                $applicant_count = self::getApplicantCount($c);
                \Log::debug('応募数：' . $applicant_count);
                if ($applicant_count == 0) {
                    // 継続契約、30日経過で応募ゼロは通知なし
                } else {
                    $send_continuation_contract_one_month_not_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => $applicant_count,
                        'prev_applicant_count' => self::getPrevMonthApplicantCount($c),
                    ];
                }
            }

            // 継続契約、60日経過の法人にて、応募数を取得
            foreach ($continuation_contract_two_month_corporations as $c) {
                \Log::debug('法人：' . $c->corporation_name);
                \Log::debug('開始日：' . date('Y/m/d'. strtotime($c->start_date)));
                $applicant_count = self::getApplicantCount($c);
                \Log::debug('応募数：' . $applicant_count);
                if ($applicant_count == 0) {
                    $send_continuation_contract_two_month_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => 0,
                        'prev_applicant_count' => 0,
                    ];
                } else {
                    $send_continuation_contract_two_month_not_zero_corporations[] = [
                        'corporation_id' => $c->corporation_id,
                        'corporation_name' => $c->corporation_name,
                        'applicant_count' => $applicant_count,
                        'prev_applicant_count' => self::getPrevMonthApplicantCount($c),
                    ];
                }
            }

            // 応募ゼロアラート
            if (count($send_first_contract_one_month_zero_corporations) > 0
                || count($send_first_contract_two_month_zero_corporations) > 0
                || count($send_continuation_contract_two_month_zero_corporations) > 0) {
                // メール送信
                // TODO
                \Log::debug('応募ゼロ新規契約30日経過：' . self::getNoticeText($send_first_contract_one_month_zero_corporations));
                \Log::debug('応募ゼロ新規契約60日経過：' . self::getNoticeText($send_first_contract_two_month_zero_corporations));
                \Log::debug('応募ゼロ継続契約60日経過：' . self::getNoticeText($send_continuation_contract_two_month_zero_corporations));

                // Chatwork通知
                Chatwork::noticeApplicantZero(
                    count($send_first_contract_one_month_zero_corporations) > 0 ? self::getNoticeText($send_first_contract_one_month_zero_corporations) : 'なし',
                    count($send_first_contract_two_month_zero_corporations) > 0 ? self::getNoticeText($send_first_contract_two_month_zero_corporations) : 'なし',
                    count($send_continuation_contract_two_month_zero_corporations) > 0 ? self::getNoticeText($send_continuation_contract_two_month_zero_corporations) : 'なし'
                );
            }

            // 応募有アラート
            if (count($send_first_contract_one_month_not_zero_corporations) > 0
                || count($send_first_contract_two_month_not_zero_corporations) > 0
                || count($send_continuation_contract_one_month_not_zero_corporations) > 0
                || count($send_continuation_contract_two_month_not_zero_corporations) > 0) {
                // メール送信
                // TODO
                \Log::debug('応募有新規契約30日経過：' . self::getNoticeText($send_first_contract_one_month_not_zero_corporations));
                \Log::debug('応募有新規契約60日経過：' . self::getNoticeText($send_first_contract_two_month_not_zero_corporations));
                \Log::debug('応募有継続契約30日経過：' . self::getNoticeText($send_continuation_contract_one_month_not_zero_corporations));
                \Log::debug('応募有継続契約60日経過：' . self::getNoticeText($send_continuation_contract_two_month_not_zero_corporations));

                // Chatwork通知
                Chatwork::noticeApplicantNotZero(
                    count($send_first_contract_one_month_not_zero_corporations) > 0 ? self::getNoticeText($send_first_contract_one_month_not_zero_corporations) : 'なし',
                    count($send_first_contract_two_month_not_zero_corporations) > 0 ? self::getNoticeText($send_first_contract_two_month_not_zero_corporations) : 'なし',
                    count($send_continuation_contract_one_month_not_zero_corporations) > 0 ? self::getNoticeText($send_continuation_contract_one_month_not_zero_corporations) : 'なし',
                    count($send_continuation_contract_two_month_not_zero_corporations) > 0 ? self::getNoticeText($send_continuation_contract_two_month_not_zero_corporations) : 'なし'
                );
            }
        } catch (\Exception $e) {
            \Log::error($e);
            Chatwork::noticeSystemError($e);
        }
    }

    /**
     * 応募件数取得
     */
    private function getApplicantCount($corporation)
    {
        $count = Applicant::join('jobs', function ($join) {
                $join->on('applicants.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('offices.corporation_id', $corporation->corporation_id)
            ->where('applicants.created_at', '>', $corporation->start_date)
            ->count();
        return $count;
    }

    /**
     * 開始日から30日間の応募件数取得
     */
    private function getPrevMonthApplicantCount($corporation)
    {
        $count = Applicant::join('jobs', function ($join) {
                $join->on('applicants.job_id', '=', 'jobs.id')
                    ->whereNull('jobs.deleted_at');
            })
            ->join('offices', function ($join) {
                $join->on('jobs.office_id', '=', 'offices.id')
                    ->whereNull('offices.deleted_at');
            })
            ->where('offices.corporation_id', $corporation->corporation_id)
            ->where('applicants.created_at', '>', date('Y-m-d', strtotime($corporation->start_date)))
            ->where('applicants.created_at', '<', date('Y-m-d', strtotime($corporation->start_date . ' -30 day')))
            ->count();
        return $count;
    }

    /**
     * 通知用のテキスト
     */
    private function getNoticeText($corporations, $is_two_month = false)
    {
        $text = '';
        foreach ($corporations as $c) {
            $text .= '・' . $c['corporation_name'] . "\r\nCMS：" . config('app.url') . "/admin/corporations/" . $c['corporation_id'] . "\r\n";
            if ($c['applicant_count'] > 0) {
                $text .= '応募数：' . $c['applicant_count'] . '件';
                if ($is_two_month) {
                    $text .= '（30日経過後から' . ($c['applicant_count'] - $c['prev_applicant_count']) . '件プラス）';
                }
                $text .= "\r\n";
            }
        }
        return $text;
    }
}