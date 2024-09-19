<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'collaborator_document'
    ];

    // HasMany Relationship
    public function collaborators(): BelongsTo
    {
        return $this->belongsTo(Collaborator::class, 'collaborator_document', 'document');
    }
}
