<?php
// PHP fallback for React SPA routing
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Check if requesting an asset file
if (preg_match('/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/', $path)) {
    // Let server handle static files normally
    return false;
}

// For all other requests, serve index.html
$index_file = __DIR__ . '/index.html';
if (file_exists($index_file)) {
    // Set proper content type
    header('Content-Type: text/html; charset=UTF-8');
    readfile($index_file);
    exit;
}

// If index.html not found, show 404
http_response_code(404);
echo "Website not found. Please check deployment.";
?>