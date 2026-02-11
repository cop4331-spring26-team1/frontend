<?php
require_once "Util.php";

$inData = getRequestInfo();
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

$userId = $inData["userId"] ?? 0;
$contactId = $inData["contactId"] ?? 0;

if (!is_numeric($contactId)) returnWithError("Invalid contact ID");

$stmt = $conn->prepare(
    "UPDATE Contacts
     SET FirstName=?, LastName=?, Phone=?, Email=?
     WHERE ID=? AND UserID=?"
);

$stmt->bind_param(
    "ssssii",
    $inData["firstName"],
    $inData["lastName"],
    $inData["phone"],
    $inData["email"],
    $contactId,
    $userId
);

$stmt->execute()
    ? returnWithSuccess("Contact updated")
    : returnWithError($stmt->error);

$stmt->close();
$conn->close();
?>
