<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->search;
        $sortBy = request()->sortBy;
        $sortDirection = request()->query('sortDirection');

        return Inertia::render("Employees/Index", [
            'sortBy' => 'created_at',
            'sortDirection' => 'asc',
            'dataRoute' => 'employee',
            'employees' => User::filter($search)->orderBy($sortBy, 'desc')->get(),
            'columnDatas' => [
                ['key' => 'name', 'label' => 'name'],
                ['key' => 'email', 'label' => 'email'],
                ['key' => 'roles', 'label' => 'role'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
                ['key' => 'action', 'label' => 'action', 'component' => 'EmployeeAction'],
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
