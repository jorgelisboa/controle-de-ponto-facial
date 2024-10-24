<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Work Shifts PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total {
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Relatório de Turnos de Trabalho</h1>
        <h2>{{ $collaborator->full_name }}</h2>
        <p>Documento: {{ $collaborator->document }}</p>
        <p>Email: {{ $collaborator->email }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Entrada 1</th>
                <th>Saída 1</th>
                <th>Entrada 2</th>
                <th>Saída 2</th>
                <th>Total de Horas</th>
            </tr>
        </thead>
        <tbody>
            @php
                // Agrupando os turnos por data
                $shiftsByDate = [];
                foreach ($workShifts as $shift) {
                    $date = \Carbon\Carbon::parse($shift->registered_at)->format('Y-m-d');
                    $createdAt = \Carbon\Carbon::parse($shift->created_at)->format('H:i:s');
                    $updatedAt = \Carbon\Carbon::parse($shift->updated_at)->format('H:i:s');
                    $shiftsByDate[$date][] = ['entrada' => $createdAt, 'saida' => $updatedAt];
                }
            @endphp

            @foreach ($shiftsByDate as $date => $shifts)
                <tr>
                    <td>{{ $date }}</td>
                    <td>{{ $shifts[0]['entrada'] ?? '-' }}</td>
                    <td>{{ $shifts[0]['saida'] ?? '-' }}</td>
                    <td>{{ $shifts[1]['entrada'] ?? '-' }}</td>
                    <td>{{ $shifts[1]['saida'] ?? '-' }}</td>

                    @php
                        // Calculando total de horas usando o workedTime
                        $totalHours = '-'; // Valor padrão
                        foreach ($workedTime as $month => $days) {
                            foreach ($days['days'] as $day) {
                                if ($day['date'] === $date) {
                                    $totalHours = $day['worked'][0] . 'h ' . $day['worked'][1] . 'm ' . $day['worked'][2] . 's';
                                }
                            }
                        }
                    @endphp

                    <td class="total">{{ $totalHours }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
