<?php
// List all contacts
header("Content-Type: application/json");

$inData = getRequestInfo();
if ($inData === null) {
	returnWithError("Invalid JSON");
}

$userId = isset($inData["userId"]) ? (int)$inData["userId"] : 0;
if ($userId < 1) {
	returnWithError("Missing userId");
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError("Database connection failed");
}

$conn->set_charset("utf8mb4");

$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? ORDER BY LastName ASC, FirstName ASC, ID ASC");
if (!$stmt) {
	$conn->close();
	returnWithError("Database error");
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
	$rows[] = [
		"id" => (int)$row["ID"],
		"firstName" => $row["FirstName"],
		"lastName" => $row["LastName"],
		"phone" => $row["Phone"],
		"email" => $row["Email"]
	];
}

$stmt->close();
$conn->close();

if (count($rows) === 0) {
	sendResultInfoAsJson(["results" => [], "error" => "No Records Found"]);
}

sendResultInfoAsJson(["results" => $rows, "error" => ""]);

function getRequestInfo()
{
	$raw = file_get_contents("php://input");
	return json_decode($raw, true);
}

function sendResultInfoAsJson($obj)
{
	echo json_encode($obj);
	exit();
}

function returnWithError($err)
{
	sendResultInfoAsJson(["results" => [], "error" => $err]);
}
