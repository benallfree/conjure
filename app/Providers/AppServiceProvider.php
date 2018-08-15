<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    if (env('USE_SSL', false)) {
      // Force SSL routes
      \URL::forceScheme('https');
    }

    $this->registerPolicies();

    Passport::routes();
  }

  protected $policies = [
  ];

  public function register()
  {

  }
}
