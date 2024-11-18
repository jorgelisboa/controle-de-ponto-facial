<?php

use App\Http\Controllers\WorkShiftController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;

//import Controllers
use App\Http\Controllers\CollaboratorController;

Route::get('/health', function () {
    return response()->json(['message' => 'Sistema de Ponto Facial está funcionando']);
});

// User Authentication
// Endpoint, Arquivo que vou chamar, Método que vou chamar
Route::post('register',[UserAuthController::class,'register']);
Route::post('login',[UserAuthController::class,'login']);
Route::post('logout',[UserAuthController::class,'logout'])
  ->middleware('auth:sanctum');


// Collaborator and WorkShift
Route::apiResource('collaborators', CollaboratorController::class);
Route::apiResource('shifts', WorkShiftController::class);
