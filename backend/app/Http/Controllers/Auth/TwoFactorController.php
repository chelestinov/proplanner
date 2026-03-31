<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TwoFactorController extends Controller
{
    /**
     * СТЪПКА 1: Проверка на парола и изпращане на имейл код
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // Проверяваме дали паролата съвпада с хешираната в базата
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Грешен имейл или парола!'], 401);
        }

        // Генерираме 6-цифрен код
        $code = rand(100000, 999999);

        // Записваме кода и кога изтича (след 10 мин)
        $user->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Пращаме кода по имейл (ще го видиш в Mailpit)
        Mail::raw("Вашият код за сигурност е: $code", function ($message) use ($user) {
            $message->to($user->email)->subject('Код за достъп - ToolHub 2FA');
        });

        return response()->json(['message' => 'Кодът е изпратен успешно!']);
    }

    /**
     * СТЪПКА 2: Проверка на въведения от потребителя код
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)
            ->where('two_factor_code', $request->code)
            ->where('two_factor_expires_at', '>', Carbon::now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Невалиден или изтекъл код!'], 422);
        }

        // Изчистваме кода след успешно ползване
        $user->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null,
        ]);

        // Генерираме Sanctum токен за финализиране на входа
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}