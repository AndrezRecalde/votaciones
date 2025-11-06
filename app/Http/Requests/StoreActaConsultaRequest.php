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
            // Geografía (obligatoria)
            'provincia_id' => 'required|integer|exists:provincias,id',
            'canton_id' => 'required|integer|exists:cantones,id',
            'parroquia_id' => 'required|integer|exists:parroquias,id',
            'zona_id' => 'required|integer|exists:zonas,id',
            'junta_id' => 'required|integer|exists:juntas,id',

            // Pregunta (única por solicitud)
            'pregunta_id' => 'required|integer|exists:preguntas_consulta,id',

            // Campos por pregunta (obligatorios)
            'cod_cne' => 'nullable|string|max:255',
            'votos_si' => 'required|integer|min:0',
            'votos_no' => 'required|integer|min:0',
            'votos_validos' => 'required|integer|min:0',
            'votos_blancos' => 'required|integer|min:0',
            'votos_nulos' => 'required|integer|min:0',
            'cuadrada' => 'required|boolean',
            'legible' => 'required|boolean',
            'estado' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'provincia_id.required' => 'La provincia es requerida.',
            'canton_id.required' => 'El cantón es requerido.',
            'parroquia_id.required' => 'La parroquia es requerida.',
            'zona_id.required' => 'La zona es requerida.',
            'junta_id.required' => 'La junta es requerida.',
            'pregunta_id.required' => 'La pregunta es requerida.',
            'votos_si.required' => 'Los votos SÍ son requeridos.',
            'votos_no.required' => 'Los votos NO son requeridos.',
            'votos_validos.required' => 'Los votos válidos son requeridos.',
            'votos_blancos.required' => 'Los votos en blanco son requeridos.',
            'votos_nulos.required' => 'Los votos nulos son requeridos.',
            'cuadrada.required' => 'Debe indicar si el acta está cuadrada.',
            'legible.required' => 'Debe indicar si el acta es legible.',
            'estado.required' => 'Debe indicar el estado del acta.',
        ];
    }

    public function attributes(): array
    {
        return [
            'provincia_id' => 'provincia',
            'canton_id' => 'cantón',
            'parroquia_id' => 'parroquia',
            'zona_id' => 'zona',
            'junta_id' => 'junta',
            'pregunta_id' => 'pregunta',
            'cod_cne' => 'código CNE',
            'votos_si' => 'votos SÍ',
            'votos_no' => 'votos NO',
            'votos_validos' => 'votos válidos',
            'votos_blancos' => 'votos en blanco',
            'votos_nulos' => 'votos nulos',
            'cuadrada' => 'cuadrada',
            'legible' => 'legible',
            'estado' => 'estado',
        ];
    }
}
