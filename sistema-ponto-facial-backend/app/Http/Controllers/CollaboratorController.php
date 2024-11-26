<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Services\ColabCSVImportService;
use App\Services\FacialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CollaboratorController extends Controller
{
    protected $csvImporter;
    protected $userFacialService;

    public function __construct(ColabCSVImportService $csvImporter, FacialService $userFacialService)
    {
        $this->csvImporter = $csvImporter;
        $this->userFacialService = $userFacialService;
    }

    public function index(): JsonResponse
    {
        $colabs = Collaborator::with('user')->get()->map(function ($collaborator) {
            $collaborator->profile_photo_url = $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null;
            return [
                'document' => $collaborator->document,
                'role' => $collaborator->role,
                'hourly_value' => $collaborator->hourly_value,
                'estimated_journey' => $collaborator->estimated_journey,
                'profile_photo_url' => $collaborator->profile_photo_url,
                'user' => [
                    'name' => $collaborator->user->name,
                    'email' => $collaborator->user->email,
                ],
            ];
        });

        return response()->json(['message' => 'success', 'size' => count($colabs), 'collaborators' => $colabs], 200);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'document' => 'required|min:8|max:32',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
                'profile_photo_path' => 'nullable|image|mimes:jpeg,png,jpg',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        }

        if ($request->hasFile('profile_photo_path') && $request->file('profile_photo_path')->isValid()) {
            $path = $request->file('profile_photo_path')->store('profile_photos', 'public');
            $validatedData['profile_photo_path'] = $path;
        }

        try {
            // Registra a face no Flask e obtém o Milvus ID
            $facialResponse = $this->userFacialService->registerFacial($request);

            // Certifique-se de que o Flask retorna o user_id
            if (!isset($facialResponse['user_id'])) {
                return response()->json([
                    'message' => 'error',
                    'error' => 'Failed to register face. Flask did not return a valid user_id.'
                ], 500);
            }

            $milvusId = $facialResponse['user_id'];
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'error',
                'error' => 'Failed to communicate with Flask: ' . $e->getMessage(),
            ], 500);
        }

        // Cria o colaborador com o Milvus ID
        $collaborator = Collaborator::create(array_merge($validatedData, ['milvus_embedding_id' => $milvusId]));

        return response()->json([
            'message' => 'Collaborator Created Successfully',
            'collaborator' => $collaborator,
            'milvus_id' => $milvusId,
        ], 201);
    }

    public function show(string $id)
    {
        $collaborator = Collaborator::with('user')->find($id);

        if (!$collaborator) {
            return response()->json(['message' => 'error', 'error' => 'Collaborator not found'], 404);
        }

        return response()->json([
            'message' => 'success',
            'collaborator' => $collaborator,
        ], 200);
    }
}
