<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Rules\Password;
use Spatie\Permission\Models\Role;

class CreateEmployeeRequest extends FormRequest
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
            'name' => ['string', 'max:255', 'required'],
            'email' => ['email', 'max:255', 'required', Rule::unique(User::class)->ignore(Auth::user()->email)],
            'password' =>  ['required', 'string', new Password, 'confirmed'],
            'role' => ['required', Rule::exists(Role::class, 'id')]
        ];
    }
}
