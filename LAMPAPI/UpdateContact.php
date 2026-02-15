<?php
    require_once "Util.php";

    $inData = getRequestInfo();

    $contactId = intval($inData["id"] ?? 0);
    $userId = intval($inData["userId"] ?? 0);
    $firstName = $inData["firstName"] ?? "";
    $lastName = $inData["lastName"] ?? "";
    $phone = $inData["phone"] ?? "";
    $email = $inData["email"] ?? "";

    if($contactId <= 0 || $userId <= 0){
        returnWithError("Missing or invalid contact ID or user ID");
        exit();
    }

    if(empty($firstName) || empty($lastName) || empty($phone) || empty($email)){
        returnWithError("All fields are required");
        exit();
    }

    $conn = getDB();
    if($conn->connect_error){
        returnWithError("Database connection failed.");
        exit();
    }

    $stmt = $conn->prepare(
        "Update Contacts set FirstName = ?, LastName = ?, Phone = ?, Email = ? Where ID = ? and UserID = ?"
    );

    if(!$stmt){
        returnWithError("Database error");
        $conn->close();
        exit();
    }

    $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);

    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            returnWithSuccess("Contact updated successfully");
        }
        else{
            returnWithError("Contact not found");
        }
    }
    else{
        returnWithError("Fauled to update contact");
    }

    $stmt->close();
    $conn->close();
?>