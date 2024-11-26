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
                file_get_contents($request->file('profile_photo_path')), // O conteúdo do arquivo
                $request->file('profile_photo_path')->getClientOriginalName() // O nome do arquivo
            )->post('http://98.84.198.179:5000/cadastrar_usuario')->throw();

            return $flaskResponse->json();
        } catch (\Exception $e) {
            // Você pode lançar uma exceção personalizada ou simplesmente deixar a exceção passar
            throw new \Exception('Não foi possível cadastrar a face do usuário.');
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
