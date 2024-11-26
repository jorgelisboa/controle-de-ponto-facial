<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Services\ColabCSVImportService;
use App\Services\FacialService;
use Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
use App\Models\User;

class CollaboratorController extends Controller
{
    protected $csvImporter;
    protected $userFacialService;

    public function __construct(ColabCSVImportService $csvImporter, FacialService $userFacialService)
    {
        $this->csvImporter = $csvImporter;
        $this->userFacialService = $userFacialService;
    }

    /**
     * Display a listing of the collaborators.
     */
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
                    'email' => $collaborator->user->email
                ]
            ];
        });

        return response()->json(['message' => 'success', 'size' => count($colabs), 'collaborators' => $colabs], 200);
    }

    public function store(Request $request)
    {
        // Verifica se o request é um arquivo CSV
        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            // Utiliza o serviço para processar o arquivo CSV
            $result = $this->csvImporter->import($request->file('file'));

            if (!empty($result['errors'])) {
                return response()->json(['message' => 'error', 'errors' => $result['errors']], 400);
            }

            return response()->json(['message' => 'success', 'collaborators' => $result['collaborators']], 201);
        }

        // Verifica se colaborador tem todos os campos do request no modelo
        try {
            $validatedData = $request->validate([
                'document' => 'required|min:8|max:32',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
                'profile_photo_path' => 'image|mimes:jpeg,png,jpg',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        $validatedData['user_id'] = auth()->id();

        // Handle profile photo upload
        if ($request->hasFile('profile_photo_path') && $request->file('profile_photo_path')->isValid()) {
            $path = $request->file('profile_photo_path')->store('profile_photos', 'public');
            $validatedData['profile_photo_path'] = $path;
        }

        $facialResponse = $this->userFacialService->registerFacial($request);
        $milvusId = $facialResponse['user_id'];

        $collaborator = Collaborator::create([
            'document' => $validatedData['document'],
            'role' => $validatedData['role'],
            'hourly_value' => $validatedData['hourly_value'],
            'estimated_journey' => $validatedData['estimated_journey'],
            'profile_photo_path' => $validatedData['profile_photo_path'],
            'user_id' => $validatedData['user_id'],
            'milvus_embedding_id' => $milvusId
        ]);

        // retorna o colaborador criado e uma mensagem de sucesso
        return response()->json([
            'message' => 'success',
            'collaborator' => $collaborator,
            'profile_photo_url' => $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $collaborator = Collaborator::with('user')->find($id);

        if ($collaborator) {
            return response()->json([
                'message' => 'success',
                'collaborator' => [
                    'document' => $collaborator->document,
                    'role' => $collaborator->role,
                    'hourly_value' => $collaborator->hourly_value,
                    'estimated_journey' => $collaborator->estimated_journey,
                    'profile_photo_url' => $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null,
                    'user' => [
                        'name' => $collaborator->user->name,
                        'email' => $collaborator->user->email
                    ]
                ]
            ], 200);
        }

        return response()->json(['message' => 'error', 'error' => 'Colaborador não encontrado'], 404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $collaborator = Collaborator::where('document', $id)->first();

        if ($collaborator) {
            // Valida apenas os campos que estão no request
            try {
                $validatedData = $request->validate([
                    'document' => 'required',
                    'role' => 'required',
                    'hourly_value' => 'required|numeric',
                    'estimated_journey' => 'required|numeric',
                    'profile_photo_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                ]);
            } catch (ValidationException $e) {
                return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
            }

            $validatedData['user_id'] = auth()->id();

            // Handle profile photo upload
            if ($request->hasFile('profile_photo_path') && $request->file('profile_photo_path')->isValid()) {
                $path = $request->file('profile_photo_path')->store('profile_photos', 'public');
                $validatedData['profile_photo_path'] = $path;
            }

            $collaborator->update($validatedData);

            // registra a face do colaborador
            $facialResponse = $this->userFacialService->registerFacial($request);
            $collaborator->milvus_embedding_id = $facialResponse['user_id'];
            $collaborator->save();

            return response()->json([
                'message' => 'success',
                'collaborator' => $collaborator,
                'profile_photo_url' => $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null
            ], 200);
        }

        return response()->json(['message' => 'error', 'error' => 'Colaborador não encontrado'], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id = null)
    {
        // Verifica se há uma lista de IDs no corpo da requisição
        $ids = $request->input('documents', $id ? [$id] : []);

        if (!empty($ids)) {
            // Encontra os colaboradores cujos documentos correspondem aos IDs fornecidos
            $collaborators = Collaborator::whereIn('document', $ids)->get();

            if ($collaborators->isNotEmpty()) {
                // Deleta os colaboradores encontrados
                Collaborator::whereIn('document', $ids)->delete();

                return response()->json(['message' => 'success', 'deleted_count' => $collaborators->count()], 200);
            }

            return response()->json(['message' => 'error', 'error' => 'Nenhum colaborador encontrado'], 404);
        }

        return response()->json(['message' => 'error', 'error' => 'Nenhum documento fornecido'], 400);
    }
}
