<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Collaborator extends Model
{
    use HasFactory;
    use HasApiTokens;

    protected $primaryKey = 'document';
    // Fala quais campos podem ser preenchidos
    protected $fillable = [
        'full_name',
        'role',
        'email',
        'document',
        'position',
        'hourly_value',
        'estimated_journey',
        'milvus_embending_id',
        'expo_push_token'
    ];

    protected $casts = [
        'document' => 'string',
        "hourly_value" => 'float',
        "estimated_journey" => 'int'
    ];
}
