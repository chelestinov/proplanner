<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Създаваме точно ролите от твоето условие
        $roles = ['owner', 'frontend', 'backend', 'pm', 'qa', 'designer'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Потребител 1: Иван Иванов
        $ivan = User::firstOrCreate(
            ['email' => 'ivan@admin.local'],
            ['name' => 'Иван Иванов', 'password' => Hash::make('password')]
        );
        $ivan->assignRole('owner');

        // Потребител 2: Елена Петрова
        $elena = User::firstOrCreate(
            ['email' => 'elena@frontend.local'],
            ['name' => 'Елена Петрова', 'password' => Hash::make('password')]
        );
        $elena->assignRole('frontend');

        // Потребител 3: Петър Георгиев
        $petar = User::firstOrCreate(
            ['email' => 'petar@backend.local'],
            ['name' => 'Петър Георгиев', 'password' => Hash::make('password')]
        );
        $petar->assignRole('backend');
    }
}