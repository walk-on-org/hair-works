<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MultipleProcessManagement;
use App\Models\Job;
use App\Models\JobHoliday;
use App\Models\JobQualification;
use App\Models\JobCommitmentTerm;
use App\Models\Office;
use App\Models\JobCategory;
use App\Models\Position;
use App\Models\Employment;
use App\Models\Holiday;
use App\Models\Qualification;
use App\Models\CommitmentTerm;
use Illuminate\Support\Facades\DB;

enum JobCsvColumn :int
{
    case JOB_ID = 0;
    case JOB_NAME = 1;
    case CORPORATION_ID = 2;
    case OFFICE_NAME = 3;
    case STATUS = 4;
    case PICKUP = 5;
    case PRIVATE = 6;
    case RECOMMEND = 7;
    case INDEED_PRIVATE = 8;
    case MINIMUM_WAGE_OK = 9;
    case JOB_CATEGORY = 10;
    case POSITION = 11;
    case EMPLOYMENT = 12;
    case M_SALARY_LOWER = 13;
    case M_SALARY_UPPER = 14;
    case T_SALARY_LOWER = 15;
    case T_SALARY_UPPER = 16;
    case D_SALARY_LOWER = 17;
    case D_SALARY_UPPER = 18;
    case COMMISSION_LOWER = 19;
    case COMMISSION_UPPER = 20;
    case SALARY = 21;
    case WORK_TIME = 22;
    case JOB_DESCRIPTION = 23;
    case HOLIDAY = 24;
    case HOLIDAY_MEMO = 25;
    case WELFARE = 26;
    case QUALIFICATION = 27;
    case ENTRY_REQUIREMENT = 28;
    case CATCH_COPY = 29;
    case RECOMMEND_POINT = 30;
    case SALON_MESSAGE = 31;
    case COMMITMENT_TERM = 32;
}

class ImportJobCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:import-job-command {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '求人インポートコマンド';

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
    const CSV_COLUMN_NUM = 33;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = (int) $this->argument('id');

        $management = MultipleProcessManagement::find($id);

        // CSV取得
        $csv = new \SplFileObject(storage_path('app/' . config('uploadimage.job_upload_storage') . $management->upload_file));
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
                $job = Job::find($line[JobCsvColumn::JOB_ID->value]);
                $office = null;
                $job_category = null;
                $position = null;
                $employment = null;
                $line_errors = self::validateCsvLine($index, $line, $job, $office, $job_category, $position, $employment);
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

