<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Library\LatLngAddress;
use App\Library\Chatwork;
use App\Models\Member;
use App\Models\Office;
use Illuminate\Support\Facades\DB;

class CompensateLatLng extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:compensate-latlng';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '会員や事業所の緯度経度を補填';

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
        // 緯度経度が入っていない会員を取得
        $members = Member::join('prefectures', 'members.prefecture_id', '=', 'prefectures.id')
            ->where(function ($query) {
                $query->whereNull('members.lat')
                    ->orWhereNull('members.lng');
            })
            ->select(
                'members.id',
                'members.prefecture_id',
                'prefectures.name as prefecture_name',
                'members.address',
            )
            ->get();
        foreach ($members as $member) {
            DB::beginTransaction();
            try {
                // 緯度経度取得
                $latlng = LatLngAddress::getLatLngInfoByAddress($member->prefecture_id, $member->address);
                if ($latlng === false) {
                    // 取得できない場合は、都道府県のみで緯度経度取得
                    $latlng = LatLngAddress::getLatLngInfoByAddress($member->prefecture_id, "");
                }

                // 緯度経度を登録
                if ($latlng !== false) {
                    Member::find($member->id)->update([
                        'lat' => $latlng['lat'],
                        'lng' => $latlng['lng'],
                    ]);
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                Chatwork::noticeSystemError($e);
            }
        }

        // 緯度経度が入っていない事業所を取得
        $offices = Office::join('prefectures', 'offices.prefecture_id', '=', 'prefectures.id')
            ->join('cities', 'offices.city_id', '=', 'cities.id')
            ->where(function ($query) {
                $query->whereNull('offices.lat')
                    ->orWhereNull('offices.lng');
            })
            ->select(
                'offices.id',
                'offices.prefecture_id',
                'prefectures.name as prefecture_name',
                'cities.name as city_name',
                'offices.address',
            )
            ->get();
        foreach ($offices as $office) {
            DB::beginTransaction();
            try {
                // 緯度経度取得
                $latlng = LatLngAddress::getLatLngInfoByAddress($office->prefecture_id, $office->city_name . $office->address);
                if ($latlng === false) {
                    // 取得できない場合は、都道府県のみで緯度経度取得
                    $latlng = LatLngAddress::getLatLngInfoByAddress($office->prefecture_id, "");
                }

                // 緯度経度を登録
                if ($latlng !== false) {
                    Office::find($office->id)->update([
                        'lat' => $latlng['lat'],
                        'lng' => $latlng['lng'],
                    ]);
                }
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                Chatwork::noticeSystemError($e);
            }
        }
    }
}