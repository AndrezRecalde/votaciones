<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()->hasRole($role)) {
            abort(403, "Access to this resource on the server is denied");
            //return response()->json(["message"=> "Access to this resource on the server is denied"], Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }
}
