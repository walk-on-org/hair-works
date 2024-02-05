<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;
use App\Models\Inquiry;
use App\Models\LpJobCategory;
use App\Models\Member;

class Chatwork extends Facade
{
    /**
     * 問い合わせ通知
     */
    public static function noticeInquiry($inquiry)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        $url = config('app.url') . '/admin/inquiries/' . $inquiry->id;
        $inquiry_type_name = Inquiry::INQUIRY_TYPE[$inquiry->inquiry_type];
        $message = <<<EOF
        [toall]
        サロン問い合わせがありました。対応をお願いします。
        {$url}
        ■サロン名：{$inquiry->salon_name}
        ■担当者名：{$inquiry->name}
        ■サロン所在地：{$inquiry->prefecture->name}
        ■電話番号：{$inquiry->tel}
        ■メールアドレス：{$inquiry->mail}
        ■お問い合わせ内容：{$inquiry_type_name}
        ■補足事項
        {$inquiry->inquiry_note}
        EOF;

        // 通知（サロン問い合わせ連携）
        return self::notice($message, '303953916');
    }

    /**
     * 会員登録Chatwork通知
     */
    public static function noticeRegisterMember($member, $is_send_customer_to_jobad = false, $is_applicant_recommend_job = false)
    {
        if ($is_send_customer_to_jobad) {
            \Log::debug('エージェント→求人広告へ送客');
        } else if ($is_applicant_recommend_job) {
            \Log::debug('求人広告→エージェントへ送客');
        } else if ($member->register_site == 1) {
            \Log::debug('求人広告のままに通知');
        } else {
            \Log::debug('エージェントのままに通知');
        }
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        // 本文作成
        $url = config('app.url') . '/admin/members/' . $member->id;
        $sf_url = $member->salesforce_id ? 'https://walk-on.lightning.force.com/lightning/r/Account/' . $member->salesforce_id . '/view' : '';
        $jobcategory = LpJobCategory::whereIn('id', array_column($member->lpJobCategories->toArray(), 'id'))
            ->pluck('name')
            ->join('、');
        $process = $is_applicant_recommend_job ? '人材紹介求人に応募' : '会員登録';
        $change_time = Member::CHANGE_TIME[$member->change_time];
        $resiter_site = Member::REGISTER_SITE[$member->register_site];
        $resiter_form = Member::REGISTER_FORM[$member->resiter_form];
        $message = <<<EOF
        [toall]
        {$register_site}より{$process}したユーザがいます。
        詳細は管理サイトよりご確認ください。
        {$url}
        {$sf_url}

        ■名前：{$member->name}
        ■メールアドレス：{$member->email}
        ■電話番号：{$member->phone}
        ■希望転職時期：{$change_time}
        ■希望勤務体系：{$member->employment->name}
        ■希望職種：{$jobcategory}
        ■希望勤務地：{$member->empPrefecture->name}
        ■登録サイト：{$register_site}
        ■登録フォーム：{$register_form}
        EOF;

        // 通知（求職者登録）
        if ($is_send_customer_to_jobad) {
            // エージェントのDV対象外は、求人広告
            return self::notice($message, '307741000');
        } else if ($is_applicant_recommend_job) {
            // 求人広告で人材紹介求人に応募した場合、人材紹介
            return self::notice($message, '325907207');
        } else if ($member->register_site == 1) {
            // 求人広告
            return self::notice($message, '307741000');
        } else {
            // 人材紹介
            return self::notice($message, '325907207');
        }
    }

    /**
     * 会員連絡可能日時通知
     */
    public static function noticeMemberProposalDatetime($member, $is_first_register, $is_send_customer = false)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        // 本文作成
        $url = config('app.url') . '/admin/members/' . $member->id;
        $sf_url = $member->salesforce_id ? 'https://walk-on.lightning.force.com/lightning/r/Account/' . $member->salesforce_id . '/view' : '';
        $process = $is_first_register ? '入力' : '変更';
        $message = <<< EOF
        [toall]
        会員登録したユーザが連絡可能日時を{$process}しました。
        詳細は管理サイトよりご確認ください。
        {$url}
        {$sf_url}

        ■名前：{$member->name}
        ■連絡可能日時：
        {$member->memberProposalDatetimesText}
        EOF;

        // 通知（求職者登録）
        if ($member->register_site == 1 || $is_send_customer == true) {
            // 求人広告
            return self::notice($message, '307741000');
        } else {
            // 人材紹介
            return self::notice($message, '325907207');
        }
    }

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
     * SMS受信通知
     */
    public static function noticeReciveSmsForAccete($member, $text, $is_send_customer_to_jobad = false, $is_applicant_recommend_job = false)
    {
        if ($is_send_customer_to_jobad) {
            \Log::debug('エージェント→求人広告へ送客');
        } else if ($is_applicant_recommend_job) {
            \Log::debug('求人広告→エージェントへ送客');
        } else if ($member->register_site == 1) {
            \Log::debug('求人広告のままに通知');
        } else {
            \Log::debug('エージェントのままに通知');
        }

        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }
     
        // 本文作成
        $url = config('app.url') . '/admin/members/' . $member->id;
        $sf_url = $member->salesforce_id ? 'https://walk-on.lightning.force.com/lightning/r/Account/' . $member->salesforce_id . '/view' : '';
        $message = <<<EOF
        [toall]
        会員登録したユーザよりSMSの返信が届いております。
        返信はアクリート管理サイトよりご確認ください。
        https://adm02.indigo-sms.jp/sics_aac/c/dashboard
        {$url}
        {$sf_url}

        ■名前：{$member->name}
        ■返信内容：
        {$text}
        EOF;

        // 通知（求職者登録）
        if ($is_send_customer_to_jobad) {
            // エージェントのDV対象外は、求人広告
            return self::notice($message, '307741000');
        } else if ($is_applicant_recommend_job) {
            // 求人広告で人材紹介求人に応募した場合、人材紹介
            return self::notice($message, '325907207');
        } else if ($member->register_site == 1) {
            // 求人広告
            return self::notice($message, '307741000');
        } else {
            // 人材紹介
            return self::notice($message, '325907207');
        }
    }

    /**
     * SMS受信通知（サロン）
     */
    public static function noticeReciveSalonSmsForAccrete($text, $phone)
    {
        // 連携スキップ判定
        if (self::isSkipChatwork()) {
            return true;
        }

        // 本文作成
        $message = <<<EOF
        [toall]
        会員登録したユーザではない方（サロン）よりSMSの返信が届いております。
        エリア担当に割り振り後、返信は会社の個人携帯でお願いします。
        https://adm02.indigo-sms.jp/sics_aac/c/dashboard

        ■電話番号：{$phone}
        ■返信内容：
        {$text}
        EOF;

        // 通知（サロン問い合わせ連携）
        return self::notice($message, '303953916');
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