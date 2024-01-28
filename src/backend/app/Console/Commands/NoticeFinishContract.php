<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\Chatwork;
use App\Models\Corporation;
use App\Models\Contract;
use App\Models\Job;
use Illuminate\Support\Facades\DB;

class NoticeFinishContract extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:notice-finish-contact';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '掲載終了日に到達したら掲載停止に変更';

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
        // 契約終了予定日に到達した法人取得
        $corporations = Corporation::join('contracts', 'corporations.id', '=', 'contracts.corporation_id')
            ->whereNull('contracts.end_date')
            ->where('contracts.end_plan_date', '<', date('Y-m-d',strtotime('-1 day')))
            ->where('contracts.expire', 0)
            ->select(
                'corporations.id as corporation_id',
                'corporations.name as corporation_name',
                'contracts.id as contract_id',
            )
            ->get();

        DB::beginTransaction();
        $finish_corporation_name = [];
        $continue_corporation_name = [];
        try {
            foreach ($corporations as $corporation) {
                // 契約満了
                Contract::where('id', $corporation->contract_id)
                    ->update([
                        'end_date' => date('Y-m-d',strtotime('-1 day')), // 掲載終了予定日の翌日の0時過ぎに実行するため、前日を格納
                        'expire' => 1, // 満了
                    ]);
                // 同法人で停止日が入っているのに、満了になっていないデータがあれば更新
                // （一度掲載停止になって再開した際の最初のレコードを満了にするため）
                Contract::where('corporation_id', $corporation->corporation_id)
                    ->whereNotNull('end_date')
                    ->update([
                        'expire' => 1, // 満了
                    ]);
                // 掲載開始していない契約プランを取得
                $contract = Contract::where('corporation_id', $corporation->corporation_id)
                    ->whereNull('start_date')
                    ->order('id')
                    ->first();
                if ($contract) {
                    // あれば、新規の契約プランに掲載開始日と掲載終了日を入れて掲載停止はしない
                    $contract->update([
                        'start_date' => date('Y-m-d'),
                        'end_plan_date' => date('Y-m-d', strtotime('+' . $contract->plan->term . ' month +1 day')), // 開始した日付は除くため、+1日
                    ]);
                    $continue_corporation_name[] = $corporation->corporation_name;
                } else {
                    // なければ、掲載停止
                    Job::join('offices', function ($join) {
                            $join->on('jobs.office_id', '=', 'offices.id')
                                ->whereNull('offices.deleted_at');
                        })
                        ->join('corporations', function ($join) {
                            $join->on('offices.corporation_id', '=', 'corporations.id')
                                ->whereNull('corporations.deleted_at');
                        })
                        ->where('corporations.id', $corporation->corporation_id)
                        ->where('jobs.status', 10)
                        ->update([
                            'status' => 20,
                            'publish_end_date' => date('Y-m-d'),
                        ]);
                    $finish_corporation_name[] = $corporation->corporation_name;
                }
            }

            if (count($finish_corporation_name) > 0 || count($continue_corporation_name) > 0) {
                // メール送信
                // TODO
                // Chatwork通知
                Chatwork::noticeFinishOrContinueContractAlert(
                    '・' . implode("\r\n・", $finish_corporation_name),
                    '・' . implode("\r\n・", $continue_corporation_name)
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error($e);
            Chatwork::noticeSystemError($e);
        }
    }
}