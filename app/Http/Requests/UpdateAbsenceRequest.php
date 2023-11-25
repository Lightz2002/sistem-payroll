<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateAbsenceRequest extends FormRequest
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
            'date' => ['required', 'date',  Rule::unique('absences')->where(function ($query) {
                return $query->where('employee_id', $this->employee);
            })->ignore($this->id),],
            'type' => ['required'],
            'employee' => ['required', Rule::exists(User::class, 'id')]
        ];
    }
}
