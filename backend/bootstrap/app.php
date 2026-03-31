<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. Активираме Sanctum за SPA (Next.js)
        $middleware->statefulApi();

        // 2. ИЗКЛЮЧВАМЕ CSRF проверката за логина (спира 419 грешката)
        $middleware->validateCsrfTokens(except: [
            'login',
            'sanctum/csrf-cookie',
            'api/*', // Позволява ни да тестваме API-то без токени за момента
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();