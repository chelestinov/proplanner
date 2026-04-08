<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Почистване на кеша за правата (важно за Spatie)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Създаване на всички нужни роли
        $roles = [
            'owner', 'frontend', 'backend', 'QA', 'PM', 'designer', 'video_editor', 'admin', 'user'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // 3. Създаване на основните категории
        $categories = [
            'Чатботове и Текст',
            'Изображения и Видео',
            'Програмиране'
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }

        // 4. Създаване на главния Admin (Owner) акаунт
        $admin = User::firstOrCreate(
            ['email' => 'ivan@admin.local'],
            [
                'name' => 'Иван Иванов',
                'password' => Hash::make('password'),
                // Слагаме email_verified_at, за да не иска допълнително потвърждение при първи вход
                'email_verified_at' => now(), 
            ]
        );

        // Прикачване на ролята 'owner' към Иван
        if (!$admin->hasRole('owner')) {
            $admin->assignRole('owner');
        }
    }
}