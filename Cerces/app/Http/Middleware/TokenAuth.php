<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class TokenAuth
{
    public function handle(Request $request, Closure $next, $role = null)
    {
        $header = $request->header('Authorization');
        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $token = substr($header, 7);
        $user = User::where('api_token', $token)->first();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($role && $user->role !== $role) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // attache l'utilisateur à la requête
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}

