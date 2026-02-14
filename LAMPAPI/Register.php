<?php
require_once "Util.php";

$inData = getRequestInfo();

// Get Contact Data from Frontend
$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$username = $inData["login"] ?? "";
$password = $inData["password"] ?? "";

// Connect to mysql server as superuser
$conn = getDB();

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Insert new User into Users table in SmallProject_DB
    $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
    $stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

    if ($stmt->execute()) {
        returnWithSuccess("");
    } else {
        returnWithError($stmt->error);
    }

    $stmt->close();
    $conn->close();
}
?>