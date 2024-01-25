<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MultipleProcessManagement;
use App\Models\Office;
use App\Models\OfficeAccess;
use App\Models\OfficeClientele;
use App\Models\Corporation;
use App\Models\Prefecture;
use App\Models\City;
use App\Models\Line;
use App\Models\Station;
use Illuminate\Support\Facades\DB;

enum OfficeCsvColumn :int
{
    case OFFICE_ID = 0;
    case OFFICE_NAME = 1;
    case CORPORATION_ID = 2;
    case CORPORATION_NAME = 3;
    case POSTCODE = 4;
    case PREFECTURE_NAME = 5;
    case CITY_NAME = 6;
    case ADDRESS = 7;
    case TEL = 8;
    case FAX = 9;
    case OPEN_DATE = 10;
    case BUSINESS_TIME = 11;
    case REGULAR_HOLIDAY = 12;
    case FLOOR_SPACE = 13;
    case SEAT_NUM = 14;
    case SHAMPOO_STAND = 15;
    case STAFF = 16;
    case NEW_CUSTOMER_RATIO = 17;
    case CUT_UNIT_PRICE = 18;
    case CUSTOMER_UNIT_PRICE = 19;
    case CLIENTELE = 20;
    case PASSIVE_SMOKING = 21;
    case EXTERNAL_URL = 22;
    case SNS_URL = 23;
    case ACCESS = 24;
}

class ImportOfficeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:import-office-command {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '事業所インポートコマンド';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    // CSVカラム数
    const CSV_COLUMN_NUM = 25;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = (int) $this->argument('id');

        $management = MultipleProcessManagement::find($id);

        // CSV取得
        $csv = new \SplFileObject(storage_path('app/' . config('uploadimage.office_upload_storage') . $management->upload_file));
        $csv->setFlags(
            \SplFileObject::READ_CSV |      // CSVとして行を読み込み
            \SplFileObject::READ_AHEAD |    // 先読み／巻き戻しで読み込み
            \SplFileObject::SKIP_EMPTY |    // 空行を読み飛ばす
            \SplFileObject::DROP_NEW_LINE   // 行末の改行を読み飛ばす
        );

        // 管理テーブル更新（処理開始）
        $csv->seek(PHP_INT_MAX);
        $management->update([
            'status' => 1,  // 実行中
            'total_count' => $csv->key(),
        ]);

