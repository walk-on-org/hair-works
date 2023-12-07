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
    # 役職/役割
    Route::get('/positions', [PositionController::class, 'index']);
    Route::get('/positions/{id}', [PositionController::class, 'show']);
    Route::post('/positions/create', [PositionController::class, 'create']);
    Route::patch('/positions/update/{id}' , [PositionController::class, 'update']);
    // 雇用形態
    Route::get('/employments', [EmploymentController::class, 'index']);
    Route::get('/employments/{id}', [EmploymentController::class, 'show']);
    Route::post('/employments/create', [EmploymentController::class, 'create']);
    Route::patch('/employments/update/{id}' , [EmploymentController::class, 'update']);
    // 都道府県
    Route::get('/prefectures', [PrefectureController::class, 'index']);
    Route::get('/prefectures/{id}', [PrefectureController::class, 'show']);
    Route::post('/prefectures/create', [PrefectureController::class, 'create']);
    Route::patch('/prefectures/update/{id}' , [PrefectureController::class, 'update']);
    // 政令指定都市
    Route::get('/government_cities', [GovernmentCityController::class, 'index']);
    Route::get('/government_cities/{id}', [GovernmentCityController::class, 'show']);
    Route::post('/government_cities/create', [GovernmentCityController::class, 'create']);
    Route::patch('/government_cities/update/{id}', [GovernmentCityController::class, 'update']);
    // 市区町村
    Route::get('/cities', [CityController::class, 'index']);
    Route::get('/cities/{id}', [CityController::class, 'show']);
    Route::post('/cities/create', [CityController::class, 'create']);
    Route::patch('/cities/update/{id}', [CityController::class, 'update']);
    // 鉄道事業者
    Route::get('/train_companies', [TrainCompanyController::class, 'index']);
    Route::get('/train_companies/{id}', [TrainCompanyController::class, 'show']);
    Route::post('/train_companies/create', [TrainCompanyController::class, 'create']);
    Route::patch('/train_companies/update/{id}', [TrainCompanyController::class, 'update']);
    // 路線
    Route::get('/lines', [LineController::class, 'index']);
    Route::get('/lines/{id}', [LineController::class, 'show']);
    Route::post('/lines/create', [LineController::class, 'create']);
    Route::patch('/lines/update/{id}', [LineController::class, 'update']);
    // 駅
    Route::get('/stations', [StationController::class, 'index']);
    Route::get('/stations/{id}', [StationController::class, 'show']);
    Route::post('/stations/create', [StationController::class, 'create']);
    Route::patch('/stations/update/{id}', [StationController::class, 'update']);
    // 休日
    Route::get('/holidays', [HolidayController::class, 'index']);
    Route::get('/holidays/{id}', [HolidayController::class, 'show']);
    Route::post('/holidays/create', [HolidayController::class, 'create']);
    Route::patch('/holidays/update/{id}', [HolidayController::class, 'update']);
    // こだわり条件
    Route::get('/commitment_terms', [CommitmentTermController::class, 'index']);
    Route::get('/commitment_terms/{id}', [CommitmentTermController::class, 'show']);
    Route::post('/commitment_terms/create', [CommitmentTermController::class, 'create']);
    Route::patch('/commitment_terms/update/{id}', [CommitmentTermController::class, 'update']);
    // 資格
    Route::get('/qualifications', [QualificationController::class, 'index']);
    Route::get('/qualifications/{id}', [QualificationController::class, 'show']);
    Route::post('/qualifications/create', [QualificationController::class, 'create']);
    Route::patch('/qualifications/update/{id}', [QualificationController::class, 'update']);
    // LP職種
    Route::get('/lp_job_categories', [LpJobCategoryController::class, 'index']);
    Route::get('/lp_job_categories/{id}', [LpJobCategoryController::class, 'show']);
    Route::post('/lp_job_categories/create', [LpJobCategoryController::class, 'create']);
    Route::patch('/lp_job_categories/update/{id}', [LpJobCategoryController::class, 'update']);
    // プラン
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);
    Route::post('/plans/create', [PlanController::class, 'create']);
    Route::patch('/plans/update/{id}', [PlanController::class, 'update']);
    // HTML追加コンテンツ
    Route::get('/html_add_contents', [HtmlAddContentController::class, 'index']);
    Route::get('/html_add_contents/{id}', [HtmlAddContentController::class, 'show']);
    Route::post('/html_add_contents/create', [HtmlAddContentController::class, 'create']);
    Route::patch('/html_add_contents/update/{id}', [HtmlAddContentController::class, 'update']);
    // 祝日
    Route::get('/national_holidays', [NationalHolidayController::class, 'index']);
    Route::get('/national_holidays/{id}', [NationalHolidayController::class, 'show']);
    Route::post('/national_holidays/create', [NationalHolidayController::class, 'create']);
    Route::patch('/national_holidays/update/{id}', [NationalHolidayController::class, 'update']);
    // 広告キーワード
    Route::get('/ad_keywords', [AdKeywordController::class, 'index']);
    Route::get('/ad_keywords/{id}', [AdKeywordController::class, 'show']);
    Route::post('/ad_keywords/create', [AdKeywordController::class, 'create']);
    Route::patch('/ad_keywords/update/{id}', [AdKeywordController::class, 'update']);
    // 専用LP設定
    Route::get('/custom_lps', [CustomLpController::class, 'index']);
    Route::get('/custom_lps/{id}', [CustomLpController::class, 'show']);
    Route::post('/custom_lps/create', [CustomLpController::class, 'create']);
    Route::patch('/custom_lps/update/{id}', [CustomLpController::class, 'update']);
});
