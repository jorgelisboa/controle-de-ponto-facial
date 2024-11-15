<!DOCTYPE html>
<html>
<head>
    <title>Relatório de Turnos de Trabalho</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 1px solid #ddd;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        h1, h2, h3 {
            margin-bottom: 10px;
            color: #000;
        }
        p {
            margin: 5px 0;
            color: #000;
        }
    </style>
</head>
<body>
    <h1>Relatório de Turnos de Trabalho para {{ $collaborator->full_name }}</h1>
    <p><strong>Documento:</strong> {{ $collaborator->document }}</p>
    <p><strong>Email:</strong> {{ $collaborator->email }}</p>
    <p><strong>Função:</strong> {{ $collaborator->role }}</p>
    <p><strong>Posição:</strong> {{ $collaborator->position }}</p>
    <p><strong>Período:</strong> {{ \Carbon\Carbon::parse($start_date)->format('d/m/Y') }} a {{ \Carbon\Carbon::parse($end_date)->format('d/m/Y') }}</p>

    @foreach ($worked_time as $month => $data)
        <h2>Mês: {{ \Carbon\Carbon::parse($month)->locale('pt_BR')->translatedFormat('F Y') }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Entrada</th>
                    <th>Saída para o Almoço</th>
                    <th>Volta do Almoço</th>
                    <th>Saída</th>
                    <th>Tempo Total Trabalhado</th>
                    <th>Intervalo de Descanso</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data['days'] as $day)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($day['date'])->format('d/m/Y') }}</td>
                        @foreach ($day['workshifts'] as $workshift)
                            <td>{{ \Carbon\Carbon::parse($workshift)->format('H:i:s') }}</td>
                        @endforeach
                        @for ($i = count($day['workshifts']); $i < 4; $i++)
                            <td></td>
                        @endfor
                        <td>{{ implode(':', $day['worked_time']) }}</td>
                        @if (count($day['workshifts']) == 2 && ($day['worked_time'][0] > 2 || ($day['worked_time'][0] == 2 && $day['worked_time'][1] > 0)))
                            <td>01:00:00</td>
                        @else
                            <td>{{ implode(':', $day['intervalo']) }}</td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
        </table>

        <h3>Resumo para {{ \Carbon\Carbon::parse($month)->locale('pt_BR')->translatedFormat('F Y') }}</h3>
        <div style="margin-bottom: 20px;">
            <p><strong>Tempo Esperado de Trabalho:</strong> {{ $expected_hours }} horas</p>
            <p><strong>Tempo Total Trabalhado:</strong> {{ implode(':', $data['total_worked']) }}</p>
            <p><strong>Pagamento Total:</strong> R$ {{ number_format(($data['total_worked'][0] + $data['total_worked'][1] / 60) * $hourly_rate, 2, ',', '.') }}</p>
        </div>
        <div style="page-break-after: always;"></div>
    @endforeach

    <p>Taxa Horária: R$ {{ number_format($hourly_rate, 2, ',', '.') }}</p>
    <p>Pagamento Total para o Período: R$ {{ number_format($total_payment, 2, ',', '.') }}</p>
</body>
</html>
