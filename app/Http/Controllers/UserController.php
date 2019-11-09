<?php

namespace App\Http\Controllers;

use App\Serializers\UserSerializer;

class UserController extends Controller
{
  public function current()
  {
    return [
      'status' => 'ok',
      'data' => UserSerializer::serialize(\Auth::user()),
    ];
  }
}
