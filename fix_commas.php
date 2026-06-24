<?php

function fixCommas($dir) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }

        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            fixCommas($path);
        } elseif (pathinfo($path, PATHINFO_EXTENSION) === 'php') {
            $content = file_get_contents($path);
            $newContent = str_replace(',,', ',', $content);
            if ($content !== $newContent) {
                file_put_contents($path, $newContent);
                echo "Fixed commas in: $path\n";
            }
        }
    }
}

fixCommas(__DIR__ . '/app/Http/Controllers');
echo "Done.\n";
