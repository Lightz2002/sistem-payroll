<?php

namespace App\Http\Requests;

use App\Models\User;
use Carbon\Carbon;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UpdateSalaryRequest extends FormRequest
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
            //
            'date' => [
                'required', 'date',
                function (string $attribute, mixed $value, Closure $fail) {
                    $startOfMonth = Carbon::parse($value)->startOfMonth();
                    $isExistEmployeeSalaryDate = DB::table('salaries')
                        ->where('employee_id', $this->employee)
                        ->where('date', $startOfMonth)
                        ->whereNot('id', $this->id)
                        ->first();

                    if ($isExistEmployeeSalaryDate) {
                        $fail("The salary {$attribute} already exists for this employee");
                    }
                },
            ],
            'salary_per_day' => ['required', 'numeric'],
            'status' => ['required', function (string $attribute, mixed $value, Closure $fail) {
                if (!in_array($value, ['entry', 'posted'])) {
                    $fail("The {$attribute} is not valid");
                }
            }],
            'employee' => ['required', Rule::exists(User::class, 'id')]
        ];
    }
}
