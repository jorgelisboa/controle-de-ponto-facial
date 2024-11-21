<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index()
    {
    /**
     * Display a listing of the resource.
     */
    return Audit::all();
    }

    public function show($id)
    {
        return Audit::findOrFail($id);
    }

    public function store(Request $request)
    {
        $item = Audit::create($request->all());
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = Audit::findOrFail($id);
        $item->update($request->all());
        return response()->json($item, 200);
    }

    public function destroy($id)
    {
        Audit::destroy($id);
        return response()->json(null, 204);
    }
}
