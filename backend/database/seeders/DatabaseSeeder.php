<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\AiTool;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Роли
        $roles = ['owner', 'frontend', 'backend', 'QA', 'PM', 'designer', 'video_editor', 'admin', 'user'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // 2. Категории
        $catText = Category::firstOrCreate(['name' => 'Чатботове и Текст']);
        $catVisual = Category::firstOrCreate(['name' => 'Изображения и Видео']);
        $catCode = Category::firstOrCreate(['name' => 'Програмиране']);

        // 3. Главен Админ
        $admin = User::firstOrCreate(
            ['email' => 'ivan@admin.local'],
            [
                'name' => 'Иван Иванов',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        if (!$admin->hasRole('owner')) $admin->assignRole('owner');

        // 4. Добавяне на примерни AI инструменти
        $tools = [
            [
                'name' => 'v0.dev',
                'description' => 'Генериране на React компоненти с Tailwind CSS чрез AI.',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'frontend')->first()->id
            ],
            [
                'name' => 'Laravel Shift',
                'description' => 'Автоматизирано обновяване на версии на Laravel проекти.',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'backend')->first()->id
            ],
            [
                'name' => 'Midjourney',
                'description' => 'Най-добрият AI за генериране на висококачествени изображения.',
                'category_id' => $catVisual->id,
                'role_id' => Role::where('name', 'designer')->first()->id
            ],
            [
                'name' => 'Testim.io',
                'description' => 'AI платформа за автоматизирано UI тестване.',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'QA')->first()->id
            ],
            [
                'name' => 'Runway Gen-2',
                'description' => 'Генериране и обработка на видео чрез текстови команди.',
                'category_id' => $catVisual->id,
                'role_id' => Role::where('name', 'video_editor')->first()->id
            ],
            [
                'name' => 'Notion AI',
                'description' => 'Автоматизиране на документация и планиране на задачи.',
                'category_id' => $catText->id,
                'role_id' => Role::where('name', 'PM')->first()->id
            ],
        ];

        foreach ($tools as $tool) {
            AiTool::firstOrCreate(
                ['name' => $tool['name']],
                array_merge($tool, [
                    'status' => 'approved',
                    'user_id' => $admin->id
                ])
            );
        }
    }
}