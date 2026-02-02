<?php
    $inData = getRequestInfo();
    
    // Get Contact Data from Frontend
    $firstName = $inData["firstName"] ?? "";
    $lastName = $inData["lastName"] ?? "";
    $phone = $inData["phone"] ?? "";
    $email = $inData["email"] ?? "";

    $userId = $inData["userId"] "" 0;
    
    // Connect to mysql server as superuser
    $conn = new mysqli("localhost", "localUser", "SmallProject", "SmallProject-DB");

    if($conn -> connect_error){
        returnWithError($conn -> connect_error);
    }
    else{
        // Insert new Contact into Contacts table in SmallProject-DB
        $stmt = $conn -> prepare("INSERT into Contacts (firstName, lastName, phone, email, userId) VALUES(?,?,?,?,?)");
        $stmt -> bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);

        if($stmt -> execute()){
            returnWithSuccess();
        }
        else{
            returnWithError($stmt -> error);
        }

        $stmt -> close();
        $conn -> close();
    }



    // Helper Functions
    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj){
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err){
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess(){
        $retValue = '{"success":true}';
        sendResultInfoAsJson($retValue);
    }
?>