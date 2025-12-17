<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private function makeToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * Register new user (signup)
     */
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users,username|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $token = $this->makeToken();

        $user = User::create([
            'username' => $request->username,
            'name' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'api_token' => $token,
        ]);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user (role user)
     */
    public function login(Request $request)
    {
        return $this->doLogin($request, 'user');
    }

    /**
     * Login admin (role admin)
     */
    public function loginAdmin(Request $request)
    {
        return $this->doLogin($request, 'admin');
    }

    private function doLogin(Request $request, ?string $role = null)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        if ($role && $user->role !== $role) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $token = $this->makeToken();
        $user->update(['api_token' => $token]);

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    /**
     * Logout (invalidate token)
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->update(['api_token' => null]);
        }
        return response()->json(['message' => 'Logged out']);
    }
}


