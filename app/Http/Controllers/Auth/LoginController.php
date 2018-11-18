<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\AuthenticatesUsers;
use Laravel\Passport\ApiTokenCookieFactory;

class LoginController extends Controller
{
  use AuthenticatesUsers;

  public function __construct(ApiTokenCookieFactory $cookieFactory)
  {
    $this->cookieFactory = $cookieFactory;
  }

}