        $errors = [];
        $processed_count = 0;
        $error_count = 0;
        foreach ($csv as $index => $line) {
            if ($index == 0) {
                // ヘッダ行は除く
                continue;
            }

            DB::beginTransaction();
            try {
                // データチェック
                $office = Office::find($line[OfficeCsvColumn::OFFICE_ID->value]);
                $corporation = null;
                $prefecture = null;
                $city = null;
                $line_errors = self::validateCsvLine($index, $line, $office, $corporation, $prefecture, $city);
                if (count($line_errors) > 0) {
                    // エラー行はスキップ
                    // 管理テーブル更新（エラーカウントアップ）
                    $processed_count += 1;
                    $error_count += 1;
                    $errors = array_merge($errors, $line_errors);
                    $management->update([
                        'processed_count' => $processed_count,
                        'error_count' => $error_count,
                    ]);
                    DB::commit();
                    continue;
                }

                // 事業所の登録・更新
                if (!$office) {
                    // 登録
                    $office = Office::create([
                        'name' => $line[OfficeCsvColumn::OFFICE_NAME->value],
                        'corporation_id' => $corporation->id,
                        'postcode' => $line[OfficeCsvColumn::POSTCODE->value],
                        'prefecture_id' => $prefecture->id,
                        'city_id' => $city->id,
                        'address' => $line[OfficeCsvColumn::ADDRESS->value],
                        'tel' => $line[OfficeCsvColumn::TEL->value],
                        'fax' => $line[OfficeCsvColumn::FAX->value],
                        'open_date' => $line[OfficeCsvColumn::OPEN_DATE->value],
                        'business_time' => $line[OfficeCsvColumn::BUSINESS_TIME->value],
                        'regular_holiday' => $line[OfficeCsvColumn::REGULAR_HOLIDAY->value],
                        'floor_space' => $line[OfficeCsvColumn::FLOOR_SPACE->value],
                        'seat_num' => $line[OfficeCsvColumn::SEAT_NUM->value],
                        'shampoo_stand' => $line[OfficeCsvColumn::SHAMPOO_STAND->value],
                        'staff' => $line[OfficeCsvColumn::STAFF->value],
                        'new_customer_ratio' => $line[OfficeCsvColumn::NEW_CUSTOMER_RATIO->value],
                        'cut_unit_price' => $line[OfficeCsvColumn::CUT_UNIT_PRICE->value],
                        'customer_unit_price' => $line[OfficeCsvColumn::CUSTOMER_UNIT_PRICE->value],
                        'passive_smoking' => array_search($line[OfficeCsvColumn::PASSIVE_SMOKING->value], Office::PASSIVE_SMOKING),
                        'external_url' => $line[OfficeCsvColumn::EXTERANL_URL->value],
                        'sns_url' => $line[OfficeCsvColumn::SNS_URL->value],
                    ]);
                } else {
                    // 更新
                    $office->update([
                        'name' => $line[OfficeCsvColumn::OFFICE_NAME->value],
                        'corporation_id' => $corporation->id,
                        'postcode' => $line[OfficeCsvColumn::POSTCODE->value],
                        'prefecture_id' => $prefecture->id,
                        'city_id' => $city->id,
                        'address' => $line[OfficeCsvColumn::ADDRESS->value],
                        'tel' => $line[OfficeCsvColumn::TEL->value],
                        'fax' => $line[OfficeCsvColumn::FAX->value],
                        'open_date' => $line[OfficeCsvColumn::OPEN_DATE->value],
                        'business_time' => $line[OfficeCsvColumn::BUSINESS_TIME->value],
                        'regular_holiday' => $line[OfficeCsvColumn::REGULAR_HOLIDAY->value],
                        'floor_space' => $line[OfficeCsvColumn::FLOOR_SPACE->value],
                        'seat_num' => $line[OfficeCsvColumn::SEAT_NUM->value],
                        'shampoo_stand' => $line[OfficeCsvColumn::SHAMPOO_STAND->value],
                        'staff' => $line[OfficeCsvColumn::STAFF->value],
                        'new_customer_ratio' => $line[OfficeCsvColumn::NEW_CUSTOMER_RATIO->value],
                        'cut_unit_price' => $line[OfficeCsvColumn::CUT_UNIT_PRICE->value],
                        'customer_unit_price' => $line[OfficeCsvColumn::CUSTOMER_UNIT_PRICE->value],
                        'passive_smoking' => array_search($line[OfficeCsvColumn::PASSIVE_SMOKING->value], Office::PASSIVE_SMOKING),
                        'external_url' => $line[OfficeCsvColumn::EXTERANL_URL->value],
                        'sns_url' => $line[OfficeCsvColumn::SNS_URL->value],
                    ]);
                }

                // 事業所アクセス
                OfficeAccess::where('office_id', $office->id)->delete();
                foreach (explode('|', $line[OfficeCsvColumn::ACCESS->value]) as $access) {
                    $access_items = explode(' ', $access);
                    $line_row = Line::where('name', $access_items[0])->first();
                    $station_row = Station::where('name', $access_items[1])->first();
                    OfficeAccess::create([
                        'office_id' => $office->id,
                        'line_id' => $line_row->id,
                        'station_id' => $station_row->id,
                        'move_type' => array_search($access_items[2], OfficeAccess::MOVE_TYPE),
                        'time' => $access_items[3],
                        'note' => count($access_items) == 5 ? $access_items[4] : '',
                    ]);
                }

                // 事業所客層
                OfficeClientele::where('office_id', $office->id)->delete();
                foreach (explode('|', $line[OfficeCsvColumn::CLIENTELE->value]) as $value) {
                    $clientele = array_search($value, OfficeClientele::CLIENTELE);
                    if ($clientele !== false) {
                        OfficeClientele::create([
                            'office_id' => $office->id,
                            'clientele' => $clientele,
                        ]);
                    } else {
                        OfficeClientele::create([
                            'office_id' => $office->id,
                            'clientele' => 99,
                            'othertext' => $value,
                        ]);
                    }
                }

                // 管理テーブル更新（1行完了）
                $processed_count += 1;
                $management->update([
                    'processed_count' => $processed_count,
                ]);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error($e);
                $processed_count += 1;
                $error_count += 1;
                $management->update([
                    'processed_count' => $processed_count,
                    'error_count' => $error_count,
                ]);
            }
        }

