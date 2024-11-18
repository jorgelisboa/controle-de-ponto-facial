<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Services\ColabCSVImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
use App\Models\User;

class CollaboratorController extends Controller
{
    /**
     * Display a listing of the collaborators.
     */
    public function index(): JsonResponse
    {
        $colabs = Collaborator::all();
        return response()->json(['message' => 'success', 'size' => count($colabs), 'collaborators' => $colabs], 200);
    }


    protected $csvImporter;

    public function __construct(ColabCSVImportService $csvImporter)
    {
        $this->csvImporter = $csvImporter;
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

        // ve se colaborador tem todos os campos do request tem no modelo
        try {
            $validatedData = $request->validate([
                'document' => 'required|min:8|max:32',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
                'profile_photo_path' => 'nullable|image|mimes:jpeg,png,jpg',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        $validatedData['user_id'] = auth()->id();

        // Handle profile photo upload
        if ($request->hasFile('collab_photo')) {
            $path = $request->file('collab_photo')->store('profile_photos', 'public');
            $validatedData['profile_photo_path'] = $path;
        }

        // cria colaborador
        $collaborator = Collaborator::create($validatedData);

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
        $collaborator = Collaborator::find($id);

        if ($collaborator) {
            $user = User::find($collaborator->user_id);
            return response()->json([
                'message' => 'success',
                'collaborator' => [
                    'document' => $collaborator->document,
                    'role' => $collaborator->role,
                    'hourly_value' => $collaborator->hourly_value,
                    'estimated_journey' => $collaborator->estimated_journey,
                    'profile_photo_url' => $collaborator->profile_photo_path ? asset('storage/' . $collaborator->profile_photo_path) : null
                ],
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
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
            // ve se colaborador tem todos os campos do request tem no modelo
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
            if ($request->hasFile('collab_photo') && $request->file('collab_photo')->isValid()) {
                $path = $request->file('collab_photo')->store('profile_photos', 'public');
                $validatedData['profile_photo_path'] = $path;
            }

            $collaborator->update($validatedData);

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
    public function destroy(string $id)
    {
        $collaborator = Collaborator::where('document', $id)->first();

        if ($collaborator) {
            // Delete where document field is equal to $id
            $collaborator->delete();
            return response()->json(['message' => 'success', 'collaborator' => $collaborator], 200);
        }

        return response()->json(['message' => 'error', 'error' => 'Colaborador não encontrado'], 404);
    }
}
