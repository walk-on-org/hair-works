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
});
