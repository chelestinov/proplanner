<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiTool;
use App\Models\Category;

class AiToolSeeder extends Seeder
{
    public function run(): void
    {
        $cat1 = Category::firstOrCreate(['name' => 'Text Generation']);
        $cat2 = Category::firstOrCreate(['name' => 'Image Generation']);

        AiTool::create([
            'name' => 'ChatGPT',
            'description' => 'Най-популярният езиков модел за текстове и код.',
            'url' => 'https://chatgpt.com',
            'category_id' => $cat1->id
        ]);

        AiTool::create([
            'name' => 'Midjourney',
            'description' => 'Професионален инструмент за генериране на изображения.',
            'url' => 'https://midjourney.com',
            'category_id' => $cat2->id
        ]);
    }
}
