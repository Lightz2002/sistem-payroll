<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/autocomplete/employees', [EmployeeController::class, 'getEmployeeAutocomplete'])->name('employee.getAutocomplete');

    Route::get('/employees', [EmployeeController::class, 'index'])->name('employee');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employee.store');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employee.update');

    Route::resource('roles', RoleController::class);



    Route::get('/salary', [SalaryController::class, 'index'])->name('salary');
    Route::get('/salary/{salary}', [SalaryController::class, 'show'])->name('salary.show');
    Route::post('/salary', [SalaryController::class, 'store'])->name('salary.store');
    Route::post('/salary/pdf', [SalaryController::class, 'printEmployeesSalary'])->name('salary.printAll');
    Route::post('/salary/{salary}/pdf', [SalaryController::class, 'printEmployeeSalary'])->name('salary.print');
    Route::put('/salary/{salary}', [SalaryController::class, 'update'])->name('salary.update');
    Route::delete('/salary/{salary}', [SalaryController::class, 'destroy'])->name('salary.destroy');

    Route::post('/salary_bonus', [SalaryController::class, 'createSalaryBonus'])->name('salary_bonus.store');
    Route::post('/salary_deduction', [SalaryController::class, 'createSalaryDeduction'])->name('salary_deduction.store');
    Route::put('/salary_bonus/{salaryBonus}', [SalaryController::class, 'updateSalaryBonus'])->name('salary_bonus.update');
    Route::put('/salary_deduction/{salaryDeduction}', [SalaryController::class, 'updateSalaryDeduction'])->name('salary_deduction.update');
    Route::delete('/salary_bonus/{salaryBonus}', [SalaryController::class, 'deleteSalaryBonus'])->name('salary_bonus.destroy');
    Route::delete('/salary_deduction/{salaryDeduction}', [SalaryController::class, 'deleteSalaryDeduction'])->name('salary_deduction.destroy');


    Route::get('/absence', [AbsenceController::class, 'index'])->name('absence');
    Route::post('/absence', [AbsenceController::class, 'store'])->name('absence.store');
    Route::put('/absence/{absence}', [AbsenceController::class, 'update'])->name('absence.update');
    Route::delete('/absence/{absence}', [AbsenceController::class, 'destroy'])->name('absence.destroy');
});
