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
        // 1. Drop billing tables
        Schema::dropIfExists('credit_transactions');
        Schema::dropIfExists('stripe_payments');

        // 2. Update users table with API keys and provider preferences
        Schema::table('users', function (Blueprint $table) {
            $table->text('gemini_api_key')->nullable()->after('remember_token');
            $table->text('openai_api_key')->nullable()->after('gemini_api_key');
            $table->text('openrouter_api_key')->nullable()->after('openai_api_key');
            $table->string('ai_provider', 30)->default('gemini')->after('openrouter_api_key');
            $table->string('ai_model', 100)->nullable()->after('ai_provider');

            // Drop credit and subscription columns if they exist
            $columnsToDrop = array_filter([
                Schema::hasColumn('users', 'credit_balance') ? 'credit_balance' : null,
                Schema::hasColumn('users', 'subscription_tier') ? 'subscription_tier' : null,
                Schema::hasColumn('users', 'subscription_status') ? 'subscription_status' : null,
                Schema::hasColumn('users', 'subscription_renews_at') ? 'subscription_renews_at' : null,
                Schema::hasColumn('users', 'stripe_customer_id') ? 'stripe_customer_id' : null,
                Schema::hasColumn('users', 'stripe_subscription_id') ? 'stripe_subscription_id' : null,
            ]);

            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        // 3. Update generations table to store provider & model, and drop credits_used
        Schema::table('generations', function (Blueprint $table) {
            $table->string('ai_provider', 30)->nullable()->after('output_language');
            $table->string('ai_model', 100)->nullable()->after('ai_provider');

            if (Schema::hasColumn('generations', 'credits_used')) {
                $table->dropColumn('credits_used');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('generations', function (Blueprint $table) {
            $table->dropColumn(['ai_provider', 'ai_model']);
            $table->unsignedTinyInteger('credits_used')->default(1);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['gemini_api_key', 'openai_api_key', 'openrouter_api_key', 'ai_provider', 'ai_model']);
            $table->unsignedInteger('credit_balance')->default(0);
        });
    }
};
