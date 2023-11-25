<?php

namespace App\Services;

use App\Models\Absence;
use App\Models\Salary;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
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
}
