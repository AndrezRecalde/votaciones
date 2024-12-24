<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombres_completos' =>  'required',
            'dni'               =>  ['required', Rule::unique('users')->ignore($this->request->get('id'))],
            'provincia_id'      =>  'required',
            'canton_id'         =>  '',
            'role'              =>  'required'
        ];
    }

    public function messages(): array
    {
        return [
            'nombres_completos.required'  =>  'Los nombres son requeridos',
            'dni.required'                =>  'El dni es requerido',
            'dni.unique'                  =>  'El dni ya está registrado',
            'provincia_id.required'       =>  'Especifica la provincia del usuario',
            'role.required'               =>  'Especifique el role del usuario'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
