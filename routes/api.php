<?php

use App\Http\Controllers\Admin\ActaController;
use App\Http\Controllers\Admin\CandidatoController;
use App\Http\Controllers\Admin\DignidadController;
use App\Http\Controllers\Admin\DistritoController;
use App\Http\Controllers\Admin\EscrutinioController;
use App\Http\Controllers\Admin\JuntaController;
use App\Http\Controllers\Admin\OrganizacionController;
use App\Http\Controllers\Admin\ResultadoController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TwilioController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Guess\GuessController;
use App\Http\Controllers\StateController;
use App\Http\Middleware\CheckRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});


Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
/* Usuario: Canbio de contraseña */
Route::get('/change-password', [UserController::class, 'updatePassword'])->middleware('auth:sanctum');


Route::post('/dignidades', [DignidadController::class, 'getDignidades']);

Route::post('/cantones', [StateController::class, 'getCantones']);

Route::post('/resultados/totales', [ResultadoController::class, 'getResultados']);
Route::post('/resultados/total/votos', [ResultadoController::class, 'getTotalVotos']);
Route::post('/resultados-cantones', [ResultadoController::class, 'getResultadosPorCanton']);
Route::post('/resultados-zonas', [ResultadoController::class, 'getResultadosPorZona']);

Route::post('/total/juntas', [JuntaController::class, 'getTotalJuntas']);
Route::post('/actas/ingresadas', [ActaController::class, 'getTotalActasIngresadas']);
Route::post('/contar-actas', [UserController::class, 'contarActas']);



/* WhatsApp: Enviar Mensajes */
Route::post('/send-whatsapp', [TwilioController::class, 'sendWhatsApp']);

Route::group(
    [
        'prefix' => 'admin',
        'middleware' => ['auth:sanctum', CheckRole::class . ':ADMIN|RESPONSABLE']
    ],
    function () {


        /* Usuarios */
        Route::get('/usuarios', [UserController::class, 'getUsuarios']);
        Route::post('/store/usuario', [UserController::class, 'store']);
        Route::put('/update/usuario/{id}', [UserController::class, 'update']);
        Route::put('/update/password/usuario/{id}', [UserController::class, 'updatePassword']);
        Route::put('/update/status/usuario/{id}', [UserController::class, 'updateStatus']);
        Route::delete('/delete/usuario/{id}', [UserController::class, 'destroy']);

        /* Invitados */
        Route::get('/guesses', [GuessController::class, 'getGuesses']);
        Route::post('/store/guess', [GuessController::class, 'store']);
        Route::put('/update/guess/{id}', [GuessController::class, 'update']);
        Route::put('/update/status/guess/{id}', [GuessController::class, 'updateActivo']);
        Route::delete('/delete/guess', [GuessController::class, 'destroy']);


        /* Roles */
        Route::get('/roles', [RoleController::class, 'getRoles']);





        /* Distrito */
        Route::get('/distritos', [DistritoController::class, 'getDistritos']);

        /* Dignidad */
        Route::put('/update/status/dignidad/{id}', [DignidadController::class, 'updateStatus']);


        /* Organizaciones */
        Route::get('/organizaciones', [OrganizacionController::class, 'getOrganizaciones']);
        Route::post('/store/organizacion', [OrganizacionController::class, 'store']);
        Route::post('/update/organizacion/{id}', [OrganizacionController::class, 'update']);
        Route::delete('/delete/organizacion/{id}', [OrganizacionController::class, 'destroy']);



        /* Candidatos */
        Route::get('/candidatos', [CandidatoController::class, 'getCandidatos']);
        Route::post('/store/candidato', [CandidatoController::class, 'store']);
        Route::put('/update/candidato/{id}', [CandidatoController::class, 'update']);
        Route::put('/update/status/candidato/{id}', [CandidatoController::class, 'updateActivo']);
        Route::delete('/delete/candidato/{id}', [CandidatoController::class, 'destroy']);

        /* Total de Actas Ingresadas */
        Route::post('/actas/ingresadas', [ActaController::class, 'getTotalActasIngresadas']);

        /* Visualizacion de Actas */
        Route::post('/listar/actas', [ActaController::class, 'getActas']);

        /* Exportación de Actas */
        Route::post('/exportar/actas', [ActaController::class, 'exportExcelActas']);

        /* Escrutinios */
        Route::get('/resultado/escrutinio', [EscrutinioController::class, 'getAvanceEscrutinio']);

        /* Resultados */
        Route::post('/resultados/totales', [ResultadoController::class, 'getResultados']);
        Route::post('/resultados/total/votos', [ResultadoController::class, 'getTotalVotos']);
        Route::post('/resultados/tendencia/zonas', [ResultadoController::class, 'getTendencias']);
        Route::post('/resultados/export-pdf', [ResultadoController::class, 'exportResultadosPDF']);
        Route::post('/resultados/export-pdf/zonas', [ResultadoController::class, 'exportResultadosPDFPorZona']);
        Route::post('/resultados/export-xls', [ResultadoController::class, 'exportarResultadosXLS']);


        /* WhatsApp: Enviar Mensajes */
        Route::post('/resultados/send-whatsapp', [TwilioController::class, 'sendWhatsApp']);
    }
);

Route::group(
    [
        'prefix' => 'general',
        'middleware' => ['auth:sanctum',  CheckRole::class . ':DIGITADOR|ADMIN|RESPONSABLE']
    ],
    function () {

        /* Estados: Provincias, Cantones, Recintos, Zona, Juntas */
        Route::post('/listar/provincias', [StateController::class, 'getProvincias']);
        Route::post('/cantones', [StateController::class, 'getCantones']);
        Route::post('/parroquias', [StateController::class, 'getParroquias']);
        Route::post('/recintos', [StateController::class, 'getRecintos']);
        Route::post('/zonas', [StateController::class, 'getZonas']);
        Route::post('/juntas', [StateController::class, 'getJuntas']);


        /* Dignidades */
        Route::post('/dignidades', [DignidadController::class, 'getDignidades']);

        /* Candidatos para el ACTA */
        Route::post('/acta/listar/candidatos', [CandidatoController::class, 'getDignidadesForActa2']);
        Route::post('/acta/listar/dignidades', [CandidatoController::class, 'getCandidatosForActa2']);


        /* Cuadro del Acta */
        Route::post('/digitacion/buscar/acta', [ActaController::class, 'existeJuntaDignidad']);
        Route::post('/digitacion/store/acta', [ActaController::class, 'store']);
        Route::post('/digitacion/update/acta', [ActaController::class, 'update']);
        Route::delete('/admin/delete/acta/{id}', [ActaController::class, 'destroy']);

        /* Acta de Información */
        Route::post('/informacion/junta', [JuntaController::class, 'getInfoJunta']);
        Route::post('/total/juntas', [JuntaController::class, 'getTotalJuntas']);

        /* Escrutinio de actas */
        Route::get('/escrutinio-dignidades', [EscrutinioController::class, 'getEscrutinioPorDignidad']);
    }
);
