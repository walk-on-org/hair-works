<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;

class Salesforce extends Facade
{
    /**
     * SFサロンオブジェクト登録
     */
    public static function createSalonByInquiry($inquiry, $cvh)
    {
        // 連携スキップ判定
        if (self::isSkipSalesforce()) {
            return true;
        }
        // ログイン認証
        $result = self::loginSalesforce();
        if(!$result) {
            return false;
        }

        $access_token = $result['access_token'];
        $instance_url = $result['instance_url'];
        
        \Log::debug('salesforceサロン連携開始');
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $access_token,
        ])->asForm()->post($instance_url . '/services/data/v53.0/sobjects/Account/', [
            'RecordTypeId' => '0125h000000kzudAAA',
            'Name' => $inquiry->salon_name,
            'mail__c' => $inquiry->mail,
            'Phone' => $inquiry->tel,
            'BillingState' => $inquiry->prefecture->name,
            'BillingCountry' => '日本',
            'tourokukeiro__c' => $cvh ? $cvh->utm_source : '',
            'tourokucampaign__c' => $cvh ? $cvh->utm_campaign : '',
            'koukokukeyword__c' => $cvh ? self::getAdKeyword($cvh) : '',
            'IsRegisterByLp__c' => true,
            'LPtourokubi__c' => date('Y-m-d'),
        ]);
        \Log::debug($response->body());
        if ($response->status() != 200 && $response->status() != 201) {
            \Log::error($response->status());
            \Log::error($response->body());
            return false;
        }

        // SF顧客ID
        $account_id = $response->json()['id'];

        // 担当者情報を作成
        \Log::debug('salesforce担当者連携開始');
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $access_token,
        ])->asForm()->post($instance_url . '/services/data/v53.0/sobjects/Contact/', [
            'AccountId' => $account_id,
            'LastName' => $inquiry->name,
            'Email' => $inquiry->mail,
            'Phone' => $inquiry->tel,
            'MailingState' => $inquiry->prefecture->name,
            'MailingCountry' => '日本',
        ]);
        \Log::debug($response->body());
        if ($response->status() != 200 && $response->status() != 201) {
            $json = $response->json();
            if ($json[0]['errorCode'] == 'DUPLICATES_DETECTED') {
                // 重複エラーの場合はスルー
                return true;
            }
            \Log::error($response->status());
            \Log::error($response->body());
            return false;
        }
        return true;
    }

    /**
     * SF連携のスキップ判定
     */
    private static function isSkipSalesforce()
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
     * SFログイン
     */
    private static function loginSalesforce()
    {
        \Log::debug('salesforceログインAPI開始');

        $response = Http::asForm()->post(config('external.sf_login_url'), [
            'grant_type' => 'password',
            'client_id' => config('external.sf_client_id'),
            'client_secret' => config('external.sf_client_secret'),
            'username' => config('external.sf_username'),
            'password' => config('external.sf_password'),
        ]);

        \Log::debug($response->body());
        if ($response->status() != 200) {
            \Log::error($response->status());
            \Log::error($response->body());
            return null;
        }
        return $response->json();
    }

    /**
     * 広告キーワード取得
     */
    private static function getAdKeyword($cvh)
    {
        if (is_null($cvh->utm_source) || is_null($cvh->utm_medium) || is_null($cvh->utm_campaign) || is_null($cvh->utm_term)) {
            return '';
        }

        $ad_keyword = AdKeyword::where('utm_source', $cvh->utm_source)
            ->where('utm_medium', $cvh->utm_medium)
            ->where('utm_campaign', $cvh->utm_campaign)
            ->where('keyword_id', $cvh->utm_term)
            ->first();

        return $ad_keyword ? $ad_keyword->keyword : '';
    }
}