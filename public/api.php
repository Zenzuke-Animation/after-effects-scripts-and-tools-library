<?php
/**
 * After Effects Scripts & Tools Directory - cPanel PHP Database API
 * Saves catalog data to scripts.json file.
 * 
 * Deployment Instructions for cPanel:
 * 1. Upload this file (api.php) and scripts.json to your server directory (e.g., public_html/scripts).
 * 2. Ensure both this file and scripts.json have read/write permissions (usually 0644 for files, 0755 for directory).
 * 3. Change the ADMIN_PASSWORD constant below to secure your admin actions.
 */

// Allow cross-origin requests for testing during development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Password");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Return early for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ----------------- CONFIGURATION -----------------
// Change this password to whatever you want for authentication in the admin panel!
define('ADMIN_PASSWORD', 'ae-admin-123');
// -------------------------------------------------

// Determine the script data file path
$jsonFile = './scripts.json';
if (!file_exists($jsonFile) && file_exists('./data/scripts.json')) {
    $jsonFile = './data/scripts.json';
}

// Handle GET request - Retrieve Scripts List
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Content-Type: application/json; charset=UTF-8");
    if (file_exists($jsonFile)) {
        echo file_get_contents($jsonFile);
    } else {
        // If file doesn't exist yet, return empty array
        echo json_encode([]);
    }
    exit;
}

// Handle POST request - Save/Update Scripts Catalog
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Content-Type: application/json; charset=UTF-8");
    
    // Read the incoming auth password
    $headers = getallheaders();
    $password = '';
    
    // Search headers case-insensitively
    foreach ($headers as $key => $val) {
        if (strtolower($key) === 'x-admin-password') {
            $password = $val;
            break;
        }
    }
    
    // Read request body
    $inputRaw = file_get_contents('php://input');
    $inputData = json_decode($inputRaw, true);
    
    // Fallback password lookup in POST body
    if (empty($password) && isset($inputData['password'])) {
        $password = $inputData['password'];
    }
    
    // Validate Admin Password
    if ($password !== ADMIN_PASSWORD) {
        http_response_code(401);
        echo json_encode([
            "success" => false, 
            "error" => "Unauthorized: Invalid admin password."
        ]);
        exit;
    }
    
    // Extract scripts payload
    $scripts = null;
    if (isset($inputData['scripts'])) {
        $scripts = $inputData['scripts'];
    } else if (is_array($inputData) && !isset($inputData['password'])) {
        // Direct array format
        $scripts = $inputData;
    }
    
    if ($scripts === null) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "error" => "Bad Request: Missing scripts payload."
        ]);
        exit;
    }
    
    // Prevent empty file creation or writing non-arrays
    if (!is_array($scripts)) {
        http_response_code(100);
        echo json_encode([
            "success" => false,
            "error" => "Bad Request: Data must be an array of scripts."
        ]);
        exit;
    }
    
    // Attempt save to JSON file
    $encodedData = json_encode($scripts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    if (file_put_contents($jsonFile, $encodedData)) {
        echo json_encode([
            "success" => true,
            "message" => "After Effects catalog updated successfully!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Server Error: Could not write scripts.json. Verify directory permissions (chmod 0755/0644)."
        ]);
    }
    exit;
}

// Fallback response for unsupported requests
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
exit;
