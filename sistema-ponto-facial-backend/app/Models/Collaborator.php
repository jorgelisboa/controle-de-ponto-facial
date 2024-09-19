<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    use HasFactory;

    protected $primaryKey = 'document';
    // Fala quais campos podem ser preenchidos
    protected $fillable = [
        'full_name',
        'role',
        'email',
        'document',
        'position',
        'hourly_value',
        'estimated_journey'
    ];

    protected $casts = [
        'document' => 'string',
        "hourly_value" => 'float',
        "estimated_journey" => 'int'
    ];
}
