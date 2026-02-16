<?php
require_once "Util.php";

$inData = getRequestInfo();

$userId = intval($inData["userId"] ?? 0);

if ($userId <= 0) {
    sendJson([
        "results" => [],
        "error" => "Invalid userId"
    ]);
    exit();
}

$conn = getDB();

if ($conn->connect_error) {
    sendJson([
        "results" => [],
        "error" => "Database connection failed"
    ]);
    exit();
}

$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email, LastModified FROM Contacts WHERE UserID=? ORDER BY LastName ASC, FirstName ASC, ID ASC");

if (!$stmt) {
    $conn->close();
    sendJson([
        "results" => [],
        "error" => "Database error"
    ]);
    exit();
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = [
        "id" => (int)$row["ID"],
        "firstName" => $row["FirstName"],
        "lastName" => $row["LastName"],
        "phone" => $row["Phone"],
        "email" => $row["Email"],
        "lastModified" => $row["LastModified"]
    ];
}

$stmt->close();
$conn->close();

if (count($contacts) > 0) {
    sendJson([
        "results" => $contacts,
        "error" => ""
    ]);
} else {
    sendJson([
        "results" => [],
        "error" => "No Records Found"
    ]);
}
?>