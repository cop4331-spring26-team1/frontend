<?php
require_once "Util.php";

$inData = getRequestInfo();
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

$userId = $inData["userId"] ?? 0;

$firstName = trim($inData["firstName"] ?? "");
$lastName  = trim($inData["lastName"] ?? "");
$phone     = trim($inData["phone"] ?? "");
$email     = trim($inData["email"] ?? "");

if ($firstName === "" || $lastName === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    returnWithError("Invalid fields");
}

$stmt = $conn->prepare(
    "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID)
     VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);

$stmt->execute()
    ? returnWithSuccess("Contact added")
    : returnWithError($stmt->error);

$stmt->close();
$conn->close();
?>
