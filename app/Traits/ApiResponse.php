<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Build a success response.
     *
     * @param  mixed  $data
     * @param  string|null  $message
     * @param  int  $code
     * @param  array  $meta
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data, ?string $message = null, int $code = 200, array $meta = []): JsonResponse
    {
        if ($data instanceof \Illuminate\Pagination\LengthAwarePaginator || $data instanceof \Illuminate\Pagination\CursorPaginator) {
            $meta = array_merge([
                'current_page' => $data->currentPage(),
                'last_page' => method_exists($data, 'lastPage') ? $data->lastPage() : null,
                'per_page' => $data->perPage(),
                'total' => method_exists($data, 'total') ? $data->total() : null,
            ], $meta);

            $data = $data->items();
        }

        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code);
    }

    /**
     * Build an error response.
     *
     * @param  string  $message
     * @param  int  $code
     * @param  mixed  $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse(string $message, int $code, $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data
        ], $code);
    }
}
