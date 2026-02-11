<?php
require_once "Util.php";

// Parse incoming JSON data for POST/PUT/DELETE
$inData = getRequestInfo();

// Connect to DB
$conn = getDB();
if ($conn->connect_error) returnWithError($conn->connect_error);

// Determine HTTP method
$method = $_SERVER['REQUEST_METHOD'];
$userId = $inData["userId"] ?? 0;
if (!is_numeric($userId) || $userId <= 0) returnWithError("Invalid user ID");

switch ($method) {

    case "POST":  // Add new contact
        $firstName = trim($inData["firstName"] ?? "");
        $lastName  = trim($inData["lastName"] ?? "");
        $phone     = trim($inData["phone"] ?? "");
        $email     = trim($inData["email"] ?? "");

        if ($firstName === "" || $lastName === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            returnWithError("Missing or invalid fields");
        }

        $stmt = $conn->prepare(
            "INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
        $stmt->execute() ? returnWithSuccess() : returnWithError($stmt->error);
        $stmt->close();
        break;

    case "PUT":  // Update existing contact
        $contactId = $inData["contactId"] ?? 0;
        if (!is_numeric($contactId) || $contactId <= 0) returnWithError("Invalid contact ID");

        $firstName = trim($inData["firstName"] ?? "");
        $lastName  = trim($inData["lastName"] ?? "");
        $phone     = trim($inData["phone"] ?? "");
        $email     = trim($inData["email"] ?? "");

        $stmt = $conn->prepare(
            "UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?"
        );
        $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);
        $stmt->execute() ? returnWithSuccess() : returnWithError($stmt->error);
        $stmt->close();
        break;

    case "DELETE":  // Delete contact
        $contactId = $inData["contactId"] ?? 0;
        if (!is_numeric($contactId) || $contactId <= 0) returnWithError("Invalid contact ID");

        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ii", $contactId, $userId);
        $stmt->execute() ? returnWithSuccess() : returnWithError($stmt->error);
        $stmt->close();
        break;

    case "GET":  // Search or list all
        $search = $_GET["search"] ?? "";
        if ($search === "") {
            // List all contacts
            $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=?");
            $stmt->bind_param("i", $userId);
        } else {
            // Search contacts
            $stmt = $conn->prepare(
                "SELECT ID, FirstName, LastName, Phone, Email FROM Contacts 
                 WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)"
            );
            $like = "%$search%";
            $stmt->bind_param("issss", $userId, $like, $like, $like, $like);
        }
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        echo json_encode(["results" => $result]);
        $stmt->close();
        break;

    default:
        returnWithError("Unsupported HTTP method");
}

$conn->close();
?>
