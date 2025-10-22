<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TodoController extends Controller
{
    //
    public function index(Request $request)
    {
        return response()->json(['message' =>$request->teste]);
    }

    public function jsp(Request $request)
    {
        return response()->json(['message' =>$request]);
    }
}