        // エラー内容のCSVを配置
        $filename = self::saveErrorCsv($errors);

        // 管理テーブル更新（処理終了）
        $management->update([
            'error_file' => $filename !== false ? $filename : null,
            'status' => 2,  // 実行済
        ]);
    }

    /**
     * CSVファイルの行のバリデーション
     */
    private function validateCsvLine($index, $line, $office, &$corporation, &$prefecture, &$city)
    {
        $errors = [];

        // 列数チェック
        if (count($line) != self::CSV_COLUMN_NUM) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '列数が正しくありません。（列数=' . count($line) . '）',
            ];
            return $errors;
        }

        // 事業所
        // 事業所IDとCSVの法人IDチェック
        if ($office && $office->corporation_id != $line[OfficeCsvColumn::CORPORATION_ID->value]) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '事業所が指定した法人と一致しません。'
            ];
        }

        // 法人
        // 存在チェック
        $corporation = Corporation::where('id', $line[OfficeCsvColumn::CORPORATION_ID->value])
            ->where('name', $line[OfficeCsvColumn::CORPORATION_NAME->value])
            ->first();
        if (!$corporation) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '法人が存在しません。（法人ID=' . $line[OfficeCsvColumn::CORPORATION_ID->value] . '、法人名=' . $line[OfficeCsvColumn::CORPORATION_NAME->value] . '）',
            ];
        }
        
        // 郵便番号
        // 必須チェック
        if (self::isNullOrEmpty($line[OfficeCsvColumn::POSTCODE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '郵便番号を入力してください。',
            ];
        }

        // 都道府県
        // 存在チェック
        $prefecture = Prefecture::where('name', $line[OfficeCsvColumn::PREFECTURE_NAME->value])
            ->first();
        if (!$prefecture) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '都道府県が存在しません。（' . $line[OfficeCsvColumn::PREFECTURE_NAME->value] . '）'
            ];
        }

        // 市区町村
        // 存在チェック
        $city = City::where('name', $line[OfficeCsvColumn::CITY_NAME->value])
            ->first();
        if (!$city) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '市区町村が存在しません。（' . $line[OfficeCsvColumn::CITY_NAME->value] . '）'
            ];
        }

        // 住所
        // 必須チェック
        if (self::isNullOrEmpty($line[OfficeCsvColumn::ADDRESS->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '住所を入力してください。',
            ];
        }

        // 電話番号
        // なし

        // FAX番号
        // なし

        // 開店・リニューアル日
        // 日付チェック
        if (!self::isOptionalDate($line[OfficeCsvColumn::OPEN_DATE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '開店・リニューアル日は日付形式（年-月-日）で入力してください。',
            ];
        }

        // 営業時間
        // なし

        // 定休日
        // なし

        // 坪数
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::FLOOR_SPACE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '坪数は数値で入力してください。',
            ];
        }

        // セット面
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::SEAT_NUM->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => 'セット面は数値で入力してください。',
            ];
        }

        // シャンプー台
        // なし

        // スタッフ数
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::STAFF->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => 'スタッフ数は数値で入力してください。',
            ];
        }

        // 新規客割合
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::NEW_CUSTOMER_RATIO->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '新規客割合は数値で入力してください。',
            ];
        }

        // 標準カット単価
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::CUT_UNIT_PRICE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '標準カット単価は数値で入力してください。',
            ];
        }

        // 顧客単価
        // 数値チェック
        if (!self::isOptionalNumeric($line[OfficeCsvColumn::CUSTOMER_UNIT_PRICE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '顧客単価は数値で入力してください。',
            ];
        }

        // 客層
        // なし

        // 受動喫煙対策
        // 存在チェック
        if (!self::isPassiveSmoking($line[OfficeCsvColumn::PASSIVE_SMOKING->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '受動喫煙対策に存在しない値が入力されております。',
            ];
        }

        // サロンURL
        // なし

        // SNSリンク
        // なし

        // アクセス（路線 駅 移動手段 時間 備考）
        $access_list = explode('|', $line[OfficeCsvColumn::ACCESS->value]);
        foreach ($access_list as $access) {
            $access_items = explode(' ', $access);

            // アクセス項目数チェック
            if (count($access_items) < 4 || count($access_items) > 5) {
                // 半角文字に区切って、4つor5つの項目でない場合、エラー
                $errors[] = [
                    'row' => $index + 1,
                    'message' => 'アクセスに入力した項目は半角文字区切りで路線、駅、移動手段、時間、備考を入力してください。（' . $access . '）',
                ];
            }

            // 路線存在チェック
            $line = Line::where('name', $access_items[0])->first();
            if (!$line) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '路線が存在しません。（' . $access_items[0] . '）'
                ];
            }

            // 駅存在チェック
            $station = Station::where('name', $access_items[1])->first();
            if (!$station) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '駅が存在しません。（' . $access_items[1] . '）'
                ];
            }

            // 移動手段存在チェック
            if (in_array($access_items[2], OfficeAccess::MOVE_TYPE) !== true) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '移動手段は徒歩、車、バスから入力してください。（' . $access_items[2] . '）'
                ];
            }

            // 時間数値チェック
            if (!is_numeric($access_items[3])) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '時間は数値を入力してください。（' . $access_items[3] . '）'
                ];
            }
        }

        return $errors;
    }

    /**
     * Null or 空文字判定
     */
    private function isNullOrEmpty($str)
    {
        if ($str == null) {
            return true;
        }
        if ($str == "") {
            return true;
        }
        return false;
    }

    /**
     * 任意の数値判定
     */
    private function isOptionalNumeric($str)
    {
        if (self::isNullOrEmpty($str)) {
            return true;
        }
        if (is_numeric($str)) {
            return true;
        }
        return false;
    }

    /**
     * 任意の日付判定
     */
    private function isOptionalDate($str)
    {
        if (self::isNullOrEmpty($str)) {
            return true;
        }
        if (!preg_match('/^[1-9]{1}[0-9]{0,3}-[0-9]{1,2}-[0-9]{1,2}$/', $str)) {
            return false;
        }
        list($y, $m, $d) = explode('-', $str);
        if (!checkdate($m, $d, $y)) {
            return false;
        }
        return true;
    }

    /**
     * 受動喫煙対策の判定
     */
    private function isPassiveSmoking($str)
    {
        if (self::isNullOrEmpty($str)) {
            return false;
        }
        if (in_array($str, Office::PASSIVE_SMOKING) === true) {
            return true;
        }
        return false;
    }

    /**
     * エラーCSVを保存
     */
    private function saveErrorCsv($errors)
    {
        if (count($errors) == 0) {
            return false;
        }

        $filename = time() . '_' . 'error.csv';

        // ヘッダー
        $error_csv = fopen(storage_path() . '/app/' . config('uploadimage.office_error_storage') . $filename, 'w');
        $columns = [
            'row' => '行数',
            'message' => 'エラー内容',
        ];
        mb_convert_variables('SJIS-win', 'UTF-8', $columns);
        fputcsv($error_csv, $columns);

        // エラー内容を追加
        foreach ($errors as $error) {
            $data = [
                'row' => $error['row'],
                'message' => $error['message'],
            ];
            mb_convert_variables('SJIS-win', 'UTF-8', $data);
            fputcsv($error_csv, $data);
        }
        fclose($error_csv);

        return $filename;
    }
}
