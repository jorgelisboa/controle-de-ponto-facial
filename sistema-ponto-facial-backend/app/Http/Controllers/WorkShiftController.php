<?php
namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\WorkShift;
use Http;
use \Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

function calcularIntervalosPorMes($dados)
{
    // Estrutura de dados para armazenar os intervalos por mês
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

        // Ordena as datas em ordem crescente
        ksort($dias);

        foreach ($dias as $dia => $timestampsDoDia) {
            // Ignorar o dia se não tiver um número par de timestamps
            if (count($timestampsDoDia) % 2 != 0) {
                continue;
            }

            $totalSegundos = 0;
            $intervaloSegundos = 0;

            // Ordena os timestamps do dia
            sort($timestampsDoDia);

            // Calcula a diferença entre pares de timestamps
            for ($i = 0; $i < count($timestampsDoDia) - 1; $i += 2) {
                $inicio = strtotime($timestampsDoDia[$i]);
                $fim = strtotime($timestampsDoDia[$i + 1]);

                // Calcula a diferença e adiciona ao total de segundos
                $totalSegundos += ($fim - $inicio);
            }

            // Calcula o intervalo de almoço se houver exatamente 4 timestamps
            if (count($timestampsDoDia) == 4) {
                $intervaloSegundos = strtotime($timestampsDoDia[2]) - strtotime($timestampsDoDia[1]);
            }

            // Adiciona ao total do mês
            $totalSegundosMes += $totalSegundos;

            // Converte o total de segundos para horas, minutos e segundos
            $horas = floor($totalSegundos / 3600);
            $minutos = floor(($totalSegundos % 3600) / 60);
            $segundos = $totalSegundos % 60;

            // Converte o intervalo de almoço para horas, minutos e segundos
            $intervaloHoras = floor($intervaloSegundos / 3600);
            $intervaloMinutos = floor(($intervaloSegundos % 3600) / 60);
            $intervaloSegundosFinal = $intervaloSegundos % 60;

            // Adiciona os valores para a data atual
            $mesTrabalho[] = [
                'workshifts' => $timestampsDoDia,
                'date' => $dia,
                'worked_time' => [$horas, $minutos, $segundos],
                'intervalo' => [$intervaloHoras, $intervaloMinutos, $intervaloSegundosFinal],
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
                $query = WorkShift::where('collaborator_document', $request->collaborator_document);

                if ($request->has('start') && $request->has('end')) {
                    $start = date('Y-m-d', strtotime($request->start));
                    $end = date('Y-m-d', strtotime($request->end));
                    $query->whereBetween('created_at', [$start, $end]);
                }

                $workShifts = $query->get();
                $totalTrabalhado = calcularIntervalosPorMes($workShifts);

                if ($request->has('pdf') && $request->pdf == 'true') {
                    return $this->generatePdf($collaborator, $totalTrabalhado);
                }

                return [
                    'message' => 'success',
                    'collaborator' => $collaborator,
                    'worked_time' => $totalTrabalhado
                ];
            }

            return [
                'message' => 'error',
                'error' => 'Collaborator not found'
            ];
        }

        return [
            'message' => 'success',
            'workShifts' => WorkShift::all()
        ];
    }

    private function generatePdf($collaborator, $totalTrabalhado)
    {
        $start_date = request()->start;
        $end_date = request()->end;
        $hourly_rate = $collaborator->hourly_value;
        $expected_hours = $collaborator->estimated_journey;
        $total_payment = 0;

        foreach ($totalTrabalhado as $month => $data) {
            $total_hours = $data['total_worked'][0] + ($data['total_worked'][1] / 60);
            $total_payment += $total_hours * $hourly_rate;
        }

        $pdf = PDF::loadView('workshift', [
            'collaborator' => $collaborator,
            'worked_time' => $totalTrabalhado,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'expected_hours' => $expected_hours,
            'hourly_rate' => $hourly_rate,
            'total_payment' => $total_payment
        ]);

        return $pdf->download('workshift.pdf');
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

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        // Deleta um ponto do usuário
        $workShift = WorkShift::find($id);

        if ($workShift) {
            $workShift->delete();
            return response()->json(['message' => 'success', 'workShift' => $workShift], 200);
        }

        return response()->json(['message' => 'error', 'error' => 'WorkShift not found'], 404);
    }
}