                // 求人の登録・更新
                if (!$job) {
                    // 登録
                    $job = Job::create([
                        'name' => $line[JobCsvColumn::JOB_NAME->value],
                        'office_id' => $office->id,
                        'pickup' => $line[JobCsvColumn::PICKUP->value] == 'true' ? 1 : 0,
                        'private' => $line[JobCsvColumn::PRIVATE->value] == 'true' ? 1 : 0,
                        'recommend' => $line[JobCsvColumn::RECOMMEND->value] == 'true' ? 1 : 0,
                        'indeed_private' => $line[JobCsvColumn::INDEED_PRIVATE->value] == 'true' ? 1 : 0,
                        'minimum_wage_ok' => $line[JobCsvColumn::MINIMUM_WAGE_OK->value] == 'true' ? 1 : 0,
                        'job_category_id' => $job_category->id,
                        'position_id' => $position->id,
                        'employment_id' => $employment->id,
                        'm_salary_lower' => $line[JobCsvColumn::M_SALARY_LOWER->value],
                        'm_salary_upper' => $line[JobCsvColumn::M_SALARY_UPPER->value],
                        't_salary_lower' => $line[JobCsvColumn::T_SALARY_LOWER->value],
                        't_salary_upper' => $line[JobCsvColumn::T_SALARY_UPPER->value],
                        'd_salary_lower' => $line[JobCsvColumn::D_SALARY_LOWER->value],
                        'd_salary_upper' => $line[JobCsvColumn::D_SALARY_UPPER->value],
                        'commission_lower' => $line[JobCsvColumn::COMMISSION_LOWER->value],
                        'commission_upper' => $line[JobCsvColumn::COMMISSION_UPPER->value],
                        'salary' => $line[JobCsvColumn::SALARY->value],
                        'work_time' => $line[JobCsvColumn::WORK_TIME->value],
                        'job_description' => $line[JobCsvColumn::JOB_DESCRIPTION->value],
                        'holiday' => $line[JobCsvColumn::HOLIDAY_MEMO->value],
                        'welfare' => $line[JobCsvColumn::WELFARE->value],
                        'entry_requirement' => $line[JobCsvColumn::ENTRY_REQUIREMENT->value],
                        'catch_copy' => $line[JobCsvColumn::CATCH_COPY->value],
                        'recommend_point' => $line[JobCsvColumn::RECOMMEND_POINT->value],
                        'salon_message' => $line[JobCsvColumn::SALON_MESSAGE->value],
                        'status' => 0,
                    ]);
                } else {
                    // 更新
                    $job->update([
                        'name' => $line[JobCsvColumn::JOB_NAME->value],
                        'office_id' => $office->id,
                        'pickup' => $line[JobCsvColumn::PICKUP->value] == 'true' ? 1 : 0,
                        'private' => $line[JobCsvColumn::PRIVATE->value] == 'true' ? 1 : 0,
                        'recommend' => $line[JobCsvColumn::RECOMMEND->value] == 'true' ? 1 : 0,
                        'indeed_private' => $line[JobCsvColumn::INDEED_PRIVATE->value] == 'true' ? 1 : 0,
                        'minimum_wage_ok' => $line[JobCsvColumn::MINIMUM_WAGE_OK->value] == 'true' ? 1 : 0,
                        'job_category_id' => $job_category->id,
                        'position_id' => $position->id,
                        'employment_id' => $employment->id,
                        'm_salary_lower' => $line[JobCsvColumn::M_SALARY_LOWER->value],
                        'm_salary_upper' => $line[JobCsvColumn::M_SALARY_UPPER->value],
                        't_salary_lower' => $line[JobCsvColumn::T_SALARY_LOWER->value],
                        't_salary_upper' => $line[JobCsvColumn::T_SALARY_UPPER->value],
                        'd_salary_lower' => $line[JobCsvColumn::D_SALARY_LOWER->value],
                        'd_salary_upper' => $line[JobCsvColumn::D_SALARY_UPPER->value],
                        'commission_lower' => $line[JobCsvColumn::COMMISSION_LOWER->value],
                        'commission_upper' => $line[JobCsvColumn::COMMISSION_UPPER->value],
                        'salary' => $line[JobCsvColumn::SALARY->value],
                        'work_time' => $line[JobCsvColumn::WORK_TIME->value],
                        'job_description' => $line[JobCsvColumn::JOB_DESCRIPTION->value],
                        'holiday' => $line[JobCsvColumn::HOLIDAY_MEMO->value],
                        'welfare' => $line[JobCsvColumn::WELFARE->value],
                        'entry_requirement' => $line[JobCsvColumn::ENTRY_REQUIREMENT->value],
                        'catch_copy' => $line[JobCsvColumn::CATCH_COPY->value],
                        'recommend_point' => $line[JobCsvColumn::RECOMMEND_POINT->value],
                        'salon_message' => $line[JobCsvColumn::SALON_MESSAGE->value],
                    ]);
                }

                // 求人休日
                JobHoliday::where('job_id', $job->id)->delete();
                foreach (explode('|', $line[JobCsvColumn::HOLIDAY->value]) as $value) {
                    $holiday = Holiday::where('name', $value)->first();
                    JobHoliday::create([
                        'job_id' => $job->id,
                        'holiday_id' => $holiday->id,
                    ]);
                }

                // 求人資格
                JobQualification::where('job_id', $job->id)->delete();
                foreach (explode('|', $line[JobCsvColumn::QUALIFICATION->value]) as $value) {
                    $qualification = Qualification::where('name', $value)->first();
                    JobQualification::create([
                        'job_id' => $job->id,
                        'qualification_id' => $qualification->id,
                    ]);
                }

