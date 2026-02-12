<?php
require_once "Util.php";

$inData = getRequestInfo();
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

$userId = $inData["userId"] ?? 0;

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email
     FROM Contacts WHERE UserID=?"
);
$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
sendJson(["results" => $result, "success" => true]);

$stmt->close();
$conn->close();
?>
