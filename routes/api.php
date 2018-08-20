<?php

use Illuminate\Http\Request;

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

Route::group(['prefix' => 'v1', 'as' => 'api.'], function () {
  Route::get('ping', ['as' => 'ping', 'uses' => function () {
    return [
      'status' => 'ok',
      'data' => 'pong',
    ];
  }]);

  Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/user', ['as' => 'user', 'uses' => function (Request $request) {
      return [
        'status' => 'ok',
        'data' => UserSerializer::serialize($request->user()),
      ];
    }]);
  });
});
