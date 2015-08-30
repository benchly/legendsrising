<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('bootstrap.index');
});

Route::get('/news', function () {
    return "test";
});

Route::group(['prefix' => 'api'], function () {
    Route::resource('news', 'NewsController');
});