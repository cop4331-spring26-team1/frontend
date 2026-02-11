<?php
    $inData = getRequestInfo();

    $contactId = $inData["id"] ?? 0;
    $userId    = $inData["userId"] ?? 0;

    $contactId = intval($contactId);
    $userId    = intval($userId);

    $conn = new mysqli("localhost", "localUser", "SmallProject", "SmallProject_DB");

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        if ($contactId <= 0 || $userId <= 0)
        {
            returnWithError("Missing or invalid id/userId");
            $conn->close();
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ii", $contactId, $userId);

        if ($stmt->execute())
        {
            if ($stmt->affected_rows > 0)
            {
                returnWithSuccess();
            }
            else
            {
                returnWithError("No Records Found");
            }
        }
        else
        {
            returnWithError($stmt->error);
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithSuccess()
    {
        $retValue = '{"success":true}';
        sendResultInfoAsJson($retValue);
    }
?>
