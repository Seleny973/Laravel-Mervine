<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get all users
     */
    public function getAll()
    {
        $users = User::select('id', 'username', 'email', 'name', 'created_at')
            ->get();

        return response()->json($users);
    }
}

