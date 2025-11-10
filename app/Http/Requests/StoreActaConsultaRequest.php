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
    /**
     * Reglas:
     * - votos_validos ahora pertenece al encabezado del acta.
     * - Cada pregunta ya NO lleva votos_validos.
     */
    public function rules(): array
    {
        return [
            'junta_id'      => 'required|integer|exists:juntas,id',
            'cod_cne'       => 'nullable|string|max:255',
            'votos_validos' => 'required|integer|min:0',
            'cuadrada'      => 'nullable|boolean',
            'legible'       => 'nullable|boolean',
            'estado'        => 'nullable|boolean',

            // Requerimos al menos una pregunta (ajusta si deseas flujo incremental)
            'preguntas' => 'required|array|min:1',
            'preguntas.*.pregunta_id'   => 'required|integer|exists:preguntas_consulta,id',
            'preguntas.*.votos_si'      => 'required|integer|min:0',
            'preguntas.*.votos_no'      => 'required|integer|min:0',
            'preguntas.*.votos_blancos' => 'required|integer|min:0',
            'preguntas.*.votos_nulos'   => 'required|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'junta_id.required' => 'La junta es obligatoria.',
            'junta_id.exists'   => 'La junta indicada no existe.',
            'cod_cne.max'       => 'El código CNE no debe exceder 255 caracteres.',
            'votos_validos.required' => 'Debe indicar los votos válidos del acta.',
            'votos_validos.min'      => 'Los votos válidos no pueden ser negativos.',

            'preguntas.required' => 'Debe enviar el arreglo de preguntas.',
            'preguntas.array'    => 'El campo preguntas debe ser un arreglo.',
            'preguntas.min'      => 'Debe enviar al menos una pregunta.',

            'preguntas.*.pregunta_id.required' => 'Cada ítem requiere pregunta_id.',
            'preguntas.*.pregunta_id.exists'   => 'La pregunta indicada no existe.',
            'preguntas.*.votos_si.required'    => 'Debe indicar votos_si.',
            'preguntas.*.votos_no.required'    => 'Debe indicar votos_no.',
            'preguntas.*.votos_blancos.required' => 'Debe indicar votos_blancos.',
            'preguntas.*.votos_nulos.required'   => 'Debe indicar votos_nulos.',
        ];
    }

    public function attributes(): array
    {
        return [
            'junta_id'      => 'junta',
            'cod_cne'       => 'código CNE',
            'votos_validos' => 'votos válidos (acta)',
            'cuadrada'      => 'acta cuadrada',
            'legible'       => 'acta legible',
            'estado'        => 'estado',
            'preguntas'     => 'preguntas',
            'preguntas.*.pregunta_id'   => 'pregunta',
            'preguntas.*.votos_si'      => 'votos sí',
            'preguntas.*.votos_no'      => 'votos no',
            'preguntas.*.votos_blancos' => 'votos blancos',
            'preguntas.*.votos_nulos'   => 'votos nulos',
        ];
    }

    /**
     * Normaliza el payload para el upsert de detalle.
     * (Ya NO incluye votos_validos).
     */
    public function preguntasPayload(int $actaId): array
    {
        $preguntas = $this->validated()['preguntas'] ?? [];
        $out = [];
        $now = now();

        foreach ($preguntas as $p) {
            $out[] = [
                'acta_consulta_id' => $actaId,
                'pregunta_id'      => (int) $p['pregunta_id'],
                'votos_blancos'    => (int) $p['votos_blancos'],
                'votos_nulos'      => (int) $p['votos_nulos'],
                'votos_si'         => (int) $p['votos_si'],
                'votos_no'         => (int) $p['votos_no'],
                'created_at'       => $now,
                'updated_at'       => $now,
            ];
        }

        return $out;
    }
}