                // 求人こだわり条件
                JobCommitmentTerm::where('job_id', $job->id)->delete();
                foreach (explode('|', $line[JobCsvColumn::COMMITMENT_TERM->value]) as $value) {
                    $commitment_term = CommitmentTerm::where('name', $value)->first();
                    JobCommitmentTerm::create([
                        'job_id' => $job->id,
                        'commitment_term_id' => $commitment_term->id,
                    ]);
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
    private function validateCsvLine($index, $line, $job, &$office, &$job_category, &$position, &$employment)
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
        // 存在チェック
        $office = Office::where('corporation_id', $line[JobCsvColumn::CORPORATION_ID->value])
            ->where('name', $line[JobCsvColumn::OFFICE_NAME->value])
            ->first();
        if (!$office) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '事業所が存在しません。（法人ID=' . $line[JobCsvColumn::CORPORATION_ID->value] . '、事業所名=' . $line[JobCsvColumn::OFFICE_NAME->value] . '）',
            ];
        }

        // 求人
        // 求人IDとCSVの事業所とのチェック
        if ($job && $office && $job->office_id != $office->id) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '求人が指定した事業所と一致しません。'
            ];
        }

        // PickUp求人
        // true or false チェック
        if (!self::isTrueOrFalse($line[JobCsvColumn::PICKUP->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => 'PickUp求人はtrueまたはfalseで入力してください。',
            ];
        }

        // 非公開求人
        // true or false チェック
        if (!self::isTrueOrFalse($line[JobCsvColumn::PRIVATE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '非公開求人はtrueまたはfalseで入力してください。',
            ];
        }

        // オススメ求人
        // true or false チェック
        if (!self::isTrueOrFalse($line[JobCsvColumn::RECOMMEND->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => 'オススメ求人はtrueまたはfalseで入力してください。',
            ];
        }

        // Indeed非公開
        // true or false チェック
        if (!self::isTrueOrFalse($line[JobCsvColumn::INDEED_PRIVATE->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => 'Indeed非公開はtrueまたはfalseで入力してください。',
            ];
        }

        // 最低賃金を今後チェックしない
        // true or false チェック
        if (!self::isTrueOrFalse($line[JobCsvColumn::MINIMUM_WAGE_OK->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '最低賃金を今後チェックしない、はtrueまたはfalseで入力してください。',
            ];
        }

        // 職種
        // 存在チェック
        $job_category = JobCategory::where('name', $line[JobCsvColumn::JOB_CATEGORY->value])
            ->first();
        if (!$job_category) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '職種が存在しません。（' . $line[JobCsvColumn::JOB_CATEGORY->value] . '）'
            ];
        }

        // 役職/役割
        // 存在チェック
        $position = Position::where('name', $line[JobCsvColumn::POSITION->value])
            ->first();
        if (!$position) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '役職/役割が存在しません。（' . $line[JobCsvColumn::POSITION->value] . '）'
            ];
        }

        // 雇用形態
        // 存在チェック
        $employment = Employment::where('name', $line[JobCsvColumn::EMPLOYMENT->value])
            ->first();
        if (!$employment) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '雇用形態が存在しません。（' . $line[JobCsvColumn::EMPLOYMENT->value] . '）'
            ];
        }

        // 月給下限
        if (!self::isOptionalNumeric($line[JobCsvColumn::M_SALARY_LOWER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '月給下限は数値で入力してください。',
            ];
        }

        // 月給上限
        if (!self::isOptionalNumeric($line[JobCsvColumn::M_SALARY_UPPER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '月給上限は数値で入力してください。',
            ];
        }

        // 時給下限
        if (!self::isOptionalNumeric($line[JobCsvColumn::T_SALARY_LOWER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '時給下限は数値で入力してください。',
            ];
        }

        // 時給上限
        if (!self::isOptionalNumeric($line[JobCsvColumn::T_SALARY_UPPER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '時給上限は数値で入力してください。',
            ];
        }

        // 日給下限
        if (!self::isOptionalNumeric($line[JobCsvColumn::D_SALARY_LOWER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '日給下限は数値で入力してください。',
            ];
        }

        // 日給上限
        if (!self::isOptionalNumeric($line[JobCsvColumn::D_SALARY_UPPER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '日給上限は数値で入力してください。',
            ];
        }

        // 歩合下限
        if (!self::isOptionalNumeric($line[JobCsvColumn::COMMISSION_LOWER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '歩合下限は数値で入力してください。',
            ];
        }

        // 歩合上限
        if (!self::isOptionalNumeric($line[JobCsvColumn::COMMISSION_UPPER->value])) {
            $errors[] = [
                'row' => $index + 1,
                'message' => '歩合上限は数値で入力してください。',
            ];
        }

        // 給与
        // なし

        // 勤務時間
        // なし

        // 仕事内容
        // なし

        // 休日
        // 存在チェック
        $holiday_list = explode('|', $line[JobCsvColumn::HOLIDAY->value]);
        foreach ($holiday_list as $value) {
            $holiday = Holiday::where('name', $value)->first();
            if (!$holiday) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '休日が存在しません。（' . $value . '）'
                ];
            }
        }

        // 休日メモ
        // なし

        // 福利厚生・手当て
        // なし

        // 必須免許
        // 存在チェック
        $qualification_list = explode('|', $line[JobCsvColumn::QUALIFICATION->value]);
        foreach ($qualification_list as $value) {
            $qualification = Qualification::where('name', $value)->first();
            if (!$qualification) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => '資格が存在しません。（' . $value . '）'
                ];
            }
        }

        // 必須免許・資格
        // なし

        // キャッチコピー
        // なし

        // おすすめポイント
        // なし

        // サロンからのメッセージ
        // なし

        // 求人こだわり条件
        // 存在チェック
        $commitment_term_list = explode('|', $line[JobCsvColumn::COMMITMENT_TERM->value]);
        foreach ($commitment_term_list as $value) {
            $commitment_term = CommitmentTerm::where('name', $value)->first();
            if (!$commitment_term) {
                $errors[] = [
                    'row' => $index + 1,
                    'message' => 'こだわり条件が存在しません。（' . $value . '）'
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
     * true or false 判定
     */
    private function isTrueOrFalse($str)
    {
        if (self::isNullOrEmpty($str)) {
            return false;
        }
        if (!preg_match('/^true|false$/', $str)) {
            return false;
        }
        return true;
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
        $error_csv = fopen(storage_path() . '/app/' . config('uploadimage.job_error_storage') . $filename, 'w');
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