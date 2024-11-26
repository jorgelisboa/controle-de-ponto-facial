<?php

namespace App\Services;

use Http;
use Illuminate\Http\Request;

class FacialService
{
    private function sendFacialRequest($url, $file, $fileName)
    {
        return Http::attach(
            'image', // O nome do campo do arquivo no request
            file_get_contents($file), // O conteúdo do arquivo
            $fileName // O nome do arquivo
        )->post($url)->throw();
    }

    public function registerFacial(Request $request)
    {
        try {
            $flaskResponse = $this->sendFacialRequest(
                'http://98.84.198.179:5000/api/face',
                $request->file('profile_photo_path'),
                $request->file('profile_photo_path')->getClientOriginalName()
            );

            return $flaskResponse->json();
        } catch (\Exception $e) {
            \Log::error('Failed to register facial data: ' . $e->getMessage());
            throw new \Exception('Failed to communicate with Flask.');
        }
    }

    public function compareFacial(Request $request)
    {
        try {
            $flaskResponse = $this->sendFacialRequest(
                'http://98.84.198.179:5000/api/compare',
                $request->file('photo'),
                $request->file('photo')->getClientOriginalName()
            );

            return $flaskResponse; // Return the response object
        } catch (\Exception $e) {
            throw new \Exception('Não foi possível comparar a face do usuário.');
        }
    }
}
