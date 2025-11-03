<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreActaConsultaRequest extends FormRequest
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
            'provincia_id' => 'required|integer|exists:provincias,id',
            'canton_id' => 'required|integer|exists:cantones,id',
            'parroquia_id' => 'required|integer|exists:parroquias,id',
            'zona_id' => 'required|integer|exists:zonas,id',
            'junta_id' => 'required|integer|exists:juntas,id',
            'cod_cne' => 'nullable|string|max:255',
            'votos_validos' => 'required|integer|min:0',
            'votos_blancos' => 'required|integer|min:0',
            'votos_nulos' => 'required|integer|min:0',
            'cuadrada' => 'required|boolean',
            'legible' => 'required|boolean',
            'estado' => 'sometimes|boolean',

            // Validación de preguntas - Actualizado
            'preguntas' => 'required|array|min:1',
            'preguntas.*.pregunta_id' => 'required|integer|exists:preguntas_consulta,id',
            'preguntas.*.votos_si' => 'required|integer|min:0',
            'preguntas.*.votos_no' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'provincia_id.required' => 'La provincia es requerida',
            'canton_id.required' => 'El cantón es requerido',
            'parroquia_id.required' => 'La parroquia es requerida',
            'zona_id.required' => 'La zona es requerida',
            'junta_id.required' => 'La junta es requerida',
            'votos_validos.required' => 'Los votos válidos son requeridos',
            'votos_blancos.required' => 'Los votos en blanco son requeridos',
            'votos_nulos.required' => 'Los votos nulos son requeridos',


            'preguntas.required' => 'Debe incluir al menos una pregunta',
            'preguntas.*.pregunta_id.required' => 'El ID de la pregunta es requerido',
            'preguntas.*.pregunta_id.exists' => 'La pregunta seleccionada no existe',
            'preguntas.*.votos_si.required' => 'Los votos SÍ son requeridos',
            'preguntas.*.votos_no.required' => 'Los votos NO son requeridos',
        ];
    }
}
