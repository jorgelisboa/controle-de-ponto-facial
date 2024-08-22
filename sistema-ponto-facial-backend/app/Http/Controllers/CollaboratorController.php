<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
class CollaboratorController extends Controller
{
    /**
     * Display a listing of the collaborators.
     */
    public function index()
    {
        return response()->json(['message' => 'success', 'collaborators' => Collaborator::all()], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // ve se colaborador tem todos os campos do request tem no modelo
        try {
            $validatedData = $request->validate([
                'full_name' => 'required',
                'document' => 'required',
                'email' => 'required|email',
                'role' => 'required',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }


        // cria colaborador
        $collaborator = Collaborator::create($validatedData);

        // retorna o colaborador criado e uma mensagem de sucesso
        return response()->json(['message' => 'success', 'collaborator' => $collaborator], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $collaborator = Collaborator::find($id);

        if ($collaborator) {
            return response()->json(['message' => 'success', 'collaborator' => $collaborator], 200);
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
                    'full_name' => 'required',
                    'document' => 'required',
                    'email' => 'required|email',
                    'role' => 'required',
                    'hourly_value' => 'required|numeric',
                    'estimated_journey' => 'required|numeric',
                ]);
            } catch (ValidationException $e) {
                return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
            }

            $collaborator->update($validatedData);

            return response()->json(['message' => 'success', 'collaborator' => $collaborator], 200);
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
