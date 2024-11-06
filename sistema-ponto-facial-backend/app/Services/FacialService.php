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
                'image', // O nome do campo do arquivo no request
                file_get_contents($request->file('image')), // O conteúdo do arquivo
                $request->file('image')->getClientOriginalName() // O nome do arquivo
            )->post('http://98.84.198.179:5000/api/face')->throw();

            return $flaskResponse;
        } catch (\Exception $e) {
            // Você pode lançar uma exceção personalizada ou simplesmente deixar a exceção passar
            throw new \Exception('Não foi possível cadastrar a face do usuário.');
        }
    }

}
