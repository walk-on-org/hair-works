<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Qualification;

class QualificationController extends Controller
{
    /**
     * 保有資格マスタ全件取得
     */
    public function index()
    {
        $qualifications = Qualification::where('status', 1)
            ->orderBy('sort')
            ->select(
                'id',
                'name',
            )
            ->get();
        return self::responseSuccess(['qualifications' => $qualifications]);
    }

    /**
     * 保有資格マスタ1件取得
     */
    public function show($id)
    {
        $qualification = Qualification::where('status', 1)
            ->where('id', $id)
            ->select(
                'id',
                'name',
            )
            ->first();
        return self::responseSuccess(['qualification' => $qualification]);
    }
}