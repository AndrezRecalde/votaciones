<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateActaConsultaRequest extends FormRequest
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
            'provincia_id' => 'sometimes|integer|exists:provincias,id',
            'canton_id' => 'sometimes|integer|exists:cantones,id',
            'parroquia_id' => 'sometimes|integer|exists:parroquias,id',
            'zona_id' => 'sometimes|integer|exists:zonas,id',
            'junta_id' => 'sometimes|integer|exists:juntas,id',
            'cod_cne' => 'nullable|string|max:255',
            'votos_validos' => 'sometimes|integer|min:0',
            'votos_blancos' => 'sometimes|integer|min:0',
            'votos_nulos' => 'sometimes|integer|min:0',
            'cuadrada' => 'sometimes|boolean',
            'legible' => 'sometimes|boolean',
            'estado' => 'sometimes|boolean',

            // Validación de preguntas
            'preguntas' => 'sometimes|array|min:1',
            'preguntas.*.pregunta_id' => 'required|integer|exists:preguntas,id',
            'preguntas.*.votos_si' => 'required|integer|min:0',
            'preguntas.*.votos_no' => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            // Mensajes para provincia
            'provincia_id.integer' => 'El ID de la provincia debe ser un número entero',
            'provincia_id.exists' => 'La provincia seleccionada no existe',

            // Mensajes para cantón
            'canton_id.integer' => 'El ID del cantón debe ser un número entero',
            'canton_id.exists' => 'El cantón seleccionado no existe',

            // Mensajes para parroquia
            'parroquia_id.integer' => 'El ID de la parroquia debe ser un número entero',
            'parroquia_id.exists' => 'La parroquia seleccionada no existe',

            // Mensajes para zona
            'zona_id.integer' => 'El ID de la zona debe ser un número entero',
            'zona_id.exists' => 'La zona seleccionada no existe',

            // Mensajes para junta
            'junta_id.integer' => 'El ID de la junta debe ser un número entero',
            'junta_id.exists' => 'La junta seleccionada no existe',

            // Mensajes para cod_cne
            'cod_cne.string' => 'El código CNE debe ser una cadena de texto',
            'cod_cne.max' => 'El código CNE no puede exceder los 255 caracteres',

            // Mensajes para votos_validos
            'votos_validos.integer' => 'Los votos válidos deben ser un número entero',
            'votos_validos.min' => 'Los votos válidos no pueden ser negativos',

            // Mensajes para votos_blancos
            'votos_blancos.integer' => 'Los votos en blanco deben ser un número entero',
            'votos_blancos.min' => 'Los votos en blanco no pueden ser negativos',

            // Mensajes para votos_nulos
            'votos_nulos.integer' => 'Los votos nulos deben ser un número entero',
            'votos_nulos.min' => 'Los votos nulos no pueden ser negativos',

            // Mensajes para cuadrada
            'cuadrada.boolean' => 'El campo cuadrada debe ser verdadero o falso',

            // Mensajes para legible
            'legible.boolean' => 'El campo legible debe ser verdadero o falso',

            // Mensajes para estado
            'estado.boolean' => 'El campo estado debe ser verdadero o falso',

            // Mensajes para preguntas
            'preguntas.array' => 'Las preguntas deben ser un arreglo',
            'preguntas.min' => 'Debe incluir al menos una pregunta',

            // Mensajes para pregunta_id
            'preguntas.*.pregunta_id.required' => 'El ID de la pregunta es requerido',
            'preguntas.*.pregunta_id.integer' => 'El ID de la pregunta debe ser un número entero',
            'preguntas.*.pregunta_id.exists' => 'La pregunta seleccionada no existe',

            // Mensajes para votos_si
            'preguntas.*.votos_si.required' => 'Los votos SÍ son requeridos',
            'preguntas.*.votos_si.integer' => 'Los votos SÍ deben ser un número entero',
            'preguntas.*.votos_si.min' => 'Los votos SÍ no pueden ser negativos',

            // Mensajes para votos_no
            'preguntas.*.votos_no.required' => 'Los votos NO son requeridos',
            'preguntas.*.votos_no.integer' => 'Los votos NO deben ser un número entero',
            'preguntas.*.votos_no.min' => 'Los votos NO no pueden ser negativos',
        ];
    }

    /**
     * Obtener nombres de atributos personalizados para mensajes de error
     */
    public function attributes(): array
    {
        return [
            'provincia_id' => 'provincia',
            'canton_id' => 'cantón',
            'parroquia_id' => 'parroquia',
            'zona_id' => 'zona',
            'junta_id' => 'junta',
            'cod_cne' => 'código CNE',
            'votos_validos' => 'votos válidos',
            'votos_blancos' => 'votos en blanco',
            'votos_nulos' => 'votos nulos',
            'cuadrada' => 'cuadrada',
            'legible' => 'legible',
            'estado' => 'estado',
            'preguntas' => 'preguntas',
            'preguntas.*.pregunta_id' => 'ID de la pregunta',
            'preguntas.*.votos_si' => 'votos SÍ',
            'preguntas.*.votos_no' => 'votos NO',
        ];
    }
}
