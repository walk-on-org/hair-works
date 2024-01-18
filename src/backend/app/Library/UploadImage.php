<?php

namespace App\Library;

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Storage;

class UploadImage extends Facade
{
    /**
     * 画像ファイルをアップロード
     * 
     * @param file $upload_file     アップロードするファイル
     * @param string $storage_path  アップロード先Storageのパス
     * @param string $key           アップロード先Storageパスの先のディレクトリ名
     * @param string $old_file_name 以前のアップロードファイル名
     */
    public static function uploadImageFile($upload_file, $storage_path, $key, $old_file_name = null)
    {
        // アップロードするファイルは "タイムスタンプ_元ファイル名" とする
        $upload_file_name = time() . '_' . $upload_file->getClientOriginalName();
        
        // Storageに保存する
        $upload_file->storeAs($storage_path . $key, $upload_file_name);

        // 以前のファイルがある場合は削除
        if ($old_file_name != null) {
            Storage::delete($storage_path . $key . '/' . $old_file_name);
        }

        return $upload_file_name;
    }

    /**
     * アップロードした画像ファイルを削除
     * 
     * @param string $delete_file_name  削除するファイル名
     * @param string $storage_path      アップロード先Storageのパス
     * @param string $key               アップロード先Storageパスの先のディレクトリ名
     */
    public static function deleteImageFile($delete_file_name, $storage_path, $key)
    {
        Storage::delete($storage_path . $key . '/' . $delete_file_name);
    }

    /**
     * 画像ファイルをコピー
     * 
     * @param string $storage_path      アップロード先Storageのパス
     * @param string $origin_key        コピー元のディレクトリ名
     * @param string $dest_key          コピー先のディレクトリ名
     */
    public static function copyImageDir($storage_path, $origin_key, $dest_key)
    {
        // コピー先に元々入っているファイルを削除
        Storage::delete($storage_path . $dest_key);
        // コピー元のディレクトに入っているファイルを全取得
        $origin_files = Storage::files($storage_path . $origin_key);
        foreach ($origin_files as $file) {
            // コピー
            Storage::copy($file, $storage_path . $dest_key . '/' . basename($file));
        }
    }
}