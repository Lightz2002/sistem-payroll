<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateSalaryBonusRequest;
use App\Http\Requests\CreateSalaryDeductionRequest;
use App\Http\Requests\CreateSalaryRequest;
use App\Http\Requests\UpdateSalaryBonusRequest;
use App\Http\Requests\UpdateSalaryDeductionRequest;
use App\Http\Requests\UpdateSalaryRequest;
use App\Models\Salary;
use App\Models\SalaryBonus;
use App\Models\SalaryDeduction;
use App\Models\User;
use App\Services\RoleService;
use App\Services\SalaryService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SalaryController extends Controller
{
    protected $salaryService;

    public function __construct()
    {
        $this->salaryService = new SalaryService();
    }
    public function index()
    {

        $search = request()->search;
        $dateFrom = request()->filters['dateFrom'] ?? '';
        $status = request()->filters['status'] ?? 'entry';
        $dateUntil = request()->filters['dateUntil'] ?? '';
        $employee = request()->filters['employee'] ?? '';
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);


        $filters = [
            'dateFrom' => $dateFrom,
            'dateUntil' => $dateUntil,
            'employee' => $employee,
            'status' => $status,
        ];

        $columns = [
            ['key' => 'date', 'label' => 'Date'],
            ['key' => 'employee', 'label' => 'Employee'],
            ['key' => 'total_amount', 'label' => 'Total Amount'],
            ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
        ];

        if (Auth::user()->hasRole('manager')) {
            $columns[] = ['key' => 'action', 'label' => 'Action', 'component' => 'SalaryAction'];
        }

        return Inertia::render("Salary/Index", [
            'tableForm' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'page' => $page,
                'filters' => $filters
            ],
            'dataRoute' => 'salary',
            'datas' => Salary::filter($search, $filters)->orderBy($sortBy, $sortDirection)->paginate(5),
            'columnDatas' => $columns,
            'employeeAutocomplete' => User::selectRaw('id, name as value')->get(),
        ]);
    }

    public function store(CreateSalaryRequest $request)
    {
        $request->validated();

        DB::transaction(function () use ($request) {
            $salary = new Salary();
            $salary->salary_per_day = $request->salary_per_day;
            $salary->date = $request->date;
            $salary->employee_id = $request->employee;
            $salary->status = 'entry';
            $salary->total_amount = 0;
            $salary->save();

            $this->salaryService->calculateTotalAmount($salary);;
        });

        return Redirect::to('/salary');
    }

    public function show(Salary $salary)
    {
        $search = request()->search;
        $table = request()->table;
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);

        $salary->employee = User::find($salary->employee_id)->name;

        $salaryDeductions = $salary->filterDetail($search, 'salary_deductions');
        $salaryBonus = $salary->filterDetail($search, 'salary_bonuses');
        $salaryAbsence = $this->salaryService->getAbsenceBySalary($salary)
            ->filter(
                '',
                [
                    'status' => 'entry',
                    'salaryDate' => '',
                    'dateFrom' => '',
                    'dateUntil' => '',
                    'type' => '',
                    'employee' => $salary->employee,
                ]
            );

        /* tables data */
        $salary->salary_deductions = $salaryDeductions->orderBy($sortBy, $sortDirection)->paginate(5);
        $salary->salary_bonus = $salaryBonus->orderBy($sortBy, $sortDirection)->paginate(5);
        $salary->total_salary_bonus = $salaryBonus->sum('amount');
        $salary->total_salary_deduction = $salaryDeductions->sum('amount');
        $salary->absence = $salaryAbsence->orderBy($sortBy, $sortDirection)->paginate(5);
        $salary->total_absence = $salaryAbsence->count();


        /* tables columns */

        $columnBonus = [
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'amount', 'label' => 'Amount'],
            ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
        ];

        $columnDeduction = [
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'amount', 'label' => 'Amount'],
            ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
        ];

        $columnAbsence = [
            ['key' => 'date', 'label' => 'Date'],
            ['key' => 'type', 'label' => 'Type'],
            ['key' => 'employee', 'label' => 'Employee'],
            ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
        ];

        /* role column */
        if (Auth::user()->hasRole('manager')) {
            $columnBonus[] =  ['key' => 'action', 'label' => 'Action', 'component' => 'SalaryBonusAction'];
            $columnDeduction[] =   ['key' => 'action', 'label' => 'Action', 'component' => 'SalaryDeductionAction'];
        }

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
            'columnDatas' => $columnBonus,
            'columnDatas2' => $columnDeduction,
            'columnDatas3' => $columnAbsence,
        ]);
    }

    public function update(UpdateSalaryRequest $request, Salary $salary)
    {
        $request->validated();

        DB::transaction(function () use ($request, $salary) {

            $salary->salary_per_day = $request->salary_per_day;
            $salary->date = $request->date;
            $salary->employee_id = $request->employee;
            $salary->status = $request->status;
            $salary->total_amount = 0;
            $salary->save();

            $this->salaryService->calculateTotalAmount($salary);
        });
    }

    public function destroy(Salary $salary)
    {
        $salary->delete();
    }


    public function createSalaryBonus(CreateSalaryBonusRequest $request)
    {
        $request->validated();

        DB::transaction(function () use ($request) {
            $salary = new SalaryBonus();
            $salary->name = $request->name;
            $salary->amount = $request->amount;
            $salary->salary_id = $request->salary_id;
            $salary->save();

            $this->salaryService->calculateTotalAmount($salary->salary_id);
        });
    }


    public function createSalaryDeduction(CreateSalaryDeductionRequest $request)
    {
        $request->validated();

        DB::transaction(function () use ($request) {
            $salary = new SalaryDeduction();
            $salary->name = $request->name;
            $salary->amount = $request->amount;
            $salary->salary_id = $request->salary_id;
            $salary->save();

            $this->salaryService->calculateTotalAmount($salary->salary_id);
        });
    }

    public function updateSalaryBonus(UpdateSalaryBonusRequest $request, SalaryBonus $salaryBonus)
    {
        $request->validated();

        DB::transaction(function () use ($request, $salaryBonus) {
            $salaryBonus->name = $request->name;
            $salaryBonus->amount = $request->amount;
            $salaryBonus->save();

            $this->salaryService->calculateTotalAmount($salaryBonus->salary_id);
        });

        return Redirect::to("/salary/{$request->salary_id}");
    }

    public function updateSalaryDeduction(UpdateSalaryDeductionRequest $request, SalaryDeduction $salaryDeduction)
    {
        $request->validated();

        DB::transaction(function () use ($request, $salaryDeduction) {
            $salaryDeduction->name = $request->name;
            $salaryDeduction->amount = $request->amount;
            $salaryDeduction->save();

            $this->salaryService->calculateTotalAmount($salaryDeduction->salary_id);
        });

        return Redirect::to("/salary/{$request->salary_id}");
    }

    public function deleteSalaryBonus(SalaryBonus $salaryBonus)
    {

        DB::transaction(function () use ($salaryBonus) {
            $salary_id = $salaryBonus->salary_id;

            $salaryBonus->delete();

            $this->salaryService->calculateTotalAmount($salary_id);
        });
        // return Redirect::to("/salary/{$salary_id}");
    }

    public function deleteSalaryDeduction(SalaryDeduction $salaryDeduction)
    {

        DB::transaction(function () use ($salaryDeduction) {
            $salary_id = $salaryDeduction->salary_id;

            $salaryDeduction->delete();
            $this->salaryService->calculateTotalAmount($salary_id);
        });
    }

    public function printEmployeesSalary()
    {
    }

    public function printEmployeeSalary(Salary $salary)
    {

        $pdf = Pdf::loadView('pdf.receipt', ['data' => $salary]);
        return $pdf->stream('invoice.pdf');
    }
}
