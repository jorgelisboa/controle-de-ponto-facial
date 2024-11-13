<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\WorkShift;
use \Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

function calcularHorasMensaisRobusta($dados)
{
    $horasPorMes = [];

    foreach ($dados as $objeto) {
        if (empty($objeto["created_at"]) || !strtotime($objeto["created_at"])) {
            error_log("Erro: Registro de ponto inválido ou ausente em um dos objetos.");
            continue;
        }

        $timestamp = strtotime($objeto["created_at"]);
        $mes = date('Y-m', $timestamp);
        $data = date('Y-m-d', $timestamp);

        if (!isset($horasPorMes[$mes])) {
            $horasPorMes[$mes] = [];
        }
        if (!isset($horasPorMes[$mes][$data])) {
            $horasPorMes[$mes][$data] = [];
        }

        $horasPorMes[$mes][$data][] = $timestamp;
    }

    $resultado = [];
    $diasComPontosFaltantes = [];

    foreach ($horasPorMes as $mes => $dias) {
        $totalSegundosMes = 0;

        foreach ($dias as $dia => $timestamps) {
            $timestamps = array_unique($timestamps); // Remove duplicados
            sort($timestamps);

            if (count($timestamps) % 2 != 0) {
                $diasComPontosFaltantes[] = "$dia no mês $mes";
                array_pop($timestamps);
            }

            $totalSegundosDia = 0;
            for ($i = 0; $i < count($timestamps); $i += 2) {
                $entrada = $timestamps[$i];
                $saida = $timestamps[$i + 1];

                if ($saida <= $entrada) {
                    error_log("Erro: Saída anterior ou igual à entrada em $dia no mês $mes.");
                    continue;
                }

                $horaEntrada = (int) date('H', $entrada);
                $horaSaida = (int) date('H', $saida);

                if ($horaEntrada < 6 || $horaSaida > 22) {
                    error_log("Aviso: Registro fora do horário permitido em $dia no mês $mes.");
                }

                $totalSegundosDia += ($saida - $entrada);
            }

            if ($totalSegundosDia > 16 * 3600) {
                error_log("Aviso: Tempo excessivo de trabalho em $dia no mês $mes.");
                continue;
            }

            $totalSegundosMes += $totalSegundosDia;
        }

        $horas = floor($totalSegundosMes / 3600);
        $minutos = floor(($totalSegundosMes % 3600) / 60);
        $segundos = $totalSegundosMes % 60;

        $resultado[$mes] = [
            'total_worked' => [$horas, $minutos, $segundos],
            'total_seconds' => $totalSegundosMes
        ];
    }

    if (!empty($diasComPontosFaltantes)) {
        error_log("Dias com registros de ponto faltantes: " . implode(', ', $diasComPontosFaltantes));
    }

    return $resultado;
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
        // Cria um "ponto" do usuário

        try {
            $validatedData = $request->validate([
                'collaborator_document' => 'required',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'error', 'error' => $e->errors()], 400);
        }

        // se tiver todos os campos, cria o ponto do colaborador
        // cria ponto
        $workShift = WorkShift::create($validatedData);

        // retorna o ponto criado e uma mensagem de sucesso
        return response()->json(['message' => 'success', 'workShift' => $workShift], 201);

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
