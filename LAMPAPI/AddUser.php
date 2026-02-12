<?php
    die("TEST FILE: " . __FILE__);
    $inData = getRequestInfo();
    
    // Get Contact Data from Frontend
    $firstName = $inData["firstName"] ?? "";
    $lastName = $inData["lastName"] ?? "";
    $username = $inData["login"] ?? "";
    $password = $inData["password"] ?? "";
    
    // Connect to mysql server as superuser
    $conn = new mysqli("localhost", "localUser", "SmallProject", "SmallProject_DB");

    if($conn -> connect_error){
        returnWithError($conn -> connect_error);
    }
    else{
        // Insert new User into Users table in SmallProject_DB
        $stmt = $conn -> prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
        $stmt -> bind_param("ssss", $firstName, $lastName, $username, $password);

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