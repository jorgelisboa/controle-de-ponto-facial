<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\WorkShift;
use \Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Response;

class WorkShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    if ($request->has('collaborator_document')) {
        // Buscar o colaborador pelo documento
        $collaborator = Collaborator::where('document', $request->collaborator_document)->first();

        // Se o colaborador existir, buscar os work shifts associados
        if ($collaborator) {
            $workShifts = WorkShift::where('collaborator_document', $request->collaborator_document)->get();

            return [
                'message' => 'success',
                'collaborator' => $collaborator,  // Retorna as informações do colaborador uma vez
                'workShifts' => $workShifts        // Apenas os turnos de trabalho
            ];
        }

        // Caso o colaborador não seja encontrado
        return [
            'message' => 'error',
            'error' => 'Collaborator not found'
        ];
    }

    // Caso não seja fornecido um documento, retornar todos os work shifts com todos os colaboradores
    // TODO: Paginação de resultados
    return [
        'message' => 'success',
        'workShifts' => WorkShift::all()
    ];
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Cria um "ponto" do usuário

        try {
            $validatedData = $request->validate([
                'collaborator_document' => 'required',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        // se tiver todos os campos, cria o ponto do colaborador
        // cria ponto
        $workShift = WorkShift::create($validatedData);

        // retorna o ponto criado e uma mensagem de sucesso
        return response()->json(['message' => 'success', 'workShift' => $workShift], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
