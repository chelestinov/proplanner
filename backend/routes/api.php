<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AiToolController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Models\Category;
use App\Models\User;
use App\Models\AiTool;
use Spatie\Permission\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| ПУБЛИЧНИ МАРШРУТИ (Преди логин)
|--------------------------------------------------------------------------
*/
Route::post('2fa/send', [TwoFactorController::class, 'sendCode']);
Route::post('2fa/verify', [TwoFactorController::class, 'verifyCode']);

Route::post('register', function (Request $request) {
    $validated = $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:8',
        'role_id'  => 'required|exists:roles,id',
    ]);

    $user = User::create([
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'password' => Hash::make($validated['password']),
        'status'   => 'pending', 
    ]);

    $user->roles()->attach($validated['role_id']);

    return response()->json(['message' => 'Регистрацията е успешна! Изчакайте одобрение от админ.'], 201);
});

// КЕШИРАНИ ДАННИ - преместени тук, за да са достъпни публично
Route::get('/categories', function () {
    return Category::all(); // Директно от базата, без кеш!
});

Route::get('/roles', function () {
    return \Spatie\Permission\Models\Role::all(); // Директно от базата, без кеш!
});

Route::get('/stats/tools-count', function () {
    $count = Cache::remember('approved_tools_count', 3600, function () {
        return AiTool::where('status', 'approved')->count();
    });
    return response()->json(['count' => $count]);
});


/*
|--------------------------------------------------------------------------
| ЗАЩИТЕНИ МАРШРУТИ (Изискват логнат потребител)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles');
        
        // Извличаме името на ролята (напр. 'Owner') и го закачаме като просто текстово поле, за да го разпознае Next.js
        $user->role = $user->roles->first()->name ?? 'User';
        
        return $user;
    });

    Route::post('/user/avatar', function (Request $request) {
        $request->validate([
            'avatar' => 'required|image|max:5120',
        ]);
        $user = $request->user();
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = '/storage/' . $path;
        $user->save();
        return response()->json(['avatar_url' => $user->avatar]);
    });

    Route::apiResource('ai-tools', AiToolController::class);

    Route::post('/ai-tools/{id}/reviews', function (Request $request, $id) {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review = \App\Models\Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'ai_tool_id' => $id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return response()->json(['message' => 'Отзивът е записан успешно!', 'review' => $review]);
    });

    // --- АДМИН ПАНЕЛ ---
    // Уверихме се, че пътищата съвпадат с тези, които фронтендът търси
    Route::middleware(RoleMiddleware::class . ':owner')->group(function () {
        
        // Инструменти за одобрение
        Route::get('/admin/tools/pending', [AiToolController::class, 'pendingTools']);
        Route::put('/admin/tools/{id}/approve', [AiToolController::class, 'approveTool']);
        Route::put('/admin/tools/{id}/reject', [AiToolController::class, 'rejectTool']);

        // Всички потребители (може да се ползва от Админа)
        Route::get('/users', function() {
            return User::with('roles')->get();
        });

        // Потребители за одобрение
        Route::get('/admin/users/pending', function() {
            return User::where('status', 'pending')->with('roles')->latest()->get();
        });
        
        // Одобряване на потребител
        Route::put('/admin/users/{id}/approve', function($id) {
            $user = User::findOrFail($id);
            $user->status = 'active'; 
            $user->save();            
            return response()->json(['message' => 'Потребителят е активиран!']);
        });

        // Изтриване на потребител
        Route::delete('/admin/users/{id}', function($id) {
            $user = User::findOrFail($id);
            if ($user->hasRole('owner')) {
                return response()->json(['message' => 'Не можете да изтриете Owner!'], 403);
            }
            $user->delete();
            return response()->json(['message' => 'Потребителят е изтрит!']);
        });
    });
});

/*
|--------------------------------------------------------------------------
| ПОМОЩНИ МАРШРУТИ ЗА РАЗРАБОТЧИКА (Можеш да ги запазиш)
|--------------------------------------------------------------------------
*/
Route::get('/force-categories', function() {
    Schema::disableForeignKeyConstraints();
    DB::table('categories')->truncate();
    DB::table('categories')->insert([
        ['name' => 'Чатботове и Текст', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Изображения и Видео', 'created_at' => now(), 'updated_at' => now()],
        ['name' => 'Програмиране', 'created_at' => now(), 'updated_at' => now()],
    ]);
    Schema::enableForeignKeyConstraints();
    return 'УСПЕХ! Категориите са записани твърдо в базата!';
});