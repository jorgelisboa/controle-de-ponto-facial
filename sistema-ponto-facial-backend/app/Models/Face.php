<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Face extends Model
{
    use HasFactory;

    protected $fillable = ['collaborator_id', 'face_url', 'vector'];

    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
    }
}
