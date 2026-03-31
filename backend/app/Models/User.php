<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Атрибути, които могат да се пълнят масово.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_code',        // За 2FA сигурността
        'two_factor_expires_at',  // За 2FA сигурността
    ];

    /**
     * Атрибути, които се скриват при превръщане в JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code', // Скриваме кода от API заявките за сигурност
    ];

    /**
     * Кастване на атрибутите.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_expires_at' => 'datetime', // Важно за правилната проверка на времето
        ];
    }

    /**
     * ВРЪЗКА СЪС ЗАДАЧИТЕ
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * НОВО: ВРЪЗКА С AI ИНСТРУМЕНТИТЕ (Одит лог)
     * Позволява ни да видим кои инструменти е добавил този потребител.
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class);
    }
}