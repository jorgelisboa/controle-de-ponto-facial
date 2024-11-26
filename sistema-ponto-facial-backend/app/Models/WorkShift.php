<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'collaborator_document',
        'coordinates',
        'registered_at',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'registered_at' => 'datetime',
        'collaborator_document' => 'string',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // HasMany Relationship
    public function collaborators(): BelongsTo
    {
        return $this->belongsTo(Collaborator::class, 'collaborator_document', 'document');
    }
}
