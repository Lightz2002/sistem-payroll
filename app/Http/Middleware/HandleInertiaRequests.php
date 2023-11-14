<?php

namespace App\Http\Middleware;

use App\Models\RoleMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Synchronously...
            'appName' => config('app.name'),

            // Lazily...
            'auth.user' => fn () => $request->user()
                ?   [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                    'roles' => auth()->user()->roles, // Assuming you have a roles relationship in your User model
                    'permissions' => Gate::forUser(auth()->user())->abilities(),
                    'menus' => RoleMenu::getRoleMenus(auth()->user()->roles[0])
                ] : null,
        ]);
    }
}
