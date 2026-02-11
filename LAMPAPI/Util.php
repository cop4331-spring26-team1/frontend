<?php
// **CONFIG** //

// Database credentials
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "SmallProject";

/*
// Connect to mysql server as superuser
"localhost", "localUser", "SmallProject", "SmallProject_DB" 
*/

// Function to get a DB connection
function getDB() {
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if ($conn->connect_error) {
        // Stop execution and return JSON error
        echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
        exit();
    }

    return $conn;
}

// ** UTILITIES ** //
function getRequestInfo(){
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($data){
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit; // stops PHP from sending anything else
}

function returnWithError($err){
    sendResultInfoAsJson([
        "success" => false,
        "error" => $err
    ]);
}

function returnWithSuccess(){
    sendResultInfoAsJson([
        "success" => true
    ]);
}

?>
