<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 公開サイト用API
Route::middleware(['middleware' => 'api'])->prefix('v1')->group(function () {
    // 職種
    Route::get('/job_categories', [App\Http\Controllers\Main\JobCategoryController::class, 'index']);
    Route::get('/job_categories/getwithjobcount', [App\Http\Controllers\Main\JobCategoryController::class, 'getWithJobCount']);
    Route::get('/job_categories/{id}', [App\Http\Controllers\Main\JobCategoryController::class, 'show']);
    // 役職/役割
    Route::get('/positions', [App\Http\Controllers\Main\PositionController::class, 'index']);
    Route::get('/positions/getwithjobcount', [App\Http\Controllers\Main\PositionController::class, 'getWithJobCount']);
    Route::get('/positions/{id}', [App\Http\Controllers\Main\PositionController::class, 'show']);
    // 雇用形態
    Route::get('/employments', [App\Http\Controllers\Main\EmploymentController::class, 'index']);
    Route::get('/employments/getwithjobcount', [App\Http\Controllers\Main\EmploymentController::class, 'getWithJobCount']);
    Route::get('/employments/{id}', [App\Http\Controllers\Main\EmploymentController::class, 'show']);
    // 雇用形態気になるポイント
    Route::get('/employment_concern_points', [App\Http\Controllers\Main\EmploymentConcernPointController::class, 'index']);
    // 都道府県
    Route::get('/prefectures', [App\Http\Controllers\Main\PrefectureController::class, 'index']);
    Route::get('/prefectures/{id}', [App\Http\Controllers\Main\PrefectureController::class, 'show']);
    // 政令指定都市
    Route::get('/government_cities', [App\Http\Controllers\Main\GovernmentCityController::class, 'index']);
    Route::get('/government_cities/{id}', [App\Http\Controllers\Main\GovernmentCityController::class, 'show']);
    // 市区町村
    Route::get('/cities', [App\Http\Controllers\Main\CityController::class, 'index']);
    Route::get('/cities/getwithjobcount', [App\Http\Controllers\Main\CityController::class, 'getWithJobCount']);
    Route::get('/cities/{id}', [App\Http\Controllers\Main\CityController::class, 'show']);
    // 路線
    Route::get('/lines', [App\Http\Controllers\Main\LineController::class, 'index']);
    Route::get('/lines/{id}', [App\Http\Controllers\Main\LineController::class, 'show']);
    // 駅
    Route::get('/stations', [App\Http\Controllers\Main\StationController::class, 'index']);
    Route::get('/stations/getwithjobcount', [App\Http\Controllers\Main\StationController::class, 'getWithJobCount']);
    Route::get('/stations/{id}', [App\Http\Controllers\Main\StationController::class, 'show']);
    // 休日
    Route::get('/holidays', [App\Http\Controllers\Main\HolidayController::class, 'index']);
    Route::get('/holidays/{id}', [App\Http\Controllers\Main\HolidayController::class, 'show']);
    // こだわり条件
    Route::get('/commitment_terms', [App\Http\Controllers\Main\CommitmentTermController::class, 'index']);
    Route::get('/commitment_terms/{id}', [App\Http\Controllers\Main\CommitmentTermController::class, 'show']);
    // 資格
    Route::get('/qualifications', [App\Http\Controllers\Main\QualificationController::class, 'index']);
    Route::get('/qualifications/{id}', [App\Http\Controllers\Main\QualificationController::class, 'show']);
    // LP職種
    Route::get('/lp_job_categories', [App\Http\Controllers\Main\LpJobCategoryController::class, 'index']);
    Route::get('/lp_job_categories/{id}', [App\Http\Controllers\Main\LpJobCategoryController::class, 'show']);
    // HTML追加コンテンツ
    Route::get('/html_add_contents/getcontent', [App\Http\Controllers\Main\HtmlAddContentController::class, 'getContent']);
    // 専用LP
    Route::get('/custom_lps', [App\Http\Controllers\Main\CustomLpController::class, 'index']);
    // 検索条件
    Route::get('/conditions/all', [App\Http\Controllers\Main\ConditionController::class, 'all']);
    Route::get('/conditions/canonicalize_param', [App\Http\Controllers\Main\ConditionController::class, 'canonicalizeParam']);
    // 特集記事カテゴリ
    Route::get('/article_categories', [App\Http\Controllers\Main\ArticleCategoryController::class, 'index']);
    // 特集記事
    Route::get('/articles', [App\Http\Controllers\Main\ArticleController::class, 'index']);
    Route::get('/articles/new_arrival', [App\Http\Controllers\Main\ArticleController::class, 'getNewArrival']);
    Route::get('/articles/relation', [App\Http\Controllers\Main\ArticleController::class, 'getRelation']);
    Route::get('/articles/archive', [App\Http\Controllers\Main\ArticleController::class, 'getArchive']);
    Route::get('/articles/count', [App\Http\Controllers\Main\ArticleController::class, 'getCount']);
    // 求人
    Route::get('/jobs', [App\Http\Controllers\Main\JobController::class, 'index']);
    Route::get('/jobs/count', [App\Http\Controllers\Main\JobController::class, 'getCount']);
    Route::get('/jobs/allcount', [App\Http\Controllers\Main\JobController::class, 'getAllCount']);
    Route::get('/jobs/pickup', [App\Http\Controllers\Main\JobController::class, 'getPickup']);
    Route::get('/jobs/selection', [App\Http\Controllers\Main\JobController::class, 'getSelection']);
    Route::get('/jobs/relationlink', [App\Http\Controllers\Main\JobController::class, 'getRelationLink']);
    Route::get('/jobs/popularcmtrelationlink', [App\Http\Controllers\Main\JobController::class, 'getPopularCmtRelationLink']);
    Route::get('/jobs/popularrelationlink', [App\Http\Controllers\Main\JobController::class, 'getPopularRelationLink']);
    Route::get('/jobs/recommendjob', [App\Http\Controllers\Main\JobController::class, 'getRecommendJob']);
    Route::get('/jobs/{id}', [App\Http\Controllers\Main\JobController::class, 'show']);
    Route::get('/jobs/{id}/preview', [App\Http\Controllers\Main\JobController::class, 'preview']);
    Route::get('/jobs/{id}/othersameoffice', [App\Http\Controllers\Main\JobController::class, 'getOtherSameOffice']);
    Route::get('/jobs/{id}/alike', [App\Http\Controllers\Main\JobController::class, 'getAlike']);
    // 事業所
    Route::get('/offices/pickup', [App\Http\Controllers\Main\OfficeController::class, 'getPickup']);
    Route::get('/offices/{id}', [App\Http\Controllers\Main\OfficeController::class, 'show']);
    Route::get('/offices/{id}/preview', [App\Http\Controllers\Main\OfficeController::class, 'preview']);
    Route::get('/offices/{id}/relationlink', [App\Http\Controllers\Main\OfficeController::class, 'getRelationlink']);

    // 認証（会員）
    Route::post('/auth/login', [App\Http\Controllers\Main\AuthController::class, 'login']);
    Route::post('/auth/signup', [App\Http\Controllers\Main\AuthController::class, 'signup']);
    Route::post('/auth/edit', [App\Http\Controllers\Main\AuthController::class, 'edit']);
    Route::post('/auth/member', [App\Http\Controllers\Main\AuthController::class, 'member']);
    Route::post('/auth/signupagent', [App\Http\Controllers\Main\AuthController::class, 'signupagent']);

    // 会員連絡可能日時
    // 応募者
    // 応募希望日時
    // 問い合わせ
    // 閲覧履歴
    // お気に入り
    // CV経路

    // アクリートSMS受信
});

