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
        // Verificar que el usuario esté autenticado
        if (!$request->user()) {
            return response()->json([
                "message" => "No autenticado"
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar que tenga el rol adecuado
        if (!$request->user()->hasRole($role)) {
            return response()->json([
                "message" => "Access to this resource on the server is denied"
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
