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
        'profile_photo_path',
        'user_id',
        'expo_push_token',
        'milvus_embending_id',
        'profile_photo_path'
    ];

    protected $casts = [
        'document' => 'string',
        "hourly_value" => 'float',
        "estimated_journey" => 'int',
        'profile_photo_path' => 'string'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'expo_push_token',
        'milvus_embending_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
