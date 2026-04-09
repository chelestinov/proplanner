<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\AiTool;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

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

        // 4. Инструменти (С точните имена: url и image_path)
        $tools = [
            [
                'name' => 'v0.dev',
                'description' => 'Генериране на React компоненти с Tailwind CSS чрез AI.',
                'url' => 'https://v0.dev',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'frontend')->first()->id,
                'image_path' => 'https://picsum.photos/seed/v0dev/600/400'
            ],
            [
                'name' => 'Laravel Shift',
                'description' => 'Автоматизирано обновяване на версии на Laravel проекти.',
                'url' => 'https://laravelshift.com',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'backend')->first()->id,
                'image_path' => 'https://picsum.photos/seed/laravel/600/400'
            ],
            [
                'name' => 'Midjourney',
                'description' => 'Най-добрият AI за генериране на висококачествени изображения.',
                'url' => 'https://midjourney.com',
                'category_id' => $catVisual->id,
                'role_id' => Role::where('name', 'designer')->first()->id,
                'image_path' => 'https://picsum.photos/seed/midjourney/600/400'
            ],
            [
                'name' => 'Testim.io',
                'description' => 'AI платформа за автоматизирано UI тестване.',
                'url' => 'https://testim.io',
                'category_id' => $catCode->id,
                'role_id' => Role::where('name', 'QA')->first()->id,
                'image_path' => 'https://picsum.photos/seed/qa/600/400'
            ],
            [
                'name' => 'Runway Gen-2',
                'description' => 'Генериране и обработка на видео чрез текстови команди.',
                'url' => 'https://runwayml.com',
                'category_id' => $catVisual->id,
                'role_id' => Role::where('name', 'video_editor')->first()->id,
                'image_path' => 'https://picsum.photos/seed/runway/600/400'
            ],
            [
                'name' => 'Notion AI',
                'description' => 'Автоматизиране на документация и планиране на задачи.',
                'url' => 'https://notion.so',
                'category_id' => $catText->id,
                'role_id' => Role::where('name', 'PM')->first()->id,
                'image_path' => 'https://picsum.photos/seed/notion/600/400'
            ],
        ];

        foreach ($tools as $toolData) {
            $tool = AiTool::firstOrCreate(
                ['name' => $toolData['name']],
                array_merge($toolData, [
                    'status' => 'approved',
                    'user_id' => $admin->id
                ])
            );

            // 5. Добавяне на 5-звездни ревюта
            DB::table('reviews')->insertOrIgnore([
                'ai_tool_id' => $tool->id,
                'user_id' => $admin->id,
                'rating' => 5,
                'comment' => 'Страхотен инструмент! Използвам го всеки ден и върши чудеса.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}