<?php

namespace App\Enums;

enum HTTPStatus:string {
    case LoginFailed = 'Credenciales incorrectas';
    case UserNotActive = 'Usuario no activo';
    case Creacion = 'Creado con éxito';
    case Actualizado = 'Actualizado con éxito';
    case Eliminado = 'Eliminado con éxito';
    case Success = 'success';
    case Error = 'error';
    case Info = 'info';
    case NotFound = 'No Encontrado';
    case ActaCreated = '¡Acta creada con éxito!';
    case ActaUpdated = '¡Acta actualizada con éxito!';

}
