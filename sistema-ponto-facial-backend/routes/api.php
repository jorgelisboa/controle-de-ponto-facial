<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//import Controllers
use App\Http\Controllers\CollaboratorController;

// endpoint para criar um token
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/', function () {
    return response()->json(['message' => 'Sistema de Ponto Facial']);
});

Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);
 
    return ['token' => $token->plainTextToken];
});

Route::get('/health', function () {
    return response()->json(['message' => 'Sistema de Ponto Facial está funcionando']);
});

Route::apiResource('collaborators', CollaboratorController::class);