<?php

namespace App\Http\Controllers;

use App\Models\AiTool;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class AiToolController extends Controller
{
    /**
     * СТЪПКА 1: Филтриране по роли + Зареждане на РЕВЮТА
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Добавяме 'reviews.user' към eager loading, за да виждаме кой е писал коментара
        $query = AiTool::with(['category', 'roles', 'tags', 'user', 'reviews.user'])
                       ->where('status', 'approved');

        // Филтрация по роли за обикновени потребители
        if (!$user->hasRole('owner')) {
            $userRoleIds = $user->roles->pluck('id');
            
            $query->whereHas('roles', function($q) use ($userRoleIds) {
                $q->whereIn('roles.id', $userRoleIds);
            });
        }

        return $query->latest()->get();
    }

    /**
     * НОВО: СТЪПКА 2: Показване на един конкретен инструмент + РЕВЮТАТА му
     */
    public function show($id)
    {
        // Зареждаме инструмента заедно с всичките му коментари и техните автори
        $tool = AiTool::with(['category', 'roles', 'tags', 'user', 'reviews.user'])
                      ->findOrFail($id);

        return response()->json($tool);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'required|url',
            'category_id' => 'required|exists:categories,id',
            'documentation_url' => 'nullable|url',
            'video_url' => 'nullable|url',
            'difficulty_level' => 'nullable|in:Beginner,Intermediate,Advanced',
            'how_to_use' => 'nullable|string',
            'real_examples' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'tags' => 'nullable', 
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('ai_tools', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        $validated['user_id'] = $request->user()->id;
        
        if ($request->user()->hasRole('owner')) {
            $validated['status'] = 'approved';
            Cache::forget('approved_tools_count');
        } else {
            $validated['status'] = 'pending';
        }

        $tool = AiTool::create($validated);

        if (isset($validated['roles'])) {
            $tool->roles()->sync($validated['roles']);
        }

        $this->syncTags($tool, $request->tags);

        // Зареждаме всичко + празния масив от ревюта за новия обект
        return response()->json($tool->load(['category', 'roles', 'tags', 'user', 'reviews']), 201);
    }

    public function update(Request $request, $id)
    {
        $tool = AiTool::findOrFail($id);
        
        if ($request->user()->id !== $tool->user_id && !$request->user()->hasRole('owner')) {
            return response()->json(['message' => 'Нямате право да редактирате това!'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'required|url',
            'category_id' => 'required|exists:categories,id',
            'image_file' => 'nullable|image|max:2048',
            'roles' => 'nullable|array',
            'tags' => 'nullable'
        ]);

        if ($request->hasFile('image_file')) {
            if ($tool->image_path && str_starts_with($tool->image_path, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $tool->image_path));
            }
            $path = $request->file('image_file')->store('ai_tools', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        $tool->update($validated);

        if (isset($validated['roles'])) {
            $tool->roles()->sync($validated['roles']);
        }

        $this->syncTags($tool, $request->tags);

        return response()->json($tool->load(['category', 'roles', 'tags', 'user', 'reviews.user']), 200);
    }

    public function destroy($id)
    {
        $tool = AiTool::findOrFail($id);
        if ($tool->image_path && str_starts_with($tool->image_path, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $tool->image_path));
        }
        $tool->delete();
        
        Cache::forget('approved_tools_count');
        return response()->json(['message' => 'Инструментът е изтрит успешно'], 200);
    }

    public function pendingTools()
    {
        // Тук също добавяме reviews, за да може админът да вижда ако има коментари (макар че за pending обикновено няма)
        return AiTool::with(['category', 'roles', 'tags', 'user', 'reviews.user'])
                     ->where('status', 'pending')
                     ->latest()
                     ->get();
    }

    public function approveTool($id)
    {
        $tool = AiTool::findOrFail($id);
        $tool->update(['status' => 'approved']);
        Cache::forget('approved_tools_count');
        
        return response()->json(['message' => 'Инструментът е одобрен успешно!']);
    }

    public function rejectTool($id)
    {
        $tool = AiTool::findOrFail($id);
        $tool->update(['status' => 'rejected']);
        return response()->json(['message' => 'Инструментът е отхвърлен!']);
    }

    private function syncTags($tool, $tagsData)
    {
        if (!$tagsData) return;

        $tagsArray = is_array($tagsData) ? $tagsData : explode(',', $tagsData);
        
        $tagIds = [];
        foreach ($tagsArray as $tagName) {
            $name = trim($tagName);
            if ($name) {
                $tag = Tag::firstOrCreate(['name' => $name]);
                $tagIds[] = $tag->id;
            }
        }
        $tool->tags()->sync($tagIds);
    }
}