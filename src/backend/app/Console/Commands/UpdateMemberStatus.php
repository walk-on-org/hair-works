<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\Chatwork;
use App\Models\Member;
use App\Models\NationalHoliday;
use Illuminate\Support\Facades\DB;

class UpdateMemberStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:update-member-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '会員のステータス更新';

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
            // 営業日ではない場合は、更新しない
            $today = date('Y-m-d', strtotime('1 day')); // AM6時に実行するため、UTFでは前日の日付になるので+1日
            \Log::debug($today);
            if (in_array(date('w', strtotime($today)), [0, 6])) {
                // 0=日曜日、6=土曜日の場合、更新しない
                \Log::debug('土日のため、スキップ');
                return;
            }

            $holiday = NationalHoliday::where('date', $today)->first();
            if ($holiday) {
                // 祝日マスタに登録されている日付の場合、更新しない
                \Log::debug('祝日マスタにあるため、スキップ');
                return;
            }

            // 5営業日前の日付を算出
            $target_date = date('Y-m-d', strtotime($today . ' -7 day'));
            $national_holiday_count = NationalHoliday::whereBetween('date', [$target_date, $today])
                ->whereRaw('weekday(date) between 0 and 5') // 平日に祝日があるか
                ->count();
            if ($national_holiday_count > 0) {
                $target_date date('Y-m-d', strtotime($target_date . ' -' . $national_holiday_count . ' day'));
            }
            \Log::debug($national_holiday_count);
            \Log::debug($target_date);

            // 5営業日以前に登録した未対応、連絡不通の求職者取得
            $members = Member::whereIn('status', [0, 1])
                ->where('created_at', '<', $target_date . ' 15:00:00')
                ->get();
            foreach ($members) {
                DB::beginTransaction();
                try {
                    // リリース（コンタクト無）に更新
                    $member->update([
                        'status' => 18,
                    ]);

                    // SFへ連携
                    // TODO
                    
                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Log::error($e);
                    Chatwork::noticeSystemError($e);
                }
            }
        } catch (\Exception $e) {
            \Log::error($e);
            Chatwork::noticeSystemError($e);
        }
    }
}