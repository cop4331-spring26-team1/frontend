<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "localUser", "SmallProject", "SmallProject_DB"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Get login value - check both cases (prioritize capital as per user input)
		$login = "";
		if( isset($inData["Login"]) )
		{
			$login = trim($inData["Login"]);
		}
		else if( isset($inData["login"]) )
		{
			$login = trim($inData["login"]);
		}
		
		if( $login == "" )
		{
			returnWithError("Login field is required");
		}
		
		// Get password value - check both cases (prioritize capital as per user input)
		$password = "";
		if( isset($inData["Password"]) )
		{
			$password = $inData["Password"];
		}
		else if( isset($inData["password"]) )
		{
			$password = $inData["password"];
		}
		
		if( $password == "" )
		{
			returnWithError("Password field is required");
		}
		
		// Query Users table with exact column names: Login, Password, FirstName, LastName, ID
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();

		if( $row )
		{
			// Verify password using plain text comparison
			$storedPassword = $row['Password'];
			
			if( $password === $storedPassword )
			{
				returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
			}
			else
			{
				returnWithError("Invalid Password");
			}
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

