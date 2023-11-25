<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateAbsenceRequest;
use App\Http\Requests\UpdateAbsenceRequest;
use App\Models\Absence;
use App\Models\User;
use App\Services\SalaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AbsenceController extends Controller
{
    protected $salaryService;

    public function __construct()
    {
        $this->salaryService = new SalaryService();
    }
    //
    public function index()
    {
        $search = request()->search;
        $dateFrom = request()->filters['dateFrom'] ?? '';
        $dateUntil = request()->filters['dateUntil'] ?? '';
        $salaryDate = request()->filters['salaryDate'] ?? '';
        $employee = request()->filters['employee'] ?? '';
        $type = request()->filters['type'] ?? '';
        $status = request()->filters['status'] ?? 'entry';
        $sortBy = request()->sortBy ?? 'created_at';
        $sortDirection = request()->sortDirection ?? 'asc';
        $page = ((is_nan(request()->page) || !request()->page) ? 1 : request()->page);


        $filters = [
            'salaryDate' => $salaryDate,
            'dateFrom' => $dateFrom,
            'dateUntil' => $dateUntil,
            'type' => $type,
            'employee' => $employee,
            'status' => $status
        ];

        $columns = [
            ['key' => 'date', 'label' => 'Date'],
            ['key' => 'type', 'label' => 'Type'],
            ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
            ['key' => 'action', 'label' => 'Action', 'component' => 'AbsenceAction'],
        ];

        if (Auth::user()->hasRole('manager')) {
            $columns = [
                ['key' => 'date', 'label' => 'Date'],
                ['key' => 'employee', 'label' => 'Employee'],
                ['key' => 'type', 'label' => 'Type'],
                ['key' => 'created_at', 'label' => 'Created At', 'component' => 'HumanDiff'],
            ];
        }

        return Inertia::render("Absence/Index", [
            'tableForm' => [
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDirection' => $sortDirection,
                'page' => $page,
                'filters' => $filters
            ],
            'dataRoute' => 'absence',
            'datas' => Absence::filter($search, $filters)->orderBy($sortBy, $sortDirection)->paginate(5),
            'columnDatas' => $columns,
            'employeeAutocomplete' => User::selectRaw('id, name as value')->get(),

        ]);
    }

    public function store(CreateAbsenceRequest $request)
    {
        $request->validated();

        DB::transaction(function () use ($request) {
            $absence = new Absence();

            switch ($request->type) {
                case '2':
                    $type = 'Permission';
                    break;
                case '3':
                    $type = 'Sick';
                    break;
                case '1':
                default:
                    $type = 'Present';
                    break;
            }

            $absence->type = $type;
            $absence->date = $request->date;
            $absence->employee_id = $request->employee;
            $absence->save();

            $salary = $this->salaryService->getSalaryByAbsence($absence);
            $absence->salary_id = $salary->id ?? null;
            $absence->save();

            $this->salaryService->calculateTotalAmount($salary);
        });

        return Redirect::to('/absence');
    }

    public function update(UpdateAbsenceRequest $request, Absence $absence)
    {
        $request->validated();

        /* update salary that matches old absence date */

        DB::transaction(function () use ($request, $absence) {

            $absence->type = $request->type;
            $absence->date = $request->date;
            $absence->employee_id = $request->employee;
            $absence->save();

            /* update salary that matches old absence date */
            $this->salaryService->calculateTotalAmount($absence->salary_id);

            /* update salary that matches new absence date */
            $salary = $this->salaryService->getSalaryByAbsence($absence);
            $absence->salary_id = $salary->id ?? null;
            $absence->save();
            $this->salaryService->calculateTotalAmount($salary);
        });

        return Redirect::to('/absence');
    }

    public function destroy(Absence $absence)
    {
        DB::transaction(function () use ($absence) {
            $salary = $this->salaryService->getSalaryByAbsence($absence);

            $absence->delete();

            $this->salaryService->calculateTotalAmount($salary);
        });

        return Redirect::to('/absence');
    }
}
