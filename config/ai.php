<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supported AI Providers & Models
    |--------------------------------------------------------------------------
    |
    | Defines available providers, recommended models, and official API key
    | documentation links for Bring-Your-Own-Key (BYOK) architecture.
    |
    */
    'providers' => [
        'gemini' => [
            'name' => 'Google Gemini',
            'description' => 'Ultra-fast, high token throughput, ideal for high-converting marketing copy and long-form content.',
            'default_model' => 'gemini-3.8-flash',
            'models' => [
                'gemini-3.8-flash' => 'Gemini 3.8 Flash (Latest Flagship Speed & Highest Quality)',
                'gemini-3.5-flash-lite' => 'Gemini 3.5 Flash-Lite (Ultra Fast & Lightweight)',
                'gemini-3.5-flash' => 'Gemini 3.5 Flash (Advanced Multi-turn Content Generation)',
                'gemini-3.1-pro-preview' => 'Gemini 3.1 Pro Preview (Strategic Reasoning & Deep Copy)',
                'gemini-3-pro' => 'Gemini 3 Pro (Creative Storytelling & Logic)',
                'gemini-3-flash' => 'Gemini 3 Flash (High Throughput Production)',
                'gemini-2.5-pro' => 'Gemini 2.5 Pro (Deep Analysis & Structured Copy)',
                'gemini-2.5-flash' => 'Gemini 2.5 Flash (Fast & Reliable Copywriter)',
            ],
            'key_help_url' => 'https://aistudio.google.com/app/apikey',
            'key_placeholder' => 'AIzaSy...',
        ],
        'openai' => [
            'name' => 'OpenAI',
            'description' => 'State-of-the-art GPT models offering nuanced tone matching and persuasive storytelling.',
            'default_model' => 'gpt-4.5',
            'models' => [
                'gpt-5' => 'GPT-5 (Next-Gen Intelligence & Nuance)',
                'gpt-4.5' => 'GPT-4.5 (High Creative & Expressive Writing - Recommended)',
                'o3' => 'o3 (Deep Analytical Reasoning)',
                'o3-mini' => 'o3-mini (High Speed & Deep Logic)',
                'gpt-4o' => 'GPT-4o (Omni Multimodal Flagship)',
                'gpt-4o-mini' => 'GPT-4o Mini (Cost-efficient & Fast)',
                'o1' => 'o1 (Full Problem Solving Reasoning)',
                'o1-mini' => 'o1-mini (Fast Reasoning Engine)',
            ],
            'key_help_url' => 'https://platform.openai.com/api-keys',
            'key_placeholder' => 'sk-proj-...',
        ],
        'openrouter' => [
            'name' => 'OpenRouter',
            'description' => 'Unified API gateway giving you access to Claude 3.7, DeepSeek R1, Llama 4, and 100+ models.',
            'default_model' => 'google/gemini-3.8-flash',
            'models' => [
                'google/gemini-3.8-flash' => 'Gemini 3.8 Flash (via OpenRouter)',
                'google/gemini-3.5-flash-lite' => 'Gemini 3.5 Flash-Lite (via OpenRouter)',
                'google/gemini-2.5-flash' => 'Gemini 2.5 Flash (via OpenRouter)',
                'anthropic/claude-3.7-sonnet' => 'Claude 3.7 Sonnet (Hybrid Reasoning & Elite Copy)',
                'anthropic/claude-3.5-sonnet' => 'Claude 3.5 Sonnet (Nuanced Persuasive Writing)',
                'deepseek/deepseek-r1' => 'DeepSeek R1 (Deep Chain-of-Thought)',
                'deepseek/deepseek-chat' => 'DeepSeek V3 (Next-Gen MoE Architecture)',
                'meta-llama/llama-4-scout' => 'Llama 4 Scout (Next-Gen Open Weights)',
                'meta-llama/llama-3.3-70b-instruct' => 'Llama 3.3 70B Instruct',
            ],
            'key_help_url' => 'https://openrouter.ai/keys',
            'key_placeholder' => 'sk-or-v1-...',
        ],
    ],
];
