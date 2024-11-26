<?php

namespace App\Services;
use Http;
use Illuminate\Http\Request;

class FacialService
{
    public function registerFacial(Request $request)
    {
        try {
            // Certifique-se de que o arquivo foi enviado
            if (!$request->hasFile('profile_photo_path')) {
                throw new \Exception('Arquivo não enviado ou inválido.');
            }
    
            // Envia a requisição ao Flask
            $flaskResponse = Http::attach(
                'image', // Nome do campo esperado pelo Flask
                file_get_contents($request->file('profile_photo_path')->getRealPath()), // Lê o conteúdo do arquivo
                $request->file('profile_photo_path')->getClientOriginalName() // Nome do arquivo
            )->post('http://98.84.198.179:5000/api/face');
    
            // Retorna a resposta do Flask
            return response()->json($flaskResponse->json(), $flaskResponse->status());
        } catch (\Exception $e) {
            // Retorna um erro genérico
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Função que compara faciais no mesmo ip mas na rota /verificar_usuario
    public function compareFacial(Request $request)
    {
        try {
            $flaskResponse = Http::attach(
                'image', // O nome do campo do arquivo no request
                file_get_contents($request->file('photo')), // O conteúdo do arquivo
                $request->file('photo')->getClientOriginalName() // O nome do arquivo
            )->post('http://98.84.198.179:5000/api/compare')->throw();

            return $flaskResponse->json(); // Retorna a resposta do Flask com um JSON com o campo "user_id"
        } catch (\Exception $e) {
            // Você pode lançar uma exceção personalizada ou simplesmente deixar a exceção passar
            throw new \Exception('Não foi possível comparar a face do usuário.');
        }
    }

}
