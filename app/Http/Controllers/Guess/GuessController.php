<?php

namespace App\Http\Controllers\Guess;

use App\Enums\HTTPStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\GuessRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Guess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuessController extends Controller
{
    function getGuesses(): JsonResponse
    {
        $guesses = Guess::get(['id', 'nombres_completos', 'telefono', 'codigo', 'activo']);

        return response()->json(
            [
                'status' => HTTPStatus::Success,
                'guesses' => $guesses
            ],
            200
        );
    }

    function store(GuessRequest $request): JsonResponse
    {
        try {
            Guess::create($request->validated());
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Creacion], 201);
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    function update(GuessRequest $request, int $id): JsonResponse
    {
        $guess = Guess::find($id);
        try {
            if ($guess) {
                $guess->update($request->validated());
                return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
            } else {
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    function destroy(int $id): JsonResponse
    {
        $guess = Guess::find($id);
        try {
            if ($guess) {
                $guess->delete();
                return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Eliminado], 200);
            } else {
                return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => $th->getMessage()], 500);
        }
    }

    function updateActivo(StatusRequest $request, int $id): JsonResponse
    {
        $guess = Guess::find($id);
        if ($guess) {
            $guess->update($request->validated());
            return response()->json(['status' => HTTPStatus::Success, 'msg' => HTTPStatus::Actualizado], 201);
        } else {
            return response()->json(['status' => HTTPStatus::Error, 'msg' => HTTPStatus::NotFound], 404);
        }
    }
}
