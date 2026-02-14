<?php
// **CONFIG** //

// Database Credentials

$host = parse_url($_SERVER['HTTP_HOST'], PHP_URL_HOST) ?: $_SERVER['HTTP_HOST'];
$isLocal = in_array($host, ['localhost', '127.0.0.1']);

if ($isLocal) {
    // Development
    $DB_HOST = "localhost";
    $DB_USER = "root";
    $DB_PASS = ""; 
    $DB_NAME = "SmallProject_DB";
} else {
    // Production
    $DB_HOST = "localhost"; 
    $DB_USER = "localUser";
    $DB_PASS = "SmallProject";
    $DB_NAME = "SmallProject_DB";
}

// // ** DEFAULTS ** //
// // Set default content type for JSON API responses
header('Content-Type: application/json');

// ** UTILITIES ** //

// Function to get a DB connection
function getDB(){
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if ($conn->connect_error) {
        // Stop execution and return JSON error
        echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
        exit();
    }

    return $conn;
}


function getRequestInfo(){
    return json_decode(file_get_contents('php://input'), true);
}

function sendJson($data){
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit; // stops PHP from sending anything else
}

function returnWithInfo($data){
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit; // stops PHP from sending anything else
}

function returnWithError($err){
    sendJson([
        "success" => false,
        "error" => $err
    ]);
}

function returnWithSuccess($msg){
    sendJson([
        "error" => "",
        "success" => true,
        "msg" => $msg
    ]);
}






?>