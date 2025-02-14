<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;

class RegisterRoot extends Facade
{
    /**
     * utmパラメータから登録経路に変換
     * @param string $utm_source    参照元
     * @param string $utm_medium    メディア
     * @param string $utm_campaign  キャンペーン
     * @param boolean $suffix_utm   utmパラメータ情報を付けるか
     */
    public static function getRegisterRootByUtmParams($utm_source, $utm_medium, $utm_campaign, $suffix_utm = false)
    {
        if (!$utm_source) {
            return '不明';
        }

        $root = '';
        // 会員登録
        if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing') {
            $root = 'リスティング広告(美容師求人)';
        } else if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing_hairmake') {
            $root = 'リスティング広告(ヘアメイク)';
        } else if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing_eyelist') {
            $root = 'リスティング広告(アイリスト)';
        } else if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing_colorlist') {
            $root = 'リスティング広告(ヘアメイク)';
        } else if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing_hairmake') {
            $root = 'リスティング広告(カラーリスト)';
        } else if ($utm_source == 'google' && $utm_campaign == 'agent') {
            $root = 'リスティング広告(エージェント)';
        } else if ($utm_source == 'google' && $utm_campaign == 'agent_display') {
            $root = 'リターゲティング広告(エージェント/ディスプレイ)';
        } else if ($utm_source == 'google' && $utm_campaign == 'agent_demand') {
            $root = 'リターゲティング広告(エージェント/デマンドジェネレーション)';
        } else if ($utm_source == 'yahoo' && $utm_campaign == 'yahoo_listing') {
            $root = 'リスティング広告(Yahoo)';
        // 応募者
        } else if ($utm_source == 'Indeed') {
            $root = 'Indeed';
        } else if ($utm_source == 'kbox') {
            $root = '求人ボックス';
        } else if (strpos($utm_source, 'stanby') !== false && strpos($utm_source, 'Stanby') !== false) {
            $root = 'スタンバイ';
        } else if ($utm_source == 'google_jobs_apply') {
            $root = 'GoogleForJobs';
        } else if ($utm_source == 'mailmagazine') {
            $root = 'メルマガ';
        } else if (strpos($utm_source, 'media') !== false) {
            $root = 'メディア';
        } else if ($utm_source == 'member_complete_mail') {
            $root = '会員登録完了メール';
        // 採用担当者向け
        } else if ($utm_source == 'google' && $utm_campaign == 'gooogle_listing_inquiry') {
            $root = 'リスティング広告(採用担当者向け)';
        } else if ($utm_source == 'salondm') {
            $root = 'サロンDM';
        } else if ($utm_source == 'faxdm') {
            $root = 'FAX DM';
        } else if ($utm_source == 'formsales') {
            $root = 'フォーム営業';
        } else if (strpos($utm_source, 'introduction') !== false && $utm_campaign == 'introduction') {
            $root = '顧客紹介メール(' . str_replace('introduction_', '', $utm_source). ')';
        } else if ($utm_source == 'apptmail') {
            $root = '資料送付メール';
        } else if ($utm_source == 'prtimes') {
            $root = 'PRタイムズ';
        } else if ($utm_source == 'salonmagazine') {
            $root = '雑誌広告';
        } else {
            $root = '不明';
        }

        if ($suffix_utm) {
            $root .= "({$utm_source}/{$utm_medium})";
        }
        return $root;
    }

    /**
     * utmパラメータから登録経路に変換（応募者用）
     * @param string $utm_source    参照元
     * @param string $utm_medium    メディア
     * @param string $utm_campaign  キャンペーン
     * @param string $member_register_date      会員登録日時
     * @param string $applicant_register_date   応募者登録日時
     * @param boolean $suffix_utm   utmパラメータ情報を付けるか
     */
    public static function getApplicantRegisterRootByUtmParams($utm_source, $utm_medium, $utm_campaign, $member_register_date, $applicant_register_date, $suffix_utm = false)
    {
        if (!$utm_source) {
            // 以前に会員登録があるか
            if ($member_register_date && $applicant_register_date) {
                if (strtotime($member_register_date) < strtotime($applicant_register_date)) {
                    return '自然応募（会員登録後）';
                }
            }
            return '自然応募（オーガニックor不明）';
        }

        $root = '';
        if ($utm_source == '応募促進') {
            return '応募促進';
        } else if ($utm_source == 'Indeed') {
            $root = '広告経由（Indeed）';
        } else if ($utm_source == 'kbox') {
            $root = '広告経由（求人ボックス）';
        } else if (strpos($utm_source, 'stanby') !== false && strpos($utm_source, 'Stanby') !== false) {
            $root = '広告経由（スタンバイ）';
        } else if ($utm_source == 'google_jobs_apply') {
            $root = '自然応募（GoogleForJobs）';
        } else if ($utm_source == 'mailmagazine') {
            $root = '自然応募（メルマガ）';
        } else if (strpos($utm_source, 'media') !== false) {
            $root = '自然応募（メディア）';
        } else if ($utm_source == 'google' && $utm_medium == 'cpc') {
            $root = '広告経由（Googleリスティング広告）';
        } else if ($utm_source == 'google' && $utm_medium == 'cpc') {
            $root = '広告経由（Yahooリスティング広告）';
        } else if ($utm_source == 'member_complete_mail') {
            $root = '自然応募（会員登録後）';
        } else {
            $root = '自然応募（オーガニックor不明）';
        }

        if ($suffix_utm) {
            $root .= "({$utm_source}/{$utm_medium})";
        }
        return $root;
    }
}