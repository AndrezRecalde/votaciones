<?php

$dir = __DIR__ . '/app/Http/Controllers';

function processDirectory($dir) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            processDirectory($path);
        } elseif (pathinfo($path, PATHINFO_EXTENSION) === 'php') {
            refactorFile($path);
        }
    }
}

function refactorFile($path) {
    $content = file_get_contents($path);
    $originalContent = $content;

    // We will do a generic replacement of `return response()->json([ ... ], code);`
    // to `return $this->successResponse($data, $message, $code);`

    // Pattern for SUCCESS with data and status
    // return response()->json(['status' => HTTPStatus::Success, 'dignidades' => $dignidades], 200);
    $content = preg_replace(
        '/return\s+response\(\)->json\(\s*\[\s*[\'"]status[\'"]\s*=>\s*HTTPStatus::Success\s*,\s*[\'"]([a-zA-Z0-9_]+)[\'"]\s*=>\s*(.+?)\s*\]\s*,\s*(\d{3})\s*\);/s',
        'return $this->successResponse($2, null, $3);',
        $content
    );

    // Pattern for SUCCESS with msg only
    // return response()->json(['status' => HTTPStatus::Success, 'msg' => '...'], 201);
    $content = preg_replace(
        '/return\s+response\(\)->json\(\s*\[\s*[\'"]status[\'"]\s*=>\s*HTTPStatus::Success\s*,\s*[\'"]msg[\'"]\s*=>\s*(.+?)\s*\]\s*,\s*(\d{3})\s*\);/s',
        'return $this->successResponse(null, $1, $2);',
        $content
    );

    // Pattern for ERROR with msg only
    // return response()->json(['status' => HTTPStatus::Error, 'msg' => $e->getMessage()], 500);
    $content = preg_replace(
        '/return\s+response\(\)->json\(\s*\[\s*[\'"]status[\'"]\s*=>\s*HTTPStatus::(?:Error|NotFound|Info)\s*,\s*[\'"]msg[\'"]\s*=>\s*(.+?)\s*\]\s*,\s*(\d{3})\s*\);/s',
        'return $this->errorResponse($1, $2);',
        $content
    );

    // Pattern for ERROR with 'message' instead of 'msg'
    $content = preg_replace(
        '/return\s+response\(\)->json\(\s*\[\s*[\'"]message[\'"]\s*=>\s*(.+?)\s*\]\s*,\s*(\d{3})\s*\);/s',
        'return $this->errorResponse($1, $2);',
        $content
    );

    if ($content !== $originalContent) {
        file_put_contents($path, $content);
        echo "Refactored: $path\n";
    }
}

processDirectory($dir);
echo "Refactor complete.\n";
