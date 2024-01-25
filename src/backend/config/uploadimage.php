<?php

return [
  // 保存先
  'corporation_image_storage' => 'public/uploads/corporation_image/',
  'corporation_feature_storage' => 'public/uploads/corporation_feature/',
  'office_image_storage' => 'public/uploads/office_image/',
  'office_feature_storage' => 'public/uploads/office_feature/',
  'job_image_storage' => 'public/uploads/job_image/',
  'article_image_storage' => 'public/uploads/article/',
  'custom_lp_logo_storage' => 'public/uploads/custom_lp/',
  // 参照パス
  'corporation_image_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/corporation_image/',
  'corporation_feature_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/corporation_feature/',
  'office_image_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/office_image/',
  'office_feature_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/office_feature/',
  'job_image_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/job_image/',
  'article_image_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/article/',
  'custom_lp_logo_path' => env('APP_URL', 'http://localhost:8080') . '/storage/uploads/custom_lp/',
  // ホストなし参照パス
  'corporation_image_relative_path' => '/storage/uploads/corporation_image/',
  'corporation_feature_relative_path' => '/storage/uploads/corporation_feature/',
  'office_image_relative_path' => '/storage/uploads/office_image/',
  'office_feature_relative_path' => '/storage/uploads/office_feature/',
  'job_image_relative_path' => '/storage/uploads/job_image/',
  'article_image_relative_path' => '/storage/uploads/article/',
  'custom_lp_logo_relative_path' => '/storage/uploads/custom_lp/',

  // アップロードCSV
  'office_upload_storage' => 'csv/upload_office/',
  'job_upload_storage' => 'csv/upload_job/',
  'office_error_storage' => 'csv/error_office/',
  'job_error_storage' => 'csv/error_job/',
];