<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\User;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    protected $roleService;

    public function __construct()
    {
        $this->roleService = new RoleService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->search;
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);

        return Inertia::render("Employees/Index", [
            'tableForm' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'page' => $page,
            ],
            'dataRoute' => 'employee',
            'datas' => User::filter($search)->orderBy($sortBy, $sortDirection)->paginate(5),
            'columnDatas' => [
                ['key' => 'name', 'label' => 'name'],
                ['key' => 'email', 'label' => 'email'],
                ['key' => 'roles', 'label' => 'role'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
                ['key' => 'action', 'label' => 'action', 'component' => 'EmployeeAction'],
            ],
            'roleAutocomplete' => $this->roleService->getAll()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateEmployeeRequest $request)
    {
        //
        $request->validated();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $role = Role::firstWhere('id', $request->role);
        $user->assignRole($role->name);
        $user->save();


        return Redirect::to('/employees');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, User $employee)
    {
        $request->validated();

        $employee->name = $request->name;
        $employee->email = $request->email;

        $employee->assignRole($request->role);

        $employee->save();

        return redirect()->route('employee');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function getRoleByUser(User $user)
    {
        $userRole = User::filter('')->where('id', $user->id)->get();
        return response()->json($userRole);
    }
}
