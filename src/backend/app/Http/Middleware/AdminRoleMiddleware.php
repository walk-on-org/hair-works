<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin_user = auth()->user();
        if ($admin_user->adminRole->name == 'super_admin' || $admin_user->adminRole->name == 'admin') {
            // 管理者アカウントの場合のみ
            return $next($request);
        } else {
            return response()->json(['status' => 'FAILED', 'message' => 'Unauthorized'], 401);
        }
    }
}
