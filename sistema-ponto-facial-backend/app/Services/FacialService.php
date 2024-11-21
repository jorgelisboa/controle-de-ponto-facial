<?php

namespace App\Services;
use Http;
use Illuminate\Http\Request;

class FacialService
{

    public function registerFacial(Request $request)
    {
        try {
            $flaskResponse = Http::attach(
                'profile_photo_path', // O nome do campo do arquivo no request
                file_get_contents($request->file('profile_photo_path')), // O conteúdo do arquivo
                $request->file('profile_photo_path')->getClientOriginalName() // O nome do arquivo
            )->post('http://98.84.198.179:5000/cadastrar_usuario')->throw();

            return $flaskResponse;
        } catch (\Exception $e) {
            // Você pode lançar uma exceção personalizada ou simplesmente deixar a exceção passar
            throw new \Exception('Não foi possível cadastrar a face do usuário.');
        }
    }

}
