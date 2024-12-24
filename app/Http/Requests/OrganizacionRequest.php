<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class OrganizacionRequest extends FormRequest
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
            'nombre_organizacion' => ['required', Rule::unique('organizaciones')->ignore($this->request->get('id'))],
            'numero_organizacion' => 'required',
            'sigla'               =>  'required',
            'color'               =>  'required',
            'logo_url'            =>  '',
            'aliados'             =>  'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_organizacion.required'  =>  'La organización es requerida',
            'numero_organizacion.required'  =>  'El número de la organización es requerida',
            'nombre_organizacion.unique'    =>  'La organización ya está registrada',
            'sigla.required'                =>  'Las siglas son requeridas',
            'color.required'                =>  'Por favor seleccione un color a la lista',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
