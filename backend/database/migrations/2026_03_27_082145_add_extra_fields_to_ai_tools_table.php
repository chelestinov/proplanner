<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->string('documentation_url')->nullable(); // Линк към документация
            $table->string('video_url')->nullable(); // Видео ресурс
            $table->enum('difficulty_level', ['Beginner', 'Intermediate', 'Advanced'])->nullable(); // Ниво на трудност
        });
    }

    public function down() {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropColumn(['documentation_url', 'video_url', 'difficulty_level']);
        });
    }
};