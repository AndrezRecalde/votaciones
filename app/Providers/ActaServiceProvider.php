<?php

namespace App\Providers;

use App\Interfaces\ActaInterface;
use App\Repositories\ActaRepository;
use Illuminate\Support\ServiceProvider;

class ActaServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ActaInterface::class, ActaRepository::class);

    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
