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
    "SELECT ID, FirstName, LastName, Phone, Email, LastModified, DateCreated
         FROM Contacts
         WHERE UserID=?
            AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)
            ORDER BY
                CASE
                    WHEN FirstName LIKE ? THEN 1
                    WHEN LastName LIKE ? THEN 2
                    WHEN EMAIL LIKE ? THEN 3
                    WHEN PHONE LIKE ? THEN 4
                    ELSE 5
                END,
                LastName ASC,
                FirstName ASC"
);

if (!$stmt) {
    returnWithError($conn->error);
    $conn->close();
    exit();
}

$stmt->bind_param("issssssss", $userId, $search, $search, $search, $search, $search, $search, $search, $search);
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
        "lastModified" => $row["LastModified"],
        "dateCreated" => $row["DateCreated"]
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