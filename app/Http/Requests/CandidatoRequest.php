<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class CandidatoRequest extends FormRequest
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
            'organizacion_id'   =>  'required',
            'dignidad_id'       =>  'required',
            'nombre_candidato'  =>  'required',
            'distrito_id'       =>  'required',
            'provincia_id'      =>  'required',
            'canton_id'         =>  '',
            'parroquia_id'      =>  ''
        ];
    }

    public function messages(): array
    {
        return [
            'organizacion_id.required'  =>  'La organización es requerida',
            'dignidad_id.required'      =>  'La dignidad es requerida',
            'nombre_candidato.required' =>  'Los nombres del candidato son requeridos',
            'distrito_id.required'      =>  'El distrito es requerido',
            'provincia_id.required'     =>  'La provincia es requerida'
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
