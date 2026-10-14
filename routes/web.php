<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenerationController;
use App\Http\Controllers\GenerationStreamController;
use App\Http\Controllers\ToneController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Generations
    Route::get('generate', [GenerationController::class, 'create'])->name('generate.create');
    Route::post('generate', [GenerationController::class, 'store'])->middleware(['api_key', 'throttle:generate'])->name('generate.store');
    Route::get('generate/{generation}/stream', [GenerationStreamController::class, 'stream'])->name('generate.stream');

    Route::get('history', [GenerationController::class, 'index'])->name('history.index');
    Route::get('history/{generation}', [GenerationController::class, 'show'])->name('history.show');
    Route::put('history/{generation}', [GenerationController::class, 'update'])->name('history.update');
    Route::delete('history/{generation}', [GenerationController::class, 'destroy'])->name('history.destroy');

    // Tones
    Route::get('tones', [ToneController::class, 'index'])->name('tones.index');
    Route::post('tones', [ToneController::class, 'store'])->name('tones.store');
    Route::put('tones/{tone}', [ToneController::class, 'update'])->name('tones.update');
    Route::delete('tones/{tone}', [ToneController::class, 'destroy'])->name('tones.destroy');

    // Shortcut to AI & API keys
    Route::redirect('api-keys', '/settings/api-keys')->name('api-keys');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
});

require __DIR__.'/settings.php';
