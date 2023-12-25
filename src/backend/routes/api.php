<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\EmploymentController;
use App\Http\Controllers\PrefectureController;
use App\Http\Controllers\GovernmentCityController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\TrainCompanyController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\StationController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\CommitmentTermController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\LpJobCategoryController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\HtmlAddContentController;
use App\Http\Controllers\NationalHolidayController;
use App\Http\Controllers\AdKeywordController;
use App\Http\Controllers\CustomLpController;
use App\Http\Controllers\CorporationController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\ArticleCategoryController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ConversionHistoryController;

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

Route::middleware(['middleware' => 'api'])->group(function () {
    # 職種
    Route::get('/job_categories', [JobCategoryController::class, 'index']);
    Route::get('/job_categories/{id}', [JobCategoryController::class, 'show']);
    Route::post('/job_categories/create', [JobCategoryController::class, 'create']);
    Route::patch('/job_categories/update/{id}' , [JobCategoryController::class, 'update']);
    Route::post('/job_categories/destroy/{id}' , [JobCategoryController::class, 'destroy']);
    Route::post('/job_categories/destroy_multiple' , [JobCategoryController::class, 'destroyMultiple']);
    # 役職/役割
    Route::get('/positions', [PositionController::class, 'index']);
    Route::get('/positions/{id}', [PositionController::class, 'show']);
    Route::post('/positions/create', [PositionController::class, 'create']);
    Route::patch('/positions/update/{id}' , [PositionController::class, 'update']);
    Route::post('/positions/destroy/{id}', [PositionController::class, 'destroy']);
    Route::post('/positions/destroy_multiple', [PositionController::class, 'destroyMultiple']);
    // 雇用形態
    Route::get('/employments', [EmploymentController::class, 'index']);
    Route::get('/employments/{id}', [EmploymentController::class, 'show']);
    Route::post('/employments/create', [EmploymentController::class, 'create']);
    Route::patch('/employments/update/{id}' , [EmploymentController::class, 'update']);
    Route::post('/employments/destroy/{id}', [EmploymentController::class, 'destroy']);
    Route::post('/employments/destroy_multiple', [EmploymentController::class, 'destroyMultiple']);
    // 都道府県
    Route::get('/prefectures', [PrefectureController::class, 'index']);
    Route::get('/prefectures/{id}', [PrefectureController::class, 'show']);
    Route::post('/prefectures/create', [PrefectureController::class, 'create']);
    Route::patch('/prefectures/update/{id}' , [PrefectureController::class, 'update']);
    Route::post('/prefectures/destroy/{id}', [PrefectureController::class, 'destroy']);
    Route::post('/prefectures/destroy_multiple', [PrefectureController::class, 'destroyMultiple']);
    // 政令指定都市
    Route::get('/government_cities', [GovernmentCityController::class, 'index']);
    Route::get('/government_cities/{id}', [GovernmentCityController::class, 'show']);
    Route::post('/government_cities/create', [GovernmentCityController::class, 'create']);
    Route::patch('/government_cities/update/{id}', [GovernmentCityController::class, 'update']);
    Route::post('/government_cities/destroy/{id}', [GovernmentCityController::class, 'destroy']);
    Route::post('/government_cities/destroy_multiple', [GovernmentCityController::class, 'destroyMultiple']);
    // 市区町村
    Route::get('/cities', [CityController::class, 'index']);
    Route::get('/cities/{id}', [CityController::class, 'show']);
    Route::post('/cities/create', [CityController::class, 'create']);
    Route::patch('/cities/update/{id}', [CityController::class, 'update']);
    Route::post('/cities/destroy/{id}', [CityController::class, 'destroy']);
    Route::post('/cities/destroy_multiple', [CityController::class, 'destroyMultiple']);
    // 鉄道事業者
    Route::get('/train_companies', [TrainCompanyController::class, 'index']);
    Route::get('/train_companies/{id}', [TrainCompanyController::class, 'show']);
    Route::post('/train_companies/create', [TrainCompanyController::class, 'create']);
    Route::patch('/train_companies/update/{id}', [TrainCompanyController::class, 'update']);
    Route::post('/train_companies/destroy/{id}', [TrainCompanyController::class, 'destroy']);
    Route::post('/train_companies/destroy_multiple', [TrainCompanyController::class, 'destroyMultiple']);
    // 路線
    Route::get('/lines', [LineController::class, 'index']);
    Route::get('/lines/{id}', [LineController::class, 'show']);
    Route::post('/lines/create', [LineController::class, 'create']);
    Route::patch('/lines/update/{id}', [LineController::class, 'update']);
    Route::post('/lines/destroy/{id}', [LineController::class, 'destroy']);
    Route::post('/lines/destroy_multiple', [LineController::class, 'destroyMultiple']);
    // 駅
    Route::get('/stations', [StationController::class, 'index']);
    Route::get('/stations/{id}', [StationController::class, 'show']);
    Route::post('/stations/create', [StationController::class, 'create']);
    Route::patch('/stations/update/{id}', [StationController::class, 'update']);
    Route::post('/stations/destroy/{id}', [StationController::class, 'destroy']);
    Route::post('/stations/destroy_multiple', [StationController::class, 'destroyMultiple']);
    // 休日
    Route::get('/holidays', [HolidayController::class, 'index']);
    Route::get('/holidays/{id}', [HolidayController::class, 'show']);
    Route::post('/holidays/create', [HolidayController::class, 'create']);
    Route::patch('/holidays/update/{id}', [HolidayController::class, 'update']);
    Route::post('/holidays/destroy/{id}', [HolidayController::class, 'destroy']);
    Route::post('/holidays/destroy_multiple', [HolidayController::class, 'destroyMultiple']);
    // こだわり条件
    Route::get('/commitment_terms', [CommitmentTermController::class, 'index']);
    Route::get('/commitment_terms/{id}', [CommitmentTermController::class, 'show']);
    Route::post('/commitment_terms/create', [CommitmentTermController::class, 'create']);
    Route::patch('/commitment_terms/update/{id}', [CommitmentTermController::class, 'update']);
    Route::post('/commitment_terms/destroy/{id}', [CommitmentTermController::class, 'destroy']);
    Route::post('/commitment_terms/destroy_multiple', [CommitmentTermController::class, 'destroyMultiple']);
    // 資格
    Route::get('/qualifications', [QualificationController::class, 'index']);
    Route::get('/qualifications/{id}', [QualificationController::class, 'show']);
    Route::post('/qualifications/create', [QualificationController::class, 'create']);
    Route::patch('/qualifications/update/{id}', [QualificationController::class, 'update']);
    Route::post('/qualifications/destroy/{id}', [QualificationController::class, 'destroy']);
    Route::post('/qualifications/destroy_multiple', [QualificationController::class, 'destroyMultiple']);
    // LP職種
    Route::get('/lp_job_categories', [LpJobCategoryController::class, 'index']);
    Route::get('/lp_job_categories/{id}', [LpJobCategoryController::class, 'show']);
    Route::post('/lp_job_categories/create', [LpJobCategoryController::class, 'create']);
    Route::patch('/lp_job_categories/update/{id}', [LpJobCategoryController::class, 'update']);
    Route::post('/lp_job_categories/destroy/{id}', [LpJobCategoryController::class, 'destroy']);
    Route::post('/lp_job_categories/destroy_multiple', [LpJobCategoryController::class, 'destroyMultiple']);
    // プラン
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);
    Route::post('/plans/create', [PlanController::class, 'create']);
    Route::patch('/plans/update/{id}', [PlanController::class, 'update']);
    Route::post('/plans/destroy/{id}', [PlanController::class, 'destroy']);
    Route::post('/plans/destroy_multiple', [PlanController::class, 'destroyMultiple']);
    // HTML追加コンテンツ
    Route::get('/html_add_contents', [HtmlAddContentController::class, 'index']);
    Route::get('/html_add_contents/{id}', [HtmlAddContentController::class, 'show']);
    Route::post('/html_add_contents/create', [HtmlAddContentController::class, 'create']);
    Route::patch('/html_add_contents/update/{id}', [HtmlAddContentController::class, 'update']);
    Route::post('/html_add_contents/destroy/{id}', [HtmlAddContentController::class, 'destroy']);
    Route::post('/html_add_contents/destroy_multiple', [HtmlAddContentController::class, 'destroyMultiple']);
    // 祝日
    Route::get('/national_holidays', [NationalHolidayController::class, 'index']);
    Route::get('/national_holidays/{id}', [NationalHolidayController::class, 'show']);
    Route::post('/national_holidays/create', [NationalHolidayController::class, 'create']);
    Route::patch('/national_holidays/update/{id}', [NationalHolidayController::class, 'update']);
    Route::post('/national_holidays/destroy/{id}', [NationalHolidayController::class, 'destroy']);
    Route::post('/national_holidays/destroy_multiple', [NationalHolidayController::class, 'destroyMultiple']);
    // 広告キーワード
    Route::get('/ad_keywords', [AdKeywordController::class, 'index']);
    Route::get('/ad_keywords/{id}', [AdKeywordController::class, 'show']);
    Route::post('/ad_keywords/create', [AdKeywordController::class, 'create']);
    Route::patch('/ad_keywords/update/{id}', [AdKeywordController::class, 'update']);
    Route::post('/ad_keywords/destroy/{id}', [AdKeywordController::class, 'destroy']);
    Route::post('/ad_keywords/destroy_multiple', [AdKeywordController::class, 'destroyMultiple']);
    // 専用LP設定
    Route::get('/custom_lps', [CustomLpController::class, 'index']);
    Route::get('/custom_lps/{id}', [CustomLpController::class, 'show']);
    Route::post('/custom_lps/create', [CustomLpController::class, 'create']);
    Route::post('/custom_lps/update/{id}', [CustomLpController::class, 'update']);
    Route::post('/custom_lps/destroy/{id}', [CustomLpController::class, 'destroy']);
    Route::post('/custom_lps/destroy_multiple', [CustomLpController::class, 'destroyMultiple']);

    // 法人
    Route::get('/corporations', [CorporationController::class, 'index']);
    Route::get('/corporations/{id}', [CorporationController::class, 'show']);
    Route::post('/corporations/create', [CorporationController::class, 'create']);
    Route::post('/corporations/update/{id}', [CorporationController::class, 'update']);
    Route::post('/corporations/destroy/{id}', [CorporationController::class, 'destroy']);
    Route::post('/corporations/destroy_multiple', [CorporationController::class, 'destroyMultiple']);
    // 事業所
    Route::get('/offices', [OfficeController::class, 'index']);
    Route::get('/offices/{id}', [OfficeController::class, 'show']);
    Route::post('/offices/create', [OfficeController::class, 'create']);
    Route::post('/offices/update/{id}', [OfficeController::class, 'update']);
    Route::post('/offices/destroy/{id}', [OfficeController::class, 'destroy']);
    Route::post('/offices/destroy_multiple', [OfficeController::class, 'destroyMultiple']);
    // 求人
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::post('/jobs/create', [JobController::class, 'create']);
    Route::post('/jobs/update/{id}', [JobController::class, 'update']);
    Route::post('/jobs/destroy/{id}', [JobController::class, 'destroy']);
    Route::post('/jobs/destroy_multiple', [JobController::class, 'destroyMultiple']);
    // 会員情報
    Route::get('/members', [MemberController::class, 'index']);
    Route::get('/members/{id}', [MemberController::class, 'show']);
    Route::post('/members/update/{id}', [MemberController::class, 'update']);
    Route::post('/members/destroy/{id}', [MemberController::class, 'destroy']);
    Route::post('/members/destroy_multiple', [MemberController::class, 'destroyMultiple']);
    // 応募者
    Route::get('/applicants', [ApplicantController::class, 'index']);
    Route::get('/applicants/{id}', [ApplicantController::class, 'show']);
    Route::post('/applicants/update/{id}', [ApplicantController::class, 'update']);
    // 問い合わせ
    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
    Route::post('/inquiries/update/{id}', [InquiryController::class, 'update']);
    Route::post('/inquiries/destroy/{id}', [InquiryController::class, 'destroy']);
    Route::post('/inquiries/destroy_multiple', [InquiryController::class, 'destroyMultiple']);
    // 特集記事カテゴリ
    Route::get('/article_categories', [ArticleCategoryController::class, 'index']);
    Route::get('/article_categories/{id}', [ArticleCategoryController::class, 'show']);
    Route::post('/article_categories/create', [ArticleCategoryController::class, 'create']);
    Route::patch('/article_categories/update/{id}', [ArticleCategoryController::class, 'update']);
    Route::post('/article_categories/destroy/{id}', [ArticleCategoryController::class, 'destroy']);
    Route::post('/article_categories/destroy_multiple', [ArticleCategoryController::class, 'destroyMultiple']);
    // 特集記事
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles/create', [ArticleController::class, 'create']);
    Route::post('/articles/update/{id}', [ArticleController::class, 'update']);
    Route::post('/articles/destroy/{id}', [ArticleController::class, 'destroy']);
    Route::post('/articles/destroy_multiple', [ArticleController::class, 'destroyMultiple']);
    // CV経路
    Route::get('/conversion_histories', [ConversionHistoryController::class, 'index']);
});
