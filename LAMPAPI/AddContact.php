<?php
require_once "Util.php";

$inData = getRequestInfo();

// Get Contact Data from Frontend
$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$phone = $inData["phone"] ?? "";
$email = $inData["email"] ?? "";

$userId = $inData["userId"] ?? 0;

// Validate all fields
$errors = [];

if ($firstName === "") {
    $errors[] = "First name is required";
}

if ($lastName === "") {
    $errors[] = "Last name is required";
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address";
}

// Validate userId
if (!is_numeric($userId) || $userId <= 0) {
    $errors[] = "Invalid user ID";
}

if (!empty($errors)) {
    echo json_encode(["error" => implode("; ", $errors)]);
    exit;
}

// Connect to db
$conn = getDB();

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Insert new Contact into Contacts table in SmallProject-DB
    $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserId) VALUES(?,?,?,?,?)");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);

    if ($stmt->execute()) {
        returnWithSuccess();
    } else {
        returnWithError($stmt->error);
    }

    $stmt->close();
    $conn->close();
}
?>