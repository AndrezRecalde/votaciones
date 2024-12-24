<?php

use Illuminate\Support\Facades\Route;

/* Route::get('/', function () {
    return view('welcome');
}); */

Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '^(?!api).*?');
