<?php

namespace App\Http\Controllers;

use App\Models\Face;
use Illuminate\Http\Request;

class FaceController extends Controller
{
    // Método para salvar a face de um colaborador
    public function store(Request $request)
    {
        // Validação dos dados
        $request->validate([
            'collaborator_document' => 'required|exists:collaborators,document',
            'face_url' => 'required',
            'vector' => 'required'
        ]);

        // Criação da face
        $face = Face::create($request->all());

        return response()->json($face, 201);
    }
}
