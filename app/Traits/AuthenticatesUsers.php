<?php

namespace App\Traits;

use App\Serializers\UserSerializer;
use Illuminate\Foundation\Auth\AuthenticatesUsers as AuthenticatesUsersBase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Lang;

trait AuthenticatesUsers
{
  use AuthenticatesUsersBase {
    AuthenticatesUsersBase::sendLoginResponse as oldSendLoginResponse;
    AuthenticatesUsersBase::sendLockoutResponse as oldSendLockoutResponse;
    AuthenticatesUsersBase::sendFailedLoginResponse as oldSendFailedLoginResponse;
    AuthenticatesUsersBase::logout as oldLogout;
  }

  protected function sendLoginResponse(Request $request)
  {
    $request->session()->regenerate();

    $this->clearLoginAttempts($request);

    $u = $this->guard()->user();
    if ($this->authenticated($request, $u)) {
      return [
        'status' => 'error',
        'messages' => 'Login failed',
      ];
    }
    return (new Response(
      [
        'status' => 'ok',
        'data' => UserSerializer::serialize($u),
      ]));
  }

  protected function sendLockoutResponse(Request $request)
  {
    $seconds = $this->limiter()->availableIn(
      $this->throttleKey($request)
    );

    return (new Response([
      'status' => 'error',
      'messages' => ['*' => Lang::get('auth.throttle', ['seconds' => $seconds])],
    ]));
  }

  protected function sendFailedLoginResponse(Request $request)
  {
    return (new Response([
      'status' => 'error',
      'messages' => ['*' => trans('auth.failed')],
    ]));
  }

  public function logout(Request $request)
  {
    $this->guard()->logout();

    $request->session()->invalidate();

    return [
      'status' => 'ok',
    ];
  }

}
