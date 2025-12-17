<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;

// Routes d'authentification
Route::post('/auth/login', [AuthController::class, 'login']);

// Routes pour les utilisateurs
Route::get('/users', [UserController::class, 'getAll']);

// Routes pour les produits
Route::get('/products', [ProductController::class, 'getProducts']);
Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);

// Route pour l'inscription (signin)
Route::post('/users', [AuthController::class, 'signin']);

