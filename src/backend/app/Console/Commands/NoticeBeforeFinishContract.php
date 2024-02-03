<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\Chatwork;
use App\Models\Corporation;
use App\Mail\FinishContractMail;
use Illuminate\Support\Facades\Mail;

class NoticeBeforeFinishContract extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:notice-before-finish-contact';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '掲載終了30日前に通知';

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
        // 契約終了予定日の30日前に到達した法人取得
        $corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
            ->join('plans', 'contracts.plan_id', '=', 'plans.id')
            ->whereNull('contracts.end_date')
            ->where('contracts.end_plan_date', '=', date('Y-m-d',strtotime('+30 day')))
            ->where('contracts.expire', 0)
            ->select(
                'corporations.id as corporation_id',
                'corporations.name as corporation_name',
                'contracts.id as contract_id',
                'plans.name as plan_name',
                'contracts.start_date',
                'contracts.end_plan_date',
            )
            ->get();

        $corporation_info = [];
        try {
            foreach ($corporations as $corporation) {
                $url = '';
                $corporation_id = $corporation->corporation_id;
                $url = config('app.url') . "/admin/corporations/{$corporation_id}";
                $corporation_info[] = '▼' . $corporation->corporation_name . "\r\n法人ページ：" . $url . "\r\n";
            }

            if (count($corporation_info) > 0) {
                // メール送信
                Mail::send(new BeforeFinishContractMail(implode("\r\n", $corporation_info)));
                // Chatwork通知
                Chatwork::noticeBeforeFinishContractAlert(implode("\r\n", $corporation_info));
            }

        } catch (\Exception $e) {
            \Log::error($e);
            Chatwork::noticeSystemError($e);
        }
    }
}