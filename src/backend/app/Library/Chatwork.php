<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;

class Chatwork extends Facade
{
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