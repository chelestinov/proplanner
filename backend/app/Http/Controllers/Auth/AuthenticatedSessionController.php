<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        // 1. Излизане от Guard-а
        Auth::guard('web')->logout();

        // 2. Унищожаване на сесията на сървъра
        $request->session()->invalidate();

        // 3. Генериране на нов CSRF токен за следващия потребител
        $request->session()->regenerateToken();

        // 4. ИЗРИЧНО ПРЕМАХВАНЕ НА БИСКВИТКАТА (Cookie)
        // Това казва на браузъра да изтрие сесийната бисквитка веднага.
        $cookie = Cookie::forget(config('session.cookie'));

        return response()->noContent()->withCookie($cookie);
    }
}