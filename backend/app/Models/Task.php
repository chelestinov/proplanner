<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Разрешаваме на Laravel да записва тези полета наведнъж
    protected $fillable = ['title', 'role', 'status'];
}