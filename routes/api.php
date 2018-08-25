<?php

use App\Serializers\UserSerializer;
use Illuminate\Http\Request;

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
