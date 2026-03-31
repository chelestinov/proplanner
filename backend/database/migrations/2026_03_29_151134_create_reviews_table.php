<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Кой пише коментара
            $table->foreignId('ai_tool_id')->constrained()->onDelete('cascade'); // За кой инструмент
            $table->tinyInteger('rating')->unsigned(); // Рейтинг от 1 до 5 звезди
            $table->text('comment')->nullable(); // Самият коментар (може и да е празен, ако дава само звезди)
            $table->timestamps();

            // Един потребител може да даде само едно ревю за даден инструмент
            $table->unique(['user_id', 'ai_tool_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
