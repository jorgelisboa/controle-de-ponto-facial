<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = [
       'id',
       'created_by',
        'assigned_to',
        'record_type'
    ];

}
