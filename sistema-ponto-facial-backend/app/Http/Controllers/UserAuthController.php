<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Collaborator;
use Hash;
use Illuminate\Http\Request;

class UserAuthController extends Controller
{
    // Cadastro de um novo usuário
    function register(Request $request)
    {
        // Tenta validar, senão, mostra os erros de validação
        try {
            $registerUserData = $request->validate([
                'name'=>'required|string',
                'email'=>'required|string|email|unique:users',
                'password'=>'required|min:8',
                'full_name' => 'required|min:3|max:100',
                'document' => 'required|min:8|max:32',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
        }

        // Cria um novo usuário
        $user = User::create([
            'name' => $registerUserData['name'],
            'email' => $registerUserData['email'],
            'password' => Hash::make($registerUserData['password']),
        ]);

        // Cria um novo colaborador
        Collaborator::create([
            'document' => $request['document'],
            'role' => $request['role'],
            'hourly_value' => $request['hourly_value'],
            'estimated_journey' => $request['estimated_journey'],
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'User and Collaborator Created',
        ]);
    }

    // Login de um usuário
    public function login(Request $request){
        try {
            $loginUserData = $request->validate([
                'email'=>'required|string|email',
                'password'=>'required|string'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
        }

        // Pegando senha e email do usuário
        $user = User::where(
            'email',
            $loginUserData['email'])
        ->first();

        // Se o usuário não existir ou a senha estiver errada
        if(!$user || !Hash::check($loginUserData['password'],$user->password)){
            return response()->json([
                'message' => 'Invalid Credentials'
            ],401);
        }

        $token = $user->createToken($user->name.'-AuthToken')->plainTextToken;
        return response()->json([
            'access_token' => $token,
        ]);
    }

    // Logout de um usuário
    public function logout(){
        auth()->user()->tokens()->delete();

        return response()->json([
          "message"=>"logged out"
        ]);
    }
}
