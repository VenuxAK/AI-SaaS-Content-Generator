<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request): Response
    {
        $users = User::orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Display details for a specific user, including their history.
     */
    public function show(Request $request, User $user): Response
    {
        $generations = $user->generations()
            ->with('tone')
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'generations_page');

        return Inertia::render('Admin/UserShow', [
            'subjectUser' => $user,
            'generations' => $generations,
        ]);
    }
}
