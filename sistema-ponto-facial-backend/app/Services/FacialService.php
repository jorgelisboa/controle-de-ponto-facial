<?php

namespace App\Services;

use Http;
use Illuminate\Http\Request;

class FacialService
{
    /**
     * Registra a face de um colaborador no serviço Flask.
     */
    public function registerFacial(Request $request)
    {
        try {
            if (!$request->hasFile('profile_photo_path')) {
                throw new \Exception('Image not provided.');
            }

            $flaskResponse = Http::timeout(30)->attach(
                'image',
                file_get_contents($request->file('profile_photo_path')->getRealPath()),
                $request->file('profile_photo_path')->getClientOriginalName()
            )->post('http://98.84.198.179:5000/api/face')->throw();

            return $flaskResponse->json();
        } catch (\Exception $e) {
            throw new \Exception('Failed to communicate with the facial service: ' . $e->getMessage());
        }
    }

    /**
     * Compara a face de um usuário com os dados no serviço Flask.
     */
    public function compareFacial(Request $request)
    {
        try {
            if (!$request->hasFile('photo')) {
                throw new \Exception('Image for comparison not provided.');
            }

            $flaskResponse = Http::timeout(30)->attach(
                'image',
                file_get_contents($request->file('photo')->getRealPath()),
                $request->file('photo')->getClientOriginalName()
            )->post('http://98.84.198.179:5000/api/compare')->throw();

            return $flaskResponse->json(); // Retorna a resposta JSON do Flask com o user_id correspondente
        } catch (\Exception $e) {
            throw new \Exception('Failed to compare face with Flask service: ' . $e->getMessage());
        }
    }
}
