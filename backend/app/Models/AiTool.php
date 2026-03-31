<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiTool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'url', 'category_id', 'role_id', 
        'documentation_url', 'video_url', 'difficulty_level',
        'how_to_use', 'real_examples', 'image_path',
        'status', 'user_id' // НОВО: Добавени полета за администриране
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function roles()
    {
        return $this->belongsToMany(\Spatie\Permission\Models\Role::class, 'ai_tool_role');
    }

    // НОВО: Връзка към потребителя, който е добавил инструмента (Одит лог)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}