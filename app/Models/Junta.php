<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Junta extends Model
{
    use HasFactory;

    function actas(): HasMany
    {
        return $this->hasMany(Acta::class)->with('votos');
    }

    public function zona(): BelongsTo
    {
        return $this->belongsTo(Zona::class, 'zona_id');
    }

    public function recinto(): BelongsTo
    {
        return $this->belongsTo(Recinto::class, 'recinto_id');
    }

    public function actasConsulta(): HasMany
    {
        return $this->hasMany(ActaConsulta::class, 'junta_id');
    }

    function scopeProvincia($query, $provincia_id)
    {
        if ($provincia_id) {
            return $query->where('prov.id', $provincia_id);
        }
    }

    function scopeCanton($query, $canton_id)
    {
        if ($canton_id) {
            return $query->where('c.id', $canton_id);
        }
    }

    function scopeParroquia($query, $parroquia_id)
    {
        if ($parroquia_id) {
            return $query->where('p.id', $parroquia_id);
        }
    }

    function scopeDignidad($query, $dignidad_id)
    {
        if ($dignidad_id) {
            return $query->where('d.id', $dignidad_id);
        }
    }

    function scopeZona($query, $zona_id)
    {
        if ($zona_id) {
            return $query->where('z.id', $zona_id);
        }
    }

    /* Consulta Popular */
    /**
     * Obtener resumen general de juntas y actas de consulta
     *
     * @return object
     */
    public static function getResumenGeneral()
    {
        return DB::selectOne("
            SELECT
                COUNT(j.id) AS total_juntas,
                COUNT(DISTINCT ac.junta_id) AS total_juntas_con_acta,
                COUNT(j.id) - COUNT(DISTINCT ac.junta_id) AS total_juntas_sin_acta,
                ROUND((COUNT(DISTINCT ac.junta_id) * 100.0 / COUNT(j.id)), 2) AS porcentaje_avance
            FROM juntas j
            LEFT JOIN actas_consulta ac ON ac.junta_id = j.id AND ac.estado = 1
        ");
    }

    /**
     * Obtener resumen por provincia
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getResumenPorProvincia()
    {
        return DB::select("
            SELECT
                p.id AS provincia_id,
                p.nombre_provincia,
                COUNT(j.id) AS total_juntas,
                COUNT(DISTINCT ac.junta_id) AS total_juntas_con_acta,
                COUNT(j.id) - COUNT(DISTINCT ac.junta_id) AS total_juntas_sin_acta,
                ROUND((COUNT(DISTINCT ac.junta_id) * 100.0 / COUNT(j.id)), 2) AS porcentaje_avance
            FROM provincias p
            INNER JOIN cantones c ON c.provincia_id = p.id
            INNER JOIN parroquias pa ON pa.canton_id = c.id
            INNER JOIN zonas z ON z.parroquia_id = pa.id
            INNER JOIN juntas j ON j.zona_id = z.id
            LEFT JOIN actas_consulta ac ON ac.junta_id = j.id AND ac.estado = 1
            WHERE p.activo = 1
            GROUP BY p.id, p.nombre_provincia
            ORDER BY p.nombre_provincia
        ");
    }

    /**
     * Obtener resumen por cantón
     *
     * @param int|null $provinciaId
     * @return \Illuminate\Support\Collection
     */
    public static function getResumenPorCanton($provinciaId = null)
    {
        $query = "
            SELECT
                c.id AS canton_id,
                c.nombre_canton,
                p.nombre_provincia,
                COUNT(j.id) AS total_juntas,
                COUNT(DISTINCT ac.junta_id) AS total_juntas_con_acta,
                COUNT(j.id) - COUNT(DISTINCT ac.junta_id) AS total_juntas_sin_acta,
                ROUND((COUNT(DISTINCT ac.junta_id) * 100.0 / COUNT(j.id)), 2) AS porcentaje_avance
            FROM cantones c
            INNER JOIN provincias p ON p.id = c.provincia_id
            INNER JOIN parroquias pa ON pa.canton_id = c.id
            INNER JOIN zonas z ON z.parroquia_id = pa.id
            INNER JOIN juntas j ON j.zona_id = z.id
            LEFT JOIN actas_consulta ac ON ac.junta_id = j.id AND ac.estado = 1
        ";

        if ($provinciaId) {
            $query .= " WHERE c.provincia_id = ?";
        }

        $query .= "
            GROUP BY c.id, c.nombre_canton, p.nombre_provincia
            ORDER BY p.nombre_provincia, c.nombre_canton
        ";

        return $provinciaId
            ? DB::select($query, [$provinciaId])
            : DB::select($query);
    }

    /* Total de juntas con o sin actas de CONSULTA POPULAR */
    /**
     * Obtener reporte completo de juntas por provincia
     * Estructura: Provincia > Cantones > Parroquias > Zonas > Recintos > Juntas
     *
     * @param int $provinciaId
     * @return array
     */
    public static function getReporteCompletoProvincia($provinciaId)
    {
        // Obtener todos los datos en una sola consulta
        $juntas = DB::select("
            SELECT
                p.id AS provincia_id,
                p.nombre_provincia,
                c.id AS canton_id,
                c.nombre_canton,
                pa.id AS parroquia_id,
                pa.nombre_parroquia,
                pa.tipo AS tipo_parroquia,
                z.id AS zona_id,
                z.nombre_zona,
                r.id AS recinto_id,
                r.nombre_recinto,
                r.direccion_recinto,
                j.id AS junta_id,
                j.num_junta,
                j.genero,
                j.junta_nombre,
                j.cne_cod_junta,
                j.num_electores_cne,
                CASE
                    WHEN ac.id IS NOT NULL THEN 1
                    ELSE 0
                END AS tiene_acta,
                ac.id AS acta_id,
                ac.votos_validos,
                ac.created_at AS acta_fecha_ingreso,
                u_add.nombres_completos AS usuario_ingreso
            FROM provincias p
            INNER JOIN cantones c ON c.provincia_id = p.id
            INNER JOIN parroquias pa ON pa.canton_id = c.id
            INNER JOIN zonas z ON z.parroquia_id = pa.id
            INNER JOIN juntas j ON j.zona_id = z.id
            LEFT JOIN recintos r ON j.recinto_id = r.id
            LEFT JOIN actas_consulta ac ON ac.junta_id = j.id AND ac.estado = 1
            LEFT JOIN users u_add ON ac.user_add = u_add.id
            WHERE p.id = ?
            ORDER BY c.nombre_canton, pa.nombre_parroquia, z.nombre_zona, r.nombre_recinto, j.num_junta, j.genero
        ", [$provinciaId]);

        // Estructurar los datos jerárquicamente
        $reporte = [
            'provincia_id' => null,
            'nombre_provincia' => null,
            'total_juntas' => 0,
            'juntas_con_acta' => 0,
            'juntas_sin_acta' => 0,
            'porcentaje_avance' => 0,
            'cantones' => []
        ];

        $cantonesMap = [];

        foreach ($juntas as $junta) {
            // Inicializar provincia
            if ($reporte['provincia_id'] === null) {
                $reporte['provincia_id'] = $junta->provincia_id;
                $reporte['nombre_provincia'] = $junta->nombre_provincia;
            }

            // Contadores generales
            $reporte['total_juntas']++;
            if ($junta->tiene_acta) {
                $reporte['juntas_con_acta']++;
            } else {
                $reporte['juntas_sin_acta']++;
            }

            // Agrupar por cantón
            $cantonKey = $junta->canton_id;
            if (!isset($cantonesMap[$cantonKey])) {
                $cantonesMap[$cantonKey] = [
                    'canton_id' => $junta->canton_id,
                    'nombre_canton' => $junta->nombre_canton,
                    'total_juntas' => 0,
                    'juntas_con_acta' => 0,
                    'juntas_sin_acta' => 0,
                    'porcentaje_avance' => 0,
                    'parroquias' => []
                ];
            }

            $cantonesMap[$cantonKey]['total_juntas']++;
            if ($junta->tiene_acta) {
                $cantonesMap[$cantonKey]['juntas_con_acta']++;
            } else {
                $cantonesMap[$cantonKey]['juntas_sin_acta']++;
            }

            // Agrupar por parroquia
            $parroquiaKey = $junta->parroquia_id;
            if (!isset($cantonesMap[$cantonKey]['parroquias'][$parroquiaKey])) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey] = [
                    'parroquia_id' => $junta->parroquia_id,
                    'nombre_parroquia' => $junta->nombre_parroquia,
                    'tipo_parroquia' => $junta->tipo_parroquia,
                    'total_juntas' => 0,
                    'juntas_con_acta' => 0,
                    'juntas_sin_acta' => 0,
                    'zonas' => []
                ];
            }

            $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['total_juntas']++;
            if ($junta->tiene_acta) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['juntas_con_acta']++;
            } else {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['juntas_sin_acta']++;
            }

            // Agrupar por zona
            $zonaKey = $junta->zona_id;
            if (!isset($cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey])) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey] = [
                    'zona_id' => $junta->zona_id,
                    'nombre_zona' => $junta->nombre_zona,
                    'total_juntas' => 0,
                    'juntas_con_acta' => 0,
                    'juntas_sin_acta' => 0,
                    'recintos' => []
                ];
            }

            $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['total_juntas']++;
            if ($junta->tiene_acta) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['juntas_con_acta']++;
            } else {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['juntas_sin_acta']++;
            }

            // Agrupar por recinto
            $recintoKey = $junta->recinto_id ?? 'sin_recinto';
            if (!isset($cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey])) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey] = [
                    'recinto_id' => $junta->recinto_id,
                    'nombre_recinto' => $junta->nombre_recinto,
                    'direccion_recinto' => $junta->direccion_recinto,
                    'total_juntas' => 0,
                    'juntas_con_acta' => 0,
                    'juntas_sin_acta' => 0,
                    'juntas' => []
                ];
            }

            $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey]['total_juntas']++;
            if ($junta->tiene_acta) {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey]['juntas_con_acta']++;
            } else {
                $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey]['juntas_sin_acta']++;
            }

            // Agregar junta
            $cantonesMap[$cantonKey]['parroquias'][$parroquiaKey]['zonas'][$zonaKey]['recintos'][$recintoKey]['juntas'][] = [
                'junta_id' => $junta->junta_id,
                'num_junta' => $junta->num_junta,
                'genero' => $junta->genero,
                'junta_nombre' => $junta->junta_nombre,
                'cne_cod_junta' => $junta->cne_cod_junta,
                'num_electores_cne' => $junta->num_electores_cne,
                'tiene_acta' => (bool) $junta->tiene_acta,
                'acta_id' => $junta->acta_id,
                'votos_validos' => $junta->votos_validos,
                'acta_fecha_ingreso' => $junta->acta_fecha_ingreso,
                'usuario_ingreso' => $junta->usuario_ingreso
            ];
        }

        // Convertir arrays asociativos a arrays indexados y calcular porcentajes
        foreach ($cantonesMap as &$canton) {
            if ($canton['total_juntas'] > 0) {
                $canton['porcentaje_avance'] = round(($canton['juntas_con_acta'] * 100) / $canton['total_juntas'], 2);
            }

            foreach ($canton['parroquias'] as &$parroquia) {
                foreach ($parroquia['zonas'] as &$zona) {
                    $zona['recintos'] = array_values($zona['recintos']);
                }
                $parroquia['zonas'] = array_values($parroquia['zonas']);
            }
            $canton['parroquias'] = array_values($canton['parroquias']);
        }

        $reporte['cantones'] = array_values($cantonesMap);

        // Calcular porcentaje general
        if ($reporte['total_juntas'] > 0) {
            $reporte['porcentaje_avance'] = round(($reporte['juntas_con_acta'] * 100) / $reporte['total_juntas'], 2);
        }

        return $reporte;
    }
}
