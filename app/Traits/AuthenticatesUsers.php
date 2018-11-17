<?php

namespace App\Traits;

use App\Serializers\UserSerializer;
use Illuminate\Foundation\Auth\AuthenticatesUsers as AuthenticatesUsersBase;
use Illuminate\Http\Request;

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
    return $this->authenticated($request, $u)
    ? [
      'status' => 'error',
      'messages' => 'Login failed',
    ] : [
      'status' => 'ok',
      'data' => UserSerializer::serialize($u),
    ];
  }

  protected function sendLockoutResponse(Request $request)
  {
    dd('sendLockoutResponse');

    $seconds = $this->limiter()->availableIn(
      $this->throttleKey($request)
    );

    throw ValidationException::withMessages([
      $this->username() => [Lang::get('auth.throttle', ['seconds' => $seconds])],
    ])->status(429);
  }

  protected function sendFailedLoginResponse(Request $request)
  {
    dd('sendFailedLoginResponse');

    throw ValidationException::withMessages([
      $this->username() => [trans('auth.failed')],
    ]);
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
