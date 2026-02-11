<?php

require_once "Util.php";

// Get User Regestration info
$inData = getRequestInfo();

$firstName = trim($inData["firstName"] ?? "");
$lastName = trim($inData["lastName"] ?? "");
$username = trim($inData["username"] ?? "");
$password = trim($inData["password"] ?? "");

// Check they have all fields / Validation
if (!$firstName || !$lastName || !$username || !$password) {
    returnWithError("All fields are required.");
}

$conn = getDB();
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
}

// Check if username already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    $conn->close();
    returnWithError("Username already taken.");
}
$stmt->close();

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $username, $hashedPassword);

if ($stmt->execute()) {
    returnWithSuccess();
} else {
    returnWithError($stmt->error);
}

$stmt->close();
$conn->close();
?>