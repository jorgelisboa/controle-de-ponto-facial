
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Collaborator;
use Illuminate\Http\Request;

class UserCollaboratorController extends Controller
{
    public function associate(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'collaborator_document' => 'required|exists:collaborators,document',
        ]);

        $user = User::find($request->user_id);
        $collaborator = Collaborator::where('document', $request->collaborator_document)->first();

        $collaborator->user_id = $user->id;
        $collaborator->save();

        return response()->json(['message' => 'success', 'collaborator' => $collaborator], 200);
    }
}
