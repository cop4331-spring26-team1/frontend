<?php
require_once "Util.php";

$inData = getRequestInfo();
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

$userId = $inData["userId"] ?? 0;
$contactId = $inData["contactId"] ?? 0;

$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
$stmt->bind_param("ii", $contactId, $userId);

$stmt->execute()
    ? returnWithSuccess("Deleted")
    : returnWithError($stmt->error);

$stmt->close();
$conn->close();
?>
