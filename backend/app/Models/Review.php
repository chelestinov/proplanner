<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'ai_tool_id', 'rating', 'comment'];

    // Връзка към потребителя, написал коментара
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Връзка към инструмента
    public function aiTool()
    {
        return $this->belongsTo(AiTool::class);
    }
}