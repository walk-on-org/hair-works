<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Http;
use App\Models\City;
use App\Models\LpJobCategory;
use App\Models\Member;
use App\Models\Qualification;

class Salesforce extends Facade
{
    /**
     * 会員情報からSF求職者オブジェクト登録
     */
    public static function createKyuusyokusya($member, $cvh, $job = null)
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

        // 求職者情報を作成
        \Log::debug('salesforce求職者登録連携開始');
        // 市区町村と番地を分ける
        $city = City::where('prefecture_id', $member->prefecture_id)
            ->whereRaw('? like concat(name, \'%\')', [$member->address])
            ->first();
        $billing_city = '';
        $billing_street = $member->address;
        if ($city) {
            $billing_city = $city->name;
            $billing_street = str_replace($city->name, '', $billing_street);
        }
        // 希望職種
        $kibousyokusyu = LpJobCategory::whereIn('id', array_column($member->lpJobCategories->toArray(), 'id'))
            ->pluck('name')
            ->join(';');
        $kibousyokusyu = str_replace('（中途）', '', $kibousyokusyu);
        $kibousyokusyu = str_replace('（新卒）', '', $kibousyokusyu);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $access_token,
        ])->asForm()->post($instance_url . '/services/data/v53.0/sobjects/Account/', [
            'RecordTypeId' => '0125h000000l0IqAAI',
            'LastName' => $member->name,
            'kana__c' => $member->name_kana,
            'joutai__c' => Member::STATUS[$member->status],
            'tourokubi__c' => date('Y/m/d H:i:s'),
            'mail__c' => $member->email,
            'Phone' => $member->phone,
            'birthday__c' => $member->birthyear,
            'hoyuusikaku__c' => Qualification::whereIn('id', array_column($member->qualifications->toArray(), 'id'))->pluck('name')->join(';'),
            'kibousyokusyu__c' => $kibousyokusyu,
            'tensyokujiki__c' => Member::CHANGE_TIME[$member->change_time],
            'kinnmukeitai__c' => $member->employment->name,
            'kibouti__c' => $member->empPrefecture->name,
            'taisyokuikou__c' => Member::RETIREMENT_TIME[$member->retirement_time],
            'tourokusaito__c' => Member::REGISTER_SITE[$member->register_site],
            'tourokukeiro__c' => $cvh ? $cvh->utm_source : '',
            'tourokucampaign__c' => $cvh ? $cvh->utm_campaign : '',
            'koukokukeyword__c' => $cvh ? self::getAdKeyword($cvh) : '',
            'tourokuform__c' => Member::REGISTER_FROM[$member->register_form],
            'introductionname__c' => $member->introduction_name,
            'introductionaccount__c' => $member->introductionMember ? $member->introductionMember->salesforce_id : '',
            'introductiongiftstatus__c' => Member::INTRODUCTION_GIFT_STATUS[$member->introduction_gift_status],
            'BillingPostalCode' => $member->postcode,
            'BillingState' => $member->prefecture->name,
            'BillingCity' => $billing_city,
            'BillingStreet' => $billing_street,
            'BillingCountry' => '日本',
            'SoukyakuFlg2__c' => $job ? ($job->recommend ? true : false) : false,
            'JobChangeFeeling__c' => Member::JOB_CHANGE_FEELING[$member->job_change_feeling],
        ]);
        \Log::debug($response->body());
        if ($response->status() != 200 && $response->status() != 201) {
            \Log::error($response->status());
            \Log::error($response->body());
            return false;
        }
        // SFのIDを会員情報へ登録
        $json = $response->json();
        $member->update([
            'salesforce_id' => $json['id'],
        ]);
        return true;
    }

    /**
     * SF求職者オブジェクト更新
     */
    public static function updateKyusyokusya($member)
    {
        // 連携スキップ判定
        if (self::isSkipSalesforce()) {
            return true;
        }
        // SalesForceIDが未登録なら連携しない
        if (!$member->salesforce_id) {
            \Log::debug('SalesForceID未登録のため、スキップ');
            return true;
        }
        // ログイン認証
        $result = self::loginSalesforce();
        if(!$result) {
            return false;
        }

        $access_token = $result['access_token'];
        $instance_url = $result['instance_url'];

        // 求職者情報を作成
        \Log::debug('salesforce求職者更新連携開始');
        // 市区町村と番地を分ける
        $city = City::where('prefecture_id', $member->prefecture_id)
            ->whereRaw('? like concat(name, \'%\')', [$member->address])
            ->first();
        $billing_city = '';
        $billing_street = $member->address;
        if ($city) {
            $billing_city = $city->name;
            $billing_street = str_replace($city->name, '', $billing_street);
        }
        // 希望職種
        $kibousyokusyu = LpJobCategory::whereIn('id', array_column($member->lpJobCategories->toArray(), 'id'))
            ->pluck('name')
            ->join(';');
        $kibousyokusyu = str_replace('（中途）', '', $kibousyokusyu);
        $kibousyokusyu = str_replace('（新卒）', '', $kibousyokusyu);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $access_token,
        ])->asForm()->post($instance_url . '/services/data/v53.0/sobjects/Account/' . $member->salesforce_id, [
            'LastName' => $member->name,
            'kana__c' => $member->name_kana,
            'joutai__c' => Member::STATUS[$member->status],
            'mail__c' => $member->email,
            'Phone' => $member->phone,
            'birthday__c' => $member->birthyear,
            'hoyuusikaku__c' => Qualification::whereIn('id', array_column($member->qualifications->toArray(), 'id'))->pluck('name')->join(';'),
            'kibousyokusyu__c' => $kibousyokusyu,
            'tensyokujiki__c' => Member::CHANGE_TIME[$member->change_time],
            'kinnmukeitai__c' => $member->employment->name,
            'kibouti__c' => $member->empPrefecture->name,
            'taisyokuikou__c' => Member::RETIREMENT_TIME[$member->retirement_time],
            'introductionname__c' => $member->introduction_name,
            'introductionaccount__c' => $member->introductionMember ? $member->introductionMember->salesforce_id : '',
            'introductiongiftstatus__c' => Member::INTRODUCTION_GIFT_STATUS[$member->introduction_gift_status],
            'BillingPostalCode' => $member->postcode,
            'BillingState' => $member->prefecture->name,
            'BillingCity' => $billing_city,
            'BillingStreet' => $billing_street,
            'JobChangeFeeling__c' => Member::JOB_CHANGE_FEELING[$member->job_change_feeling],
        ]);
        \Log::debug($response->body());
        if ($response->status() != 200 && $response->status() != 201 && $response->status() != 204) {
            \Log::error($response->status());
            \Log::error($response->body());
            return false;
        }
    }

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