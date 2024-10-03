<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Services\ColabCSVImportService;
use Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
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

        // Verifica se colaborador tem todos os campos do request no modelo
        try {
            $validatedData = $request->validate([
                'full_name' => 'required|min:3|max:100',
                'document' => 'required|min:8|max:32',
                'email' => 'required|email|min:10|max:80',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        // Cadastra a facial do usuário na api do flask
        $response = Http::attach(
            'image', // O nome do campo do arquivo no request
            file_get_contents($request->file('image')), // O conteúdo do arquivo
            $request->file('image')->getClientOriginalName() // O nome do arquivo
        )->post('98.84.198.179:5000/cadastrar_usuario')->throw(); // throw() ensures synchronous behavior

        if (!$response->successful()) {
            return response()->json(['message' => 'error', 'error' => 'Não foi possível cadastrar a face do usuário'], 400);
        }

        // Adiciona o campo milvus_embending_id ao validatedData
        $validatedData['milvus_embending_id'] = $response->json()['user_id'];

        // Cria colaborador
        $collaborator = Collaborator::create($validatedData);

        // Retorna o colaborador criado e uma mensagem de sucesso
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
