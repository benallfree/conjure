<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

class UserSerializer
{
  public static function serialize($u)
  {
    $rec = [
      'id' => $u->id,
      'name' => $u->name,
      'email' => $u->email,
      'created_at' => $u->created_at->toRfc822String(),
      'updated_at' => $u->created_at->toRfc822String(),
    ];
    return $rec;
  }
}

Route::group(['prefix' => 'v1', 'as' => 'api.', 'middleware' => ['auth:api']], function () {
  Route::get('/user', ['as' => 'user', 'uses' => function (Request $request) {
    return [
      'status' => 'ok',
      'data' => UserSerializer::serialize($request->user()),
    ];
  }]);

  Route::get('ping', ['as' => 'ping', 'uses' => function () {
    return [
      'status' => 'ok',
      'data' => 'pong',
    ];
  }]);

});
