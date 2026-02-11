<?php
require_once "Util.php";

$inData = getRequestInfo();
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

$userId = $inData["userId"] ?? 0;
$search = $inData["search"] ?? "";

$like = "%$search%";

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email
     FROM Contacts
     WHERE UserID=? AND
     (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)"
);

$stmt->bind_param("issss", $userId, $like, $like, $like, $like);
$stmt->execute();

$result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
sendJson(["results" => $result]);

$stmt->close();
$conn->close();
?>
