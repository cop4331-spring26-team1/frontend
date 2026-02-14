<?php
require_once "Util.php";

$inData = getRequestInfo();

$search = $inData["search"] ?? "";
$userId = intval($inData["userId"] ?? 0);

$conn = getDB();

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

if ($userId <= 0) {
    returnWithError("Invalid userId");
    $conn->close();
    exit();
}

$search = "%" . $search . "%";

$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email
         FROM Contacts
         WHERE UserID=?
           AND (FirstName LIKE ? OR LastName LIKE ?)"
);

if (!$stmt) {
    returnWithError($conn->error);
    $conn->close();
    exit();
}

$stmt->bind_param("iss", $userId, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

if (count($contacts) > 0)
    returnWithInfo($contacts);
else
    returnWithError("No Records Found");

$stmt->close();
$conn->close();
?>