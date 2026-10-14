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
        Schema::table('user_tones', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
            $table->boolean('is_system')->default(false)->after('description');
            $table->index('is_system');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_tones', function (Blueprint $table) {
            $table->dropIndex(['is_system']);
            $table->dropColumn('is_system');
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
