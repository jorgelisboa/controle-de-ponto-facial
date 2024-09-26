<?php
namespace App\Services;

use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;
use App\Models\Collaborator;

class ColabCSVImportService
{
    public function import($file)
    {
        $csv = Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0); // Assume que a primeira linha é o cabeçalho

        $records = $csv->getRecords();
        $collaborators = [];
        $errors = [];

        foreach ($records as $index => $record) {
            // Valida cada linha do CSV
            $validator = Validator::make($record, [
                'full_name' => 'required|min:3|max:100',
                'document' => 'required|min:8|max:32',
                'email' => 'required|email|min:10|max:80',
                'role' => 'required|min:2|max:32',
                'hourly_value' => 'required|numeric',
                'estimated_journey' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                $errors[$index] = $validator->errors();
                continue;
            }

            // Verifica se o colaborador já existe pelo 'document'
            $existingCollaborator = Collaborator::where('document', $record['document'])->first();

            if ($existingCollaborator) {
                // Se o colaborador já existe, pula para o próximo
                $errors[$index] = ['document' => ['Collaborator already exists']];
                continue;
            }

            // Cria o colaborador se a validação passar e ele não existir
            $collaborators[] = Collaborator::create($record);
        }

        return ['collaborators' => $collaborators, 'errors' => $errors];
    }
}
