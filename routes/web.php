<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::group(['prefix' => 'v1', 'as' => 'api.'], function () {
  // Auth
  Route::post('login', 'Auth\LoginController@login')->name('login');
  Route::post('logout', 'Auth\LoginController@logout')->name('logout');
  Route::post('register', 'Auth\RegisterController@register')->name('register');
  Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');
  Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.reset');

  Route::get('user', ['as' => 'user', 'uses' => 'UserController@current']);

  Route::get('ping', ['as' => 'ping', 'uses' => function () {
    return [
      'status' => 'ok',
      'data' => 'pong',
    ];
  }]);

  Route::group(['as' => 'auth.', 'prefix' => 'auth', 'middleware' => ['auth']], function () {
    Route::get('ping', ['as' => 'ping', 'uses' => function () {
      return [
        'status' => 'ok',
        'data' => 'pong',
      ];
    }]);
  });
});

Route::any('/{any}', function () {
  return view('react');
})->where('any', '.*');
