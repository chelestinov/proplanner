<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        // 1. Създаване на таблица за Тагове
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // 2. Свързваща таблица: Инструмент <-> Таг
        Schema::create('ai_tool_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
        });

        // 3. Свързваща таблица: Инструмент <-> Роля (за Multiselect)
        Schema::create('ai_tool_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_tool_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
        });
    }

    public function down() {
        Schema::dropIfExists('ai_tool_role');
        Schema::dropIfExists('ai_tool_tag');
        Schema::dropIfExists('tags');
    }
};