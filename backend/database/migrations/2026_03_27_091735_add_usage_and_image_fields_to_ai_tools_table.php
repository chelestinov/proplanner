<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->text('how_to_use')->nullable(); // Как се използва
            $table->text('real_examples')->nullable(); // Реални примери
            $table->string('image_path')->nullable(); // Път до качената снимка/скрийншот
        });
    }

    public function down() {
        Schema::table('ai_tools', function (Blueprint $table) {
            $table->dropColumn(['how_to_use', 'real_examples', 'image_path']);
        });
    }
};