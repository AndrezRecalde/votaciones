<?php

$dir = 'c:\laragon\www\elecciones2025\database\migrations';
$files = glob($dir . '\*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    if (strpos($content, '->boolean(') !== false) {
        $content = str_replace('->boolean(', '->tinyInteger(', $content);
        
        // Also if any ->default(true) or false, convert to ->default(1) or 0
        // this is optional but good practice
        $content = preg_replace('/->tinyInteger\((.*?)\)->default\(true\)/', '->tinyInteger($1)->default(1)', $content);
        $content = preg_replace('/->tinyInteger\((.*?)\)->default\(false\)/', '->tinyInteger($1)->default(0)', $content);
        
        file_put_contents($file, $content);
        echo "Updated $file\n";
    }
}
