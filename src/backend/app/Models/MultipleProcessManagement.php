<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultipleProcessManagement extends Model
{
    use HasFactory;

    protected $table = 'multiple_process_managements';
    protected $fillable = [
        'process_type',
        'upload_file',
        'error_file',
        'status',
        'total_count',
        'processed_count',
        'error_count',
    ];

    const PROCESS_TYPE = [
        1 => '事業所アップロード',
        2 => '求人アップロード',
    ];

    const STATUS = [
        0 => '未実行',
        1 => '実行中',
        2 => '実行済',
    ];
}
