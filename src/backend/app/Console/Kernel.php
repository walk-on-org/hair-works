<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // 毎日AM0時10分に実行
        $schedule->command('command:notice-finish-contact')
            ->dailyAt('15:10');
        // 毎日AM0時20分に実行
        $schedule->command('command:notice-before-finish-contact')
            ->dailyAt('15:20');
        // 毎日AM1時に実行
        $schedule->command('command:create-indeed-xml')
            ->dailyAt('16:00');
        // 毎日AM1時15分に実行
        $schedule->command('command:create-kyujinbox-xml')
            ->dailyAt('16:15');
        // 毎日AM1時30分に実行
        $schedule->command('command:create-stanby-xml')
            ->dailyAt('16:30');
        // 毎日AM2時に実行
        $schedule->command('command:compensate-latlng')
            ->dailyAt('17:00');
        // 毎日AM6時に実行
        $schedule->command('command:update-member-status')
            ->dailyAt('21:00');
        // 毎日AM8時に実行
        $schedule->command('command:notice-applicant-count')
            ->dailyAt('23:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
