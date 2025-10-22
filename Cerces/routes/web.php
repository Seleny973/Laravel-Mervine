<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

Route::post("/",[TodoController::class,"jsp"]);

Route::get("/{teste}",[TodoController::class,"index"]);



