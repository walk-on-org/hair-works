<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MultipleProcessManagement;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;

class MultipleProcessManagementController extends Controller
{
    /**
     * プロセス状態のチェック
     */
    public function checkProcess($id)
    {
        try {
            $management = MultipleProcessManagement::find($id);
            if (!$management) {
                throw new ModelNotFoundException();
            }

            return response()->json([
                'status' => $management->status,
                'total_count' => $management->total_count,
                'processed_count' => $management->processed_count,
                'error_count' => $management->error_count,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'process management not found'], 404);
        }
    }

    /**
     * エラーファイルをダウンロード
     */
    public function downloadError($id)
    {
        try {
            $management = MultipleProcessManagement::find($id);
            if (!$management) {
                throw new ModelNotFoundException();
            }

            $file_path = Storage::path(config('uploadimage.office_error_storage') . $management->error_file);
            \Log::debug($file_path);
            // レスポンスヘッダー情報
            $response_header = [
                'Content-type' => 'text/csv',
                'Access-Control-Expose-Headers' => 'Content-Disposition'
            ];

            return response()->download($file_path, $management->error_file, $response_header);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'process management not found'], 404);
        }
    }
}