<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;


class PreguntaConsultaRequest extends FormRequest
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
        $preguntaId = $this->route('pregunta') ?? $this->route('id') ?? null;

        return [
            'numero_pregunta' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('preguntas_consulta', 'numero_pregunta')->ignore($preguntaId),
            ],
            'texto_pregunta' => ['required', 'string', 'min:5'],
            'descripcion' => ['nullable', 'string'],
            'activo' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'numero_pregunta.required' => 'El número de pregunta es obligatorio.',
            'numero_pregunta.unique' => 'El número de pregunta ya existe.',
            'texto_pregunta.required' => 'El texto de la pregunta es obligatorio.',
        ];
    }
}
