<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;

class Chatwork extends Facade
{
    /**
     * 応募ゼロ通知
     */
    public static function noticeApplicantZero($first_contract_one_month_corporations, $first_contract_two_month_corporations, $continuation_contract_two_month_corporations)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $message = <<<EOF
        [toall]
        契約後に応募がまだ来ていない法人が存在します。
        詳細は管理サイトからご確認ください。

        ◆新規契約で掲載開始から30日経過しても応募がない法人
        {$first_contract_one_month_corporations}

        ◆新規契約で掲載開始から60日経過しても応募がない法人
        {$first_contract_two_month_corporations}

        ◆継続契約で掲載開始から60日経過しても応募がない法人
        {$continuation_contract_two_month_corporations}
        EOF;

        // 通知（応募&継続アラート）
        return self::notice($message, '338398730');
    }

    /**
     * 応募有通知
     */
    public static function noticeApplicantNotZero($first_contract_one_month_corporations, $first_contract_two_month_corporations, $continuation_contract_one_month_corporations, $continuation_contract_two_month_corporations)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $message = <<<EOF
        [toall]
        契約後に応募があった法人をお知らせします。
        詳細は管理サイトからご確認ください。

        ◆新規契約で掲載開始から30日経過しても応募があった法人
        {$first_contract_one_month_corporations}

        ◆新規契約で掲載開始から60日経過しても応募があった法人
        {$first_contract_two_month_corporations}

        ◆継続契約で掲載開始から30日経過しても応募があった法人
        {$continuation_contract_one_month_corporations}

        ◆継続契約で掲載開始から60日経過しても応募があった法人
        {$continuation_contract_two_month_corporations}
        EOF;

        // 通知（応募&継続アラート）
        return self::notice($message, '338398730');
    }

    /**
     * 契約終了30日前アラート通知
     */
    public static function noticeBeforeFinishContractAlert($corporations)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $message = <<<EOF
        [toall]
        契約終了間近の法人があります。
        契約更新する場合、新規に契約プランを登録してください。
        詳細は管理サイトからご確認ください。

        ◆契約終了間近の法人
        {$corporations}
        EOF;

        // 通知（応募&継続アラート）
        return self::notice($message, '338398730');
    }
    
    /**
     * 契約終了or継続アラート通知
     */
    public static function noticeFinishOrContinueContractAlert($finish_corporations, $continue_corporations)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $message = <<<EOF
        [toall]
        契約終了or継続の法人があります。
        詳細は管理サイトからご確認ください。

        ◆契約終了の法人
        {$finish_corporations}

        ◆契約継続の法人
        {$continue_corporations}
        EOF;

        // 通知（応募&継続アラート）
        return self::notice($message, '338398730');
    }

    /**
     * システムエラー通知
     */
    public static function noticeSystemError($error)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $message = <<<EOF
        [toall]
        エラーが発生しました。
        確認してください。

        【エラー内容】
        {$error}
        EOF;

        // 通知（HWエラー通知）
        return self::notice($message, '326185560');
    }

    /**
     * チャットワーク連携のスキップ判定
     */
    private static function isSkipChatwork()
    {
        if (config('app.env') == 'local') {
            // 開発環境
            \Log::debug('開発環境のためChatwork連携をスキップ');
            return true;
        } else if (config('app.env') == 'test') {
            // テスト環境
            \Log::debug('テスト環境のためChatwork連携をスキップ');
            return true;
        } else {
            return false;
        }
    }

    /**
     * チャットワーク通知
     */
    private static function notice($message, $room_id)
    {
        $api_token = config('external.chatwork_api_token');

        $response = Http::withHeaders([
            'X-ChatWorkToken' => $api_token,
        ])->asForm()->post("https://api.chatwork.com/v2/rooms/{$room_id}/messages", [
            'body' => $message,
        ]);

        \Log::debug($response->body());
        if ($response->status() != 200 && $response->status() != 201) {
            return false;
        }
        return true;
    }
}