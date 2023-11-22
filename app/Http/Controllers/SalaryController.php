<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateSalaryBonusRequest;
use App\Http\Requests\CreateSalaryDeductionRequest;
use App\Http\Requests\CreateSalaryRequest;
use App\Http\Requests\UpdateSalaryBonusRequest;
use App\Http\Requests\UpdateSalaryDeductionRequest;
use App\Models\Salary;
use App\Models\SalaryBonus;
use App\Models\SalaryDeduction;
use App\Models\User;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SalaryController extends Controller
{
    public function index()
    {
        $search = request()->search;
        $dateFrom = request()->filters['dateFrom'] ?? '';
        $dateUntil = request()->filters['dateUntil'] ?? '';
        $employee = request()->filters['employee'] ?? '';
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);


        $filters = [
            'dateFrom' => $dateFrom,
            'dateUntil' => $dateUntil,
            'employee' => $employee
        ];

        return Inertia::render("Salary/Index", [
            'tableForm' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'page' => $page,
                'filters' => [
                    'dateFrom' => $dateFrom,
                    'dateUntil' => $dateUntil,
                    'employee' => $employee
                ]
            ],
            'dataRoute' => 'salary',
            'datas' => Salary::filter($search, $filters)->orderBy($sortBy, $sortDirection)->paginate(5),
            'columnDatas' => [
                ['key' => 'date', 'label' => 'Date'],
                ['key' => 'employee', 'label' => 'Employee'],
                ['key' => 'total_amount', 'label' => 'Total Amount'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
            ],
            'employeeAutocomplete' => User::selectRaw('id, name as value')->get(),
        ]);
    }

    public function store(CreateSalaryRequest $request)
    {
        $request->validated();

        $salary = new Salary();
        $salary->salary_per_day = $request->salary_per_day;
        $salary->date = $request->date;
        $salary->employee_id = $request->employee;
        $salary->total_amount = 0;
        $salary->save();

        return Redirect::to('/salary');
    }

    public function show(Salary $salary)
    {
        $search = request()->search;
        $table = request()->table;
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);

        $salaryDeductions = $salary->filterDetail($search, 'salary_deductions');
        $salaryBonus = $salary->filterDetail($search, 'salary_bonuses');

        $salary->salary_deductions = $salaryDeductions->orderBy($sortBy, $sortDirection)->paginate(5);
        $salary->salary_bonus = $salaryBonus->orderBy($sortBy, $sortDirection)->paginate(5);
        $salary->total_salary_bonus = $salaryBonus->sum('amount');
        $salary->total_salary_deduction = $salaryDeductions->sum('amount');

        $salary->employee = User::find($salary->employee_id)->name;

        return Inertia::render('Salary/Show', [
            'tableForm' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'page' => $page,
            ],
            'dataRoute' => 'salary.show',
            'routeParam' => [
                'id' => $salary->id
            ],
            'datas' => $salary,
            'columnDatas' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'amount', 'label' => 'Amount'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
                ['key' => 'action', 'label' => 'Action', 'component' => 'SalaryBonusAction'],
            ],
            'columnDatas2' => [
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'amount', 'label' => 'Amount'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
                ['key' => 'action', 'label' => 'Action', 'component' => 'SalaryDeductionAction'],
            ],
        ]);
    }


    public function createSalaryBonus(CreateSalaryBonusRequest $request)
    {
        $request->validated();

        $salary = new SalaryBonus();
        $salary->name = $request->name;
        $salary->amount = $request->amount;
        $salary->salary_id = $request->salary_id;
        $salary->save();

        // return Redirect::to("/salary/{$request->salary_id}");
    }


    public function createSalaryDeduction(CreateSalaryDeductionRequest $request)
    {
        $request->validated();

        $salary = new SalaryDeduction();
        $salary->name = $request->name;
        $salary->amount = $request->amount;
        $salary->salary_id = $request->salary_id;
        $salary->save();

        return Redirect::to("/salary/{$request->salary_id}");
    }

    public function updateSalaryBonus(UpdateSalaryBonusRequest $request, SalaryBonus $salaryBonus)
    {
        $request->validated();

        $salaryBonus->name = $request->name;
        $salaryBonus->amount = $request->amount;
        $salaryBonus->save();

        return Redirect::to("/salary/{$request->salary_id}");
    }

    public function updateSalaryDeduction(UpdateSalaryDeductionRequest $request, SalaryDeduction $salaryDeduction)
    {
        $request->validated();

        $salaryDeduction->name = $request->name;
        $salaryDeduction->amount = $request->amount;
        $salaryDeduction->save();

        return Redirect::to("/salary/{$request->salary_id}");
    }

    public function deleteSalaryBonus(SalaryBonus $salaryBonus)
    {
        $salary_id = $salaryBonus->salary_id;

        $salaryBonus->delete();

        // return Redirect::to("/salary/{$salary_id}");
    }

    public function deleteSalaryDeduction(SalaryDeduction $salaryDeduction)
    {
        $id = $salaryDeduction->id;

        $salaryDeduction->delete();
    }
}
