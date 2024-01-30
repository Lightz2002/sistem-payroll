<?php

namespace App\Services;

use App\Models\Absence;
use App\Models\Salary;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Request;

class SalaryService
{
  public function getAbsenceBySalary($idOrModel = null)
  {
    if ($idOrModel instanceof Salary) {
      // Handle the case where a Salary model is passed
      $salaryModel = $idOrModel;
    } elseif (is_numeric($idOrModel)) {
      // Handle the case where an ID is passed
      $salaryModel = Salary::with(['salary_bonus', 'salary_deductions'])->findOrFail($idOrModel);
    } else {
      // Invalid argument provided
      return;
    }

    $absence = Absence::where('salary_id', $salaryModel->id);

    return $absence;
  }

  public function getSalaryByAbsence($idOrModelOrRequest = null)
  {
    if ($idOrModelOrRequest instanceof Absence) {
      // Handle the case where a Absence model is passed
      $absenceModel = $idOrModelOrRequest;
    } elseif (is_numeric($idOrModelOrRequest)) {
      // Handle the case where an ID is passed
      $absenceModel = Absence::with(['employee'])->findOrFail($idOrModelOrRequest);
    } elseif ($idOrModelOrRequest instanceof FormRequest) {
      $absenceModel = $idOrModelOrRequest;
      $absenceModel['employee_id'] = $idOrModelOrRequest->employee;
    } else {
      // Invalid argument provided
      return;
    }


    $salary = Salary::where('employee_id', $absenceModel->employee_id)
      ->where(DB::raw("CONCAT(YEAR(date), '-', MONTH(date))"), '=', DB::raw("CONCAT(YEAR('$absenceModel->date'), '-', MONTH('$absenceModel->date'))"))
      ->first();

    return $salary;
  }

  public function updateAbsenceSalaryByDate($idOrModel = null)
  {
    if ($idOrModel instanceof Salary) {
      // Handle the case where a Salary model is passed
      $salaryModel = $idOrModel;
    } elseif (is_numeric($idOrModel)) {
      // Handle the case where an ID is passed
      $salaryModel = Salary::with(['salary_bonus', 'salary_deductions'])->findOrFail($idOrModel);
    } else {
      // Invalid argument provided
      return;
    }

    $salaryYearAndMonth = Carbon::parse($salaryModel->date)->format('Y-n');

    $absence = Absence::where(DB::raw("CONCAT(YEAR(date), '-', MONTH(date))"), '=', $salaryYearAndMonth)
      ->where('employee_id', $salaryModel->employee_id)
      ->update(['salary_id' => $salaryModel->id]);

    return $absence;
  }

  public function updatePreviousSalaryAbsence($idOrModel = null)
  {
    if ($idOrModel instanceof Salary) {
      // Handle the case where a Salary model is passed
      $salaryModel = $idOrModel;
    } elseif (is_numeric($idOrModel)) {
      // Handle the case where an ID is passed
      $salaryModel = Salary::with(['salary_bonus', 'salary_deductions'])->findOrFail($idOrModel);
    } else {
      // Invalid argument provided
      return;
    }

    $salaryYearAndMonth = Carbon::parse($salaryModel->date)->format('Y-n');

    $absence = Absence::where(DB::raw("CONCAT(YEAR(date), '-', MONTH(date))"), '=', $salaryYearAndMonth)
      ->where('employee_id', $salaryModel->employee_id)
      ->update(['salary_id' => null]);

    return $absence;
  }

  public function calculateTotalAmount($idOrModel = null)
  {
    if ($idOrModel instanceof Salary) {
      // Handle the case where a Salary model is passed
      $salaryModel = $idOrModel;
    } elseif (is_numeric($idOrModel)) {
      // Handle the case where an ID is passed
      $salaryModel = Salary::with(['salary_bonus', 'salary_deductions'])->findOrFail($idOrModel);
    } else {
      // Invalid argument provided
      return;
    }

    $parsedSalaryDate = Carbon::parse($salaryModel->date)->firstOfMonth();
    $formattedSalaryDate = $parsedSalaryDate->format('Y-m-d');


    $totalAbsence = Absence::where('employee_id', $salaryModel->employee_id)
      ->where('type', 'Present')
      ->where(DB::raw("CONCAT(YEAR(date), '-', MONTH(date))"), '=', DB::raw("CONCAT(YEAR('$formattedSalaryDate'), '-', MONTH('$formattedSalaryDate'))"))
      ->count();

    $totalSalaryDeduction = $salaryModel->salary_deductions->sum('amount');
    $totalSalaryBonus = $salaryModel->salary_bonus->sum('amount');

    $salaryModel->total_amount = ($totalAbsence * $salaryModel->salary_per_day) + $totalSalaryBonus - $totalSalaryDeduction;
    $salaryModel->save();
  }

  public function getDashboardData()
  {
    $user = Auth::user();
    $now = Carbon::now();
    $today = $now->format('Y-m-d');
    $thisMonth = $now->format('Y-m');
    $lastMonth = $now->subMonth()->format('Y-m');


    if ($user->hasRole('manager')) {
      return collect([
        "total_paid_salary_all_time" => Salary::posted()->get()->sum('total_amount'),
        "total_paid_employee" => User::all()->count(),
        "total_employee_not_coming_today" => Absence::whereNot('type', 'Present')->where('date', $today)->get()->count(),
        "total_paid_salary_last_month" => Salary::posted()->whereRaw('DATE_FORMAT(`date`, "%Y-%m") = ?', [$lastMonth])->sum('total_amount'),
        "total_paid_salary_this_month" => Salary::posted()->whereRaw('DATE_FORMAT(`date`, "%Y-%m") = ?', [$thisMonth])->sum('total_amount'),
      ]);
    }

    return collect([
      "total_present" => Absence::where('employee_id', $user->id)->where('type', 'Present')->get()->count(),
      "total_sick" => Absence::where('employee_id', $user->id)->where('type', 'Sick')->get()->count(),
      "total_permission" => Absence::where('employee_id', $user->id)->where('type', 'Permission')->get()->count(),
      "total_salary_this_month" => Salary::posted()->where('employee_id', $user->id)->whereRaw('DATE_FORMAT(`date`, "%Y-%m") = ?', [$thisMonth])->first()->total_amount ?? 0,
      "total_salary_last_month" => Salary::posted()->where('employee_id', $user->id)->whereRaw('DATE_FORMAT(`date`, "%Y-%m") = ?', [$lastMonth])->first()->total_amount ?? 0,
    ]);
  }

  public function updateUserSalaryPerDayAndNote($employee)
  {
    $updatedSalariesQuery = Salary::where('employee_id', $employee->id)
      ->where('status', 'entry');

    $updatedSalariesQuery->update(['salary_per_day' => $employee->salary_per_day, 'salary_note' => $employee->salary_note]);

    $updatedSalaries = $updatedSalariesQuery->get();

    foreach ($updatedSalaries as $updatedSalary) {
      $this->calculateTotalAmount($updatedSalary);
    }
  }
}
