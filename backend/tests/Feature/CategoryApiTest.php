<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Category;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase; // Това гарантира, че базата се изчиства след теста

    public function test_can_fetch_categories()
    {
        // 1. Подготовка: Създаваме 2 тестови категории в паметта
        Category::create(['name' => 'Чатботове']);
        Category::create(['name' => 'Изображения']);

        // 2. Действие: Правим GET заявка към API-то
        $response = $this->getJson('/api/categories');

        // 3. Проверка: Очакваме статус 200 (Успех) и да видим данните
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data') // Очакваме 2 записа в масива 'data'
                 ->assertJsonFragment(['name' => 'Чатботове']);
    }
}