<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        // Връщаме всички задачи, за да ги вижда Иван на Dashboard-а
        return response()->json(Task::all());
    }
}