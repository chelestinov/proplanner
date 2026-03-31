<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    // Списък с полетата, които Laravel има право да попълва
    protected $fillable = [
        'name',
        'serial_number',
        'sequence',
        'user_id'
    ];
}