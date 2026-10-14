<?php

use App\Models\Generation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from admin routes', function () {
    $user = User::factory()->create();

    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
    $this->get(route('admin.users.show', $user))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from accessing admin routes', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $subjectUser = User::factory()->create();

    $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.users.show', $subjectUser))->assertForbidden();
});

test('admins can view users list paginated', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(5)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users')
        ->has('users.data')
    );
});

test('admins can view specific user details with generations', function () {
    $admin = User::factory()->admin()->create();
    $subjectUser = User::factory()->create();

    Generation::factory()->count(2)->create(['user_id' => $subjectUser->id]);

    $response = $this->actingAs($admin)->get(route('admin.users.show', $subjectUser));

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/UserShow')
        ->where('subjectUser.id', $subjectUser->id)
        ->has('generations.data', 2)
    );
});
