<?php
require_once "Util.php";

// Get Login Info
$inData = getRequestInfo();
$login = $inData['login'] ?? '';
$password = $inData['password'] ?? '';

// Initialize return values
$id = 0;
$firstName = "";
$lastName = "";

// Get DB
$conn = getDB();
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Look up the user by username only
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Check password against the hash
        if (password_verify($password, $row['Password'])) {
            $id = $row['ID'];
            $firstName = $row['FirstName'];
            $lastName = $row['LastName'];

            $retValue = array(
                "id" => $id,
                "firstName" => $firstName,
                "lastName" => $lastName,
                "error" => "",
				"success" => true
            );

            sendJson($retValue);
        } else {
            returnWithError("Invalid password");
        }
    } else {
        returnWithError("No records found");
    }

    $stmt->close();
    $conn->close();
}
?>