// 管理サイト用API
Route::middleware(['middleware' => 'api'])->prefix('admin')->group(function () {
    // 職種
    Route::get('/job_categories', [App\Http\Controllers\Admin\JobCategoryController::class, 'index']);
    Route::get('/job_categories/{id}', [App\Http\Controllers\Admin\JobCategoryController::class, 'show']);
    Route::post('/job_categories/create', [App\Http\Controllers\Admin\JobCategoryController::class, 'create']);
    Route::patch('/job_categories/update/{id}' , [App\Http\Controllers\Admin\JobCategoryController::class, 'update']);
    Route::post('/job_categories/destroy/{id}' , [App\Http\Controllers\Admin\JobCategoryController::class, 'destroy']);
    Route::post('/job_categories/destroy_multiple' , [App\Http\Controllers\Admin\JobCategoryController::class, 'destroyMultiple']);
    // 役職/役割
    Route::get('/positions', [App\Http\Controllers\Admin\PositionController::class, 'index']);
    Route::get('/positions/{id}', [App\Http\Controllers\Admin\PositionController::class, 'show']);
    Route::post('/positions/create', [App\Http\Controllers\Admin\PositionController::class, 'create']);
    Route::patch('/positions/update/{id}' , [App\Http\Controllers\Admin\PositionController::class, 'update']);
    Route::post('/positions/destroy/{id}', [App\Http\Controllers\Admin\PositionController::class, 'destroy']);
    Route::post('/positions/destroy_multiple', [App\Http\Controllers\Admin\PositionController::class, 'destroyMultiple']);
    // 雇用形態
    Route::get('/employments', [App\Http\Controllers\Admin\EmploymentController::class, 'index']);
    Route::get('/employments/{id}', [App\Http\Controllers\Admin\EmploymentController::class, 'show']);
    Route::post('/employments/create', [App\Http\Controllers\Admin\EmploymentController::class, 'create']);
    Route::patch('/employments/update/{id}' , [App\Http\Controllers\Admin\EmploymentController::class, 'update']);
    Route::post('/employments/destroy/{id}', [App\Http\Controllers\Admin\EmploymentController::class, 'destroy']);
    Route::post('/employments/destroy_multiple', [App\Http\Controllers\Admin\EmploymentController::class, 'destroyMultiple']);
    // 都道府県
    Route::get('/prefectures', [App\Http\Controllers\Admin\PrefectureController::class, 'index']);
    Route::get('/prefectures/{id}', [App\Http\Controllers\Admin\PrefectureController::class, 'show']);
    Route::post('/prefectures/create', [App\Http\Controllers\Admin\PrefectureController::class, 'create']);
    Route::patch('/prefectures/update/{id}' , [App\Http\Controllers\Admin\PrefectureController::class, 'update']);
    Route::post('/prefectures/destroy/{id}', [App\Http\Controllers\Admin\PrefectureController::class, 'destroy']);
    Route::post('/prefectures/destroy_multiple', [App\Http\Controllers\Admin\PrefectureController::class, 'destroyMultiple']);
    // 政令指定都市
    Route::get('/government_cities', [App\Http\Controllers\Admin\GovernmentCityController::class, 'index']);
    Route::get('/government_cities/{id}', [App\Http\Controllers\Admin\GovernmentCityController::class, 'show']);
    Route::post('/government_cities/create', [App\Http\Controllers\Admin\GovernmentCityController::class, 'create']);
    Route::patch('/government_cities/update/{id}', [App\Http\Controllers\Admin\GovernmentCityController::class, 'update']);
    Route::post('/government_cities/destroy/{id}', [App\Http\Controllers\Admin\GovernmentCityController::class, 'destroy']);
    Route::post('/government_cities/destroy_multiple', [App\Http\Controllers\Admin\GovernmentCityController::class, 'destroyMultiple']);
    // 市区町村
    Route::get('/cities', [App\Http\Controllers\Admin\CityController::class, 'index']);
    Route::get('/cities/{id}', [App\Http\Controllers\Admin\CityController::class, 'show']);
    Route::post('/cities/create', [App\Http\Controllers\Admin\CityController::class, 'create']);
    Route::patch('/cities/update/{id}', [App\Http\Controllers\Admin\CityController::class, 'update']);
    Route::post('/cities/destroy/{id}', [App\Http\Controllers\Admin\CityController::class, 'destroy']);
    Route::post('/cities/destroy_multiple', [App\Http\Controllers\Admin\CityController::class, 'destroyMultiple']);
    // 鉄道事業者
    Route::get('/train_companies', [App\Http\Controllers\Admin\TrainCompanyController::class, 'index']);
    Route::get('/train_companies/{id}', [App\Http\Controllers\Admin\TrainCompanyController::class, 'show']);
    Route::post('/train_companies/create', [App\Http\Controllers\Admin\TrainCompanyController::class, 'create']);
    Route::patch('/train_companies/update/{id}', [App\Http\Controllers\Admin\TrainCompanyController::class, 'update']);
    Route::post('/train_companies/destroy/{id}', [App\Http\Controllers\Admin\TrainCompanyController::class, 'destroy']);
    Route::post('/train_companies/destroy_multiple', [App\Http\Controllers\Admin\TrainCompanyController::class, 'destroyMultiple']);
    // 路線
    Route::get('/lines', [App\Http\Controllers\Admin\LineController::class, 'index']);
    Route::get('/lines/{id}', [App\Http\Controllers\Admin\LineController::class, 'show']);
    Route::post('/lines/create', [App\Http\Controllers\Admin\LineController::class, 'create']);
    Route::patch('/lines/update/{id}', [App\Http\Controllers\Admin\LineController::class, 'update']);
    Route::post('/lines/destroy/{id}', [App\Http\Controllers\Admin\LineController::class, 'destroy']);
    Route::post('/lines/destroy_multiple', [App\Http\Controllers\Admin\LineController::class, 'destroyMultiple']);
    // 駅
    Route::get('/stations', [App\Http\Controllers\Admin\StationController::class, 'index']);
    Route::get('/stations/{id}', [App\Http\Controllers\Admin\StationController::class, 'show']);
    Route::post('/stations/create', [App\Http\Controllers\Admin\StationController::class, 'create']);
    Route::patch('/stations/update/{id}', [App\Http\Controllers\Admin\StationController::class, 'update']);
    Route::post('/stations/destroy/{id}', [App\Http\Controllers\Admin\StationController::class, 'destroy']);
    Route::post('/stations/destroy_multiple', [App\Http\Controllers\Admin\StationController::class, 'destroyMultiple']);
    // 休日
    Route::get('/holidays', [App\Http\Controllers\Admin\HolidayController::class, 'index']);
    Route::get('/holidays/{id}', [App\Http\Controllers\Admin\HolidayController::class, 'show']);
    Route::post('/holidays/create', [App\Http\Controllers\Admin\HolidayController::class, 'create']);
    Route::patch('/holidays/update/{id}', [App\Http\Controllers\Admin\HolidayController::class, 'update']);
    Route::post('/holidays/destroy/{id}', [App\Http\Controllers\Admin\HolidayController::class, 'destroy']);
    Route::post('/holidays/destroy_multiple', [App\Http\Controllers\Admin\HolidayController::class, 'destroyMultiple']);
    // こだわり条件
    Route::get('/commitment_terms', [App\Http\Controllers\Admin\CommitmentTermController::class, 'index']);
    Route::get('/commitment_terms/{id}', [App\Http\Controllers\Admin\CommitmentTermController::class, 'show']);
    Route::post('/commitment_terms/create', [App\Http\Controllers\Admin\CommitmentTermController::class, 'create']);
    Route::patch('/commitment_terms/update/{id}', [App\Http\Controllers\Admin\CommitmentTermController::class, 'update']);
    Route::post('/commitment_terms/destroy/{id}', [App\Http\Controllers\Admin\CommitmentTermController::class, 'destroy']);
    Route::post('/commitment_terms/destroy_multiple', [App\Http\Controllers\Admin\CommitmentTermController::class, 'destroyMultiple']);
    // 資格
    Route::get('/qualifications', [App\Http\Controllers\Admin\QualificationController::class, 'index']);
    Route::get('/qualifications/{id}', [App\Http\Controllers\Admin\QualificationController::class, 'show']);
    Route::post('/qualifications/create', [App\Http\Controllers\Admin\QualificationController::class, 'create']);
    Route::patch('/qualifications/update/{id}', [App\Http\Controllers\Admin\QualificationController::class, 'update']);
    Route::post('/qualifications/destroy/{id}', [App\Http\Controllers\Admin\QualificationController::class, 'destroy']);
    Route::post('/qualifications/destroy_multiple', [App\Http\Controllers\Admin\QualificationController::class, 'destroyMultiple']);
    // LP職種
    Route::get('/lp_job_categories', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'index']);
    Route::get('/lp_job_categories/{id}', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'show']);
    Route::post('/lp_job_categories/create', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'create']);
    Route::patch('/lp_job_categories/update/{id}', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'update']);
    Route::post('/lp_job_categories/destroy/{id}', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'destroy']);
    Route::post('/lp_job_categories/destroy_multiple', [App\Http\Controllers\Admin\LpJobCategoryController::class, 'destroyMultiple']);
    // プラン
    Route::get('/plans', [App\Http\Controllers\Admin\PlanController::class, 'index']);
    Route::get('/plans/{id}', [App\Http\Controllers\Admin\PlanController::class, 'show']);
    Route::post('/plans/create', [App\Http\Controllers\Admin\PlanController::class, 'create']);
    Route::patch('/plans/update/{id}', [App\Http\Controllers\Admin\PlanController::class, 'update']);
    Route::post('/plans/destroy/{id}', [App\Http\Controllers\Admin\PlanController::class, 'destroy']);
    Route::post('/plans/destroy_multiple', [App\Http\Controllers\Admin\PlanController::class, 'destroyMultiple']);
    // HTML追加コンテンツ
    Route::get('/html_add_contents', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'index']);
    Route::get('/html_add_contents/{id}', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'show']);
    Route::post('/html_add_contents/create', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'create']);
    Route::patch('/html_add_contents/update/{id}', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'update']);
    Route::post('/html_add_contents/destroy/{id}', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'destroy']);
    Route::post('/html_add_contents/destroy_multiple', [App\Http\Controllers\Admin\HtmlAddContentController::class, 'destroyMultiple']);
    // 祝日
    Route::get('/national_holidays', [App\Http\Controllers\Admin\NationalHolidayController::class, 'index']);
    Route::get('/national_holidays/{id}', [App\Http\Controllers\Admin\NationalHolidayController::class, 'show']);
    Route::post('/national_holidays/create', [App\Http\Controllers\Admin\NationalHolidayController::class, 'create']);
    Route::patch('/national_holidays/update/{id}', [App\Http\Controllers\Admin\NationalHolidayController::class, 'update']);
    Route::post('/national_holidays/destroy/{id}', [App\Http\Controllers\Admin\NationalHolidayController::class, 'destroy']);
    Route::post('/national_holidays/destroy_multiple', [App\Http\Controllers\Admin\NationalHolidayController::class, 'destroyMultiple']);
    // 広告キーワード
    Route::get('/ad_keywords', [App\Http\Controllers\Admin\AdKeywordController::class, 'index']);
    Route::get('/ad_keywords/{id}', [App\Http\Controllers\Admin\AdKeywordController::class, 'show']);
    Route::post('/ad_keywords/create', [App\Http\Controllers\Admin\AdKeywordController::class, 'create']);
    Route::patch('/ad_keywords/update/{id}', [App\Http\Controllers\Admin\AdKeywordController::class, 'update']);
    Route::post('/ad_keywords/destroy/{id}', [App\Http\Controllers\Admin\AdKeywordController::class, 'destroy']);
    Route::post('/ad_keywords/destroy_multiple', [App\Http\Controllers\Admin\AdKeywordController::class, 'destroyMultiple']);
    // 専用LP設定
    Route::get('/custom_lps', [App\Http\Controllers\Admin\CustomLpController::class, 'index']);
    Route::get('/custom_lps/{id}', [App\Http\Controllers\Admin\CustomLpController::class, 'show']);
    Route::post('/custom_lps/create', [App\Http\Controllers\Admin\CustomLpController::class, 'create']);
    Route::post('/custom_lps/update/{id}', [App\Http\Controllers\Admin\CustomLpController::class, 'update']);
    Route::post('/custom_lps/destroy/{id}', [App\Http\Controllers\Admin\CustomLpController::class, 'destroy']);
    Route::post('/custom_lps/destroy_multiple', [App\Http\Controllers\Admin\CustomLpController::class, 'destroyMultiple']);
    // 管理者ロール
    Route::get('/admin_roles', [App\Http\Controllers\Admin\AdminRoleController::class, 'index']);
    Route::get('/admin_roles/{id}', [App\Http\Controllers\Admin\AdminRoleController::class, 'show']);
    Route::post('/admin_roles/create', [App\Http\Controllers\Admin\AdminRoleController::class, 'create']);
    Route::patch('/admin_roles/update/{id}', [App\Http\Controllers\Admin\AdminRoleController::class, 'update']);
    Route::post('/admin_roles/destroy/{id}', [App\Http\Controllers\Admin\AdminRoleController::class, 'destroy']);
    Route::post('/admin_roles/destroy_multiple', [App\Http\Controllers\Admin\AdminRoleController::class, 'destroyMultiple']);
    // 管理者ユーザ
    Route::get('/admin_users', [App\Http\Controllers\Admin\AdminUserController::class, 'index']);
    Route::get('/admin_users/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'show']);
    Route::post('/admin_users/create', [App\Http\Controllers\Admin\AdminUserController::class, 'create']);
    Route::patch('/admin_users/update/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'update']);
    Route::post('/admin_users/destroy/{id}', [App\Http\Controllers\Admin\AdminUserController::class, 'destroy']);
    Route::post('/admin_users/destroy_multiple', [App\Http\Controllers\Admin\AdminUserController::class, 'destroyMultiple']);

    // 法人
    Route::get('/corporations', [App\Http\Controllers\Admin\CorporationController::class, 'index']);
    Route::get('/corporations/{id}', [App\Http\Controllers\Admin\CorporationController::class, 'show']);
    Route::post('/corporations/create', [App\Http\Controllers\Admin\CorporationController::class, 'create']);
    Route::post('/corporations/update/{id}', [App\Http\Controllers\Admin\CorporationController::class, 'update']);
    Route::post('/corporations/destroy/{id}', [App\Http\Controllers\Admin\CorporationController::class, 'destroy']);
    Route::post('/corporations/destroy_multiple', [App\Http\Controllers\Admin\CorporationController::class, 'destroyMultiple']);
    Route::get('/corporations/download/csv', [App\Http\Controllers\Admin\CorporationController::class, 'downloadCsv']);
    // 事業所
    Route::get('/offices', [App\Http\Controllers\Admin\OfficeController::class, 'index']);
    Route::get('/offices/{id}', [App\Http\Controllers\Admin\OfficeController::class, 'show']);
    Route::post('/offices/create', [App\Http\Controllers\Admin\OfficeController::class, 'create']);
    Route::post('/offices/update/{id}', [App\Http\Controllers\Admin\OfficeController::class, 'update']);
    Route::post('/offices/destroy/{id}', [App\Http\Controllers\Admin\OfficeController::class, 'destroy']);
    Route::post('/offices/destroy_multiple', [App\Http\Controllers\Admin\OfficeController::class, 'destroyMultiple']);
    Route::get('/offices/download/csv', [App\Http\Controllers\Admin\OfficeController::class, 'downloadCsv']);
    Route::post('/offices/copy_multiple/{id}', [App\Http\Controllers\Admin\OfficeController::class, 'copyMultiple']);
    // 求人
    Route::get('/jobs', [App\Http\Controllers\Admin\JobController::class, 'index']);
    Route::get('/jobs/{id}', [App\Http\Controllers\Admin\JobController::class, 'show']);
    Route::post('/jobs/create', [App\Http\Controllers\Admin\JobController::class, 'create']);
    Route::post('/jobs/update/{id}', [App\Http\Controllers\Admin\JobController::class, 'update']);
    Route::post('/jobs/destroy/{id}', [App\Http\Controllers\Admin\JobController::class, 'destroy']);
    Route::post('/jobs/destroy_multiple', [App\Http\Controllers\Admin\JobController::class, 'destroyMultiple']);
    Route::get('/jobs/download/csv', [App\Http\Controllers\Admin\JobController::class, 'downloadCsv']);
    Route::post('/jobs/approval_request_multiple', [App\Http\Controllers\Admin\JobController::class, 'approvalRequestMultiple']);
    Route::post('/jobs/approved_multiple', [App\Http\Controllers\Admin\JobController::class, 'approvedMultiple']);
    Route::post('/jobs/publish_multiple', [App\Http\Controllers\Admin\JobController::class, 'publishMultiple']);
    Route::post('/jobs/stop_multiple', [App\Http\Controllers\Admin\JobController::class, 'stopMultiple']);
    Route::post('/jobs/copy_multiple/{id}', [App\Http\Controllers\Admin\JobController::class, 'copyMultiple']);
    // 会員情報
    Route::get('/members', [App\Http\Controllers\Admin\MemberController::class, 'index']);
    Route::get('/members/{id}', [App\Http\Controllers\Admin\MemberController::class, 'show']);
    Route::post('/members/update/{id}', [App\Http\Controllers\Admin\MemberController::class, 'update']);
    Route::post('/members/destroy/{id}', [App\Http\Controllers\Admin\MemberController::class, 'destroy']);
    Route::post('/members/destroy_multiple', [App\Http\Controllers\Admin\MemberController::class, 'destroyMultiple']);
    Route::get('/members/download/csv', [App\Http\Controllers\Admin\MemberController::class, 'downloadCsv']);
    // 応募者
    Route::get('/applicants', [App\Http\Controllers\Admin\ApplicantController::class, 'index']);
    Route::get('/applicants/{id}', [App\Http\Controllers\Admin\ApplicantController::class, 'show']);
    Route::post('/applicants/update/{id}', [App\Http\Controllers\Admin\ApplicantController::class, 'update']);
    Route::get('/applicants/download/csv', [App\Http\Controllers\Admin\ApplicantController::class, 'downloadCsv']);
    // 問い合わせ
    Route::get('/inquiries', [App\Http\Controllers\Admin\InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [App\Http\Controllers\Admin\InquiryController::class, 'show']);
    Route::post('/inquiries/update/{id}', [App\Http\Controllers\Admin\InquiryController::class, 'update']);
    Route::post('/inquiries/destroy/{id}', [App\Http\Controllers\Admin\InquiryController::class, 'destroy']);
    Route::post('/inquiries/destroy_multiple', [App\Http\Controllers\Admin\InquiryController::class, 'destroyMultiple']);
    Route::get('/inquiries/download/csv', [App\Http\Controllers\Admin\InquiryController::class, 'downloadCsv']);
    // 特集記事カテゴリ
    Route::get('/article_categories', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'index']);
    Route::get('/article_categories/{id}', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'show']);
    Route::post('/article_categories/create', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'create']);
    Route::patch('/article_categories/update/{id}', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'update']);
    Route::post('/article_categories/destroy/{id}', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'destroy']);
    Route::post('/article_categories/destroy_multiple', [App\Http\Controllers\Admin\ArticleCategoryController::class, 'destroyMultiple']);
    // 特集記事
    Route::get('/articles', [App\Http\Controllers\Admin\ArticleController::class, 'index']);
    Route::get('/articles/{id}', [App\Http\Controllers\Admin\ArticleController::class, 'show']);
    Route::post('/articles/create', [App\Http\Controllers\Admin\ArticleController::class, 'create']);
    Route::post('/articles/update/{id}', [App\Http\Controllers\Admin\ArticleController::class, 'update']);
    Route::post('/articles/destroy/{id}', [App\Http\Controllers\Admin\ArticleController::class, 'destroy']);
    Route::post('/articles/destroy_multiple', [App\Http\Controllers\Admin\ArticleController::class, 'destroyMultiple']);
    // CV経路
    Route::get('/conversion_histories', [App\Http\Controllers\Admin\ConversionHistoryController::class, 'index']);
    Route::get('/conversion_histories/download/csv', [App\Http\Controllers\Admin\ConversionHistoryController::class, 'downloadCsv']);
    // お気に入り
    Route::get('/keeps', [App\Http\Controllers\Admin\KeepController::class, 'index']);
    // 閲覧履歴
    Route::get('/histories', [App\Http\Controllers\Admin\HistoryController::class, 'index']);
    // メルマガ設定
    Route::get('/mailmagazine_configs', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'index']);
    Route::get('/mailmagazine_configs/{id}', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'show']);
    Route::post('/mailmagazine_configs/create', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'create']);
    Route::patch('/mailmagazine_configs/update/{id}', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'update']);
    Route::post('/mailmagazine_configs/destroy/{id}', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'destroy']);
    Route::post('/mailmagazine_configs/destroy_multiple', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'destroyMultiple']);
    Route::get('/mailmagazine_configs/download/send_list/{id}', [App\Http\Controllers\Admin\MailmagazineConfigController::class, 'downloadSendList']);
    // ダッシュボード
    Route::get('/dashboard/job_count', [App\Http\Controllers\Admin\DashboardController::class, 'getJobCount']);
    Route::get('/dashboard/member_count', [App\Http\Controllers\Admin\DashboardController::class, 'getMemberCount']);
    Route::get('/dashboard/applicant_count', [App\Http\Controllers\Admin\DashboardController::class, 'getApplicantCount']);
    Route::get('/dashboard/inquiry_count', [App\Http\Controllers\Admin\DashboardController::class, 'getInquiryCount']);
});
