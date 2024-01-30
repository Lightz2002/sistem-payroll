<?php

namespace App\Http\Requests;

use App\Models\Absence;
use App\Models\Salary;
use App\Models\SalaryBonus;
use App\Models\SalaryDeduction;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateSalaryDeductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', function (string $attribute, mixed $value, Closure $fail) {
                $deductions = SalaryDeduction::where('salary_id', request()->salary_id)
                    ->where('id', '!=', request()->id)
                    ->get();

                $bonuses = SalaryBonus::where('salary_id', request()->salary_id)
                    ->get();

                $totalAbsence = Absence::where('salary_id', request()->salary_id)
                    ->where('type', 'Present')
                    ->get();

                $salary = Salary::where('id', request()->salary_id)->first();

                $totalDeductionsAmount = $deductions->sum('amount');
                $totalNewDeductionsAmount = $totalDeductionsAmount + $value;
                $totalBonusAmount = $bonuses->sum('amount');
                $totalAbsenceSalary = $totalAbsence->count() * $salary->salary_per_day;

                $totalSalaryAmountWithoutDeduction = $totalAbsenceSalary + $totalBonusAmount;

                /* klu total deduction amount + skrg pnya amount > total bonus amount + total absence salary */
                if ($totalNewDeductionsAmount > $totalSalaryAmountWithoutDeduction) {
                    $fail("Deductions cannot be larger than salary !");
                }
            }],
            'name' => ['required'],
            'salary_id' => [
                'required', Rule::exists(Salary::class, 'id'),
                function (string $attribute, mixed $value, Closure $fail) {
                    if ($value !== SalaryDeduction::findOrfail($this->id)->salary_id) {
                        $fail("The {$attribute}'s salary id is different");
                    };
                }
            ],
        ];
    }
}
