<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Services\SalaryService;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CreateAbsenceRequest extends FormRequest
{
    protected $salaryService;

    public function __construct()
    {
        $this->salaryService = new SalaryService();
    }
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
                Rule::unique('absences')->where(function ($query) {
                    return $query->where('employee_id', $this->employee);
                }),
                function (string $attribute, mixed $value, Closure $fail) {
                    /* cek salary */
                    $salary = $this->salaryService->getSalaryByAbsence($this);
                    if ($salary && strtolower($salary->status) === 'posted') {
                        $fail("Absence cannot be created, the salary for this date is already posted");
                    }
                },
            ],
            'type' => [
                'required',
                'min:1',
                'max:3'
            ],
            'employee' => ['required', Rule::exists(User::class, 'id')]
        ];
    }
}
