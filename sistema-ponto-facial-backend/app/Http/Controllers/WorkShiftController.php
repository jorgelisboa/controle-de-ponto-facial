<?php
namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\WorkShift;
use Http;
use \Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

function calcularIntervalosPorMes($dados)
{
    $intervalosPorMes = [];

    // Agrupar os objetos por mês e dia com base no campo created_at
    foreach ($dados as $objeto) {
        $timestamp = $objeto["created_at"];
        $mes = date('Y-m', strtotime($timestamp));
        $data = date('Y-m-d', strtotime($timestamp));

        // Agrupa por mês
        if (!isset($intervalosPorMes[$mes])) {
            $intervalosPorMes[$mes] = [];
        }

        // Agrupa por data dentro do mês
        if (!isset($intervalosPorMes[$mes][$data])) {
            $intervalosPorMes[$mes][$data] = [];
        }

        $intervalosPorMes[$mes][$data][] = $timestamp;
    }

    $resultados = [];

    // Para cada mês, calcular a soma dos intervalos por dia
    foreach ($intervalosPorMes as $mes => $dias) {
        $mesTrabalho = [];
        $totalSegundosMes = 0; // Acumulador para o total de segundos do mês

        foreach ($dias as $dia => $timestampsDoDia) {
            // Ignorar o dia se não tiver um número par de timestamps
            if (count($timestampsDoDia) % 2 != 0) {
                continue;
            }

            $totalSegundos = 0;

            // Ordena os timestamps do dia
            sort($timestampsDoDia);

            // Calcula a diferença entre pares de timestamps
            for ($i = 0; $i < count($timestampsDoDia) - 1; $i += 2) {
                $inicio = strtotime($timestampsDoDia[$i]);
                $fim = strtotime($timestampsDoDia[$i + 1]);

                // Calcula a diferença e adiciona ao total de segundos
                $totalSegundos += ($fim - $inicio);
            }

            // Adiciona ao total do mês
            $totalSegundosMes += $totalSegundos;

            // Converte o total de segundos para horas, minutos e segundos
            $horas = floor($totalSegundos / 3600);
            $minutos = floor(($totalSegundos % 3600) / 60);
            $segundos = $totalSegundos % 60;

            // Adiciona os valores para a data atual
            $mesTrabalho[] = [
                'date' => $dia,
                'worked' => [$horas, $minutos, $segundos],
            ];
        }

        // Converte o total de segundos do mês para horas, minutos e segundos
        $totalHorasMes = floor($totalSegundosMes / 3600);
        $totalMinutosMes = floor(($totalSegundosMes % 3600) / 60);
        $totalSegundosMesFinal = $totalSegundosMes % 60;

        // Só adiciona o mês se houver trabalho calculado
        if (!empty($mesTrabalho)) {
            $resultados[$mes] = [
                'days' => $mesTrabalho,
                'total_worked' => [$totalHorasMes, $totalMinutosMes, $totalSegundosMesFinal],
            ];
        }
    }

    return $resultados;
}

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

                /**
                 * Pega cada item do workshifts e subtrai o tempo um do outro
                 * Exemplo:
                 * [
                 * "2024-09-19T04:02:55.000000Z",
                 * "2024-09-19T04:26:45.000000Z",
                 * ...
                 * ]
                 *
                 * Retornando 23:50
                 */
                $totalTrabalhado = calcularIntervalosPorMes($workShifts);

                return [
                    'message' => 'success',
                    'collaborator' => $collaborator,  // Retorna as informações do colaborador uma vez
                    'worked_time' => $totalTrabalhado
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


    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /**
         * collaborator_document (id do collab)
         * file (is a csv file)
         */
        try {
            $validatedData = $request->validate([
                'collaborator_document' => 'required',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        // compara foto no milvus, se der certo continua, senão, quebra
        // pede pro milvus
        $response = Http::attach(
            'image', // O nome do campo do arquivo no request
            file_get_contents($request->file('image')), // O conteúdo do arquivo
            $request->file('image')->getClientOriginalName() // O nome do arquivo
        )->post('98.84.198.179:5000/verificar_usuario');

        if ($response->successful()) {
            // cria ponto no mysql
            $workShift = WorkShift::create($validatedData);
            // retorna o ponto criado e uma mensagem de sucesso
            return response()->json(['message' => 'success', 'workShift' => $workShift], 201);
        }

        return response()->json([
            'message' => 'error',
            'error' => [
                'message' => 'Não conseguimos encontrar nenhum rosto com uma semelhança o suficiente.',
                'matched_id' => $response
            ]
        ], 201);
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
