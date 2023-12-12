<?php

namespace App\Http\Requests;

use App\Models\Salary;
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
            'amount' => ['required', 'numeric'],
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
