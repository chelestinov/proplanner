<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('ai_tools', function (Blueprint $table) {
            // Статус на инструмента: чакащ (по подразбиране), одобрен, отхвърлен
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            // Проследяване: Кой потребител е създал този запис
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down() {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['status', 'user_id']);
        });
    }
};