<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Services\ColabCSVImportService;
use App\Services\FacialService;
use Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \Illuminate\Validation\ValidationException;
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
        $colabs = Collaborator::all();
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

        // Cadastra a facial do usuário na API Flask usando o Service
        try {
            $response = $this->userFacialService->registerFacial($request);
        } catch (\Exception $e) {
            // Tratamento para timeout ou qualquer outro erro do Flask
            return response()->json(['message' => 'timeout', 'error' => 'Não foi possível conectar com o serviço de cadastro de facial. Por favor, tente novamente mais tarde.'], 504);
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
            // Valida apenas os campos que estão no request
            try {
                $validatedData = $request->validate([
                    'full_name' => 'sometimes|required',
                    'document' => 'sometimes|required',
                    'email' => 'sometimes|required|email',
                    'role' => 'sometimes|required',
                    'hourly_value' => 'sometimes|required|numeric',
                    'estimated_journey' => 'sometimes|required|numeric',
                ]);
            } catch (ValidationException $e) {
                return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
            }

            // Atualiza apenas os campos que foram enviados no request
            $collaborator->update($request->only(array_keys($validatedData)));

            return response()->json(['message' => 'success', 'collaborator' => $collaborator], 200);
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
