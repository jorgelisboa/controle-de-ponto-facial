<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Collaborator;
use Hash;
use Illuminate\Http\Request;
use App\Services\FacialService;

class UserAuthController extends Controller
{
    protected $facialService;

    public function __construct(FacialService $facialService)
    {
        $this->facialService = $facialService;
    }

    // Cadastro de um novo usuário
    function register(Request $request)
    {
        try {
            $registerUserData = $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|min:8',
                'document' => 'required|min:8|max:32',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required',
                'estimated_journey' => 'required',
                'profile_photo_path' => 'nullable|image|mimes:jpeg,png,jpg',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
        }

        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo_path') && $request->file('profile_photo_path')->isValid()) {
            $profilePhotoPath = $request->file('profile_photo_path')->store('profile_photos', 'public');
        }

        $user = User::create([
            'name' => $registerUserData['name'],
            'email' => $registerUserData['email'],
            'password' => Hash::make($registerUserData['password']),
        ]);

        // Send profile photo to facial recognition service
        if ($profilePhotoPath) {
            $request->merge(['profile_photo_path' => $profilePhotoPath]);
            $facialResponse = $this->facialService->registerFacial($request);
            $milvusId = $facialResponse['user_id'];
        }

        // Cria um novo colaborador
        Collaborator::create([
            'document' => $request['document'],
            'role' => $request['role'],
            'profile_photo_path' => $profilePhotoPath,
            'hourly_value' => $request['hourly_value'],
            'estimated_journey' => $request['estimated_journey'],
            'user_id' => $user->id,
            'milvus_embedding_id' => $milvusId ?? null
        ]);

        return response()->json([
            'message' => 'User and Collaborator Created',
            'profile_photo_url' => $profilePhotoPath ? asset('storage/' . $profilePhotoPath) : null,
        ]);
    }

    public function login(Request $request)
    {
        try {
            $loginUserData = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors(),
            ], 422);
        }

        $user = User::where('email', $loginUserData['email'])->first();

        if (!$user || !Hash::check($loginUserData['password'], $user->password)) {
            return response()->json(['message' => 'Invalid Credentials'], 401);
        }

        $collaborator = Collaborator::where('user_id', $user->id)->first();
        $token = $user->createToken($user->name . '-AuthToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'collaborator' => [
                'document' => $collaborator->document,
                'role' => $collaborator->role,
                'hourly_value' => $collaborator->hourly_value,
                'estimated_journey' => $collaborator->estimated_journey,
                'profile_photo_url' => $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null,
            ],
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
