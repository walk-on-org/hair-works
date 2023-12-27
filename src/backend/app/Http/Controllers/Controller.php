<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * 200 Succes
     */
    protected function responseSuccess($data)
    {
        return response()->json(['status' => 'SUCCESS', 'data' => $data]);
    }

    /**
     * 400 Bad Request
     */
    protected function responseBadRequest()
    {
        return response()->json(['status' => 'FAILED', 'message' => 'Bad Request'], 400);
    }


    /**
     * 401 Unauthorized
     */
    protected function responseUnauthorized()
    {
        return response()->json(['status' => 'FAILED', 'message' => 'Unauthorized'], 401);
    }

    /**
     * 404 Not Found
     */
    protected function responseNotFound()
    {
        return response()->json(['status' => 'FAILED', 'message' => 'Not Found'], 404);
    }
    
    /**
     * 500 Internal Server Error
     */
    protected function responseInternalServerError()
    {
        return response()->json(['status' => 'FAILED', 'message' => 'Internal Server Error'], 500);
    }
}
