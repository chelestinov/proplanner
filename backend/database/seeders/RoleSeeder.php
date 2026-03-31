<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Създаване на ролите
        $roles = ['owner', 'frontend', 'backend', 'pm', 'qa', 'designer'];
        foreach ($roles as $name) {
            Role::firstOrCreate(['name' => $name]);
        }

        // Потребителите от заданието
        $users = [
            ['name' => 'Иван Иванов', 'email' => 'ivan@admin.local', 'role' => 'owner'],
            ['name' => 'Елена Петрова', 'email' => 'elena@frontend.local', 'role' => 'frontend'],
            ['name' => 'Петър Георгиев', 'email' => 'petar@backend.local', 'role' => 'backend'],
        ];

        foreach ($users as $u) {
            $user = User::updateOrCreate(
                ['email' => $u['email']],
                ['name' => $u['name'], 'password' => Hash::make('password')]
            );
            $user->syncRoles([$u['role']]);
        }
    }
}