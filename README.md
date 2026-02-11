# Contact Manager Small Project

## Summary
A LAMP-based contact management application with user authentication.

## Tech Stack Used
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- API: REST-style PHP endpoints

User: localUser
Pass: SmallProject

login rickl
password COP4331

http://129.212.176.193/register.html

## Project Structure

- SmallProject/
  - api/
    - Login.php
  - LAMPAPI/
    - AddContact.php
    - Login.php
  - css/
    - styles.css
  - js/
    - main.js
  - index.html
  - contacts.html
  - README.md
  - images
    - bg.jpeg

## API
Base URL: `http://134.199.207.149/LAMPAPI`  
File extension: `.php`  
All requests use `POST` with `Content-Type: application/json`.  
Responses are JSON.

Apache Server

### Endpoints



---

### Login
**Endpoint:** `/LAMPAPI/Login.php`  
**Payload:**
```json
{
  "login": "username",
  "password": "password"
}
```
**Response:**
```json
// Success
{
  "id": 3,
  "firstName": "Alice",
  "lastName": "Smith"
}

// Failure
{
  "id": 0
}
```


### Register

Endpoint: `/LAMPAPI/Register.php`  
**Payload:**
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "login": "username",
  "password": "password"
}
```
**Response**
```json
// Success
{}

// Failure
{
  "error": "Username already exists"
}
```

### Add Contact

Endpoint: `/LAMPAPI/AddContact.php`  
Payload:
```json
{
  "firstName": "Bob",
  "lastName": "Jones",
  "phone": "407-222-4567",
  "email": "bob@example.com",
  "userId": 3
}
```


Response:
```json
// Success
{}

// Failure
{
  "error": "Invalid phone number"
}
```

### Search Contacts

Endpoint: `/LAMPAPI/SearchContacts.php`  
**Payload:**
```json
{
  "search": "Bob",
  "userId": 3
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 5,
      "firstName": "Bob",
      "lastName": "Jones",
      "phone": "407-222-4567",
      "email": "bob@example.com"
    }
  ]
}

// Failure
{
  "error": "No contacts found"
}
```

### Get All Contacts

Endpoint: `/LAMPAPI/GetAllContacts.php`  
**Payload:**
```json
{
  "userId": 3
}
```

**Response:**

```json
// Success
{
  "results": [
    {
      "id": 5,
      "firstName": "Bob",
      "lastName": "Jones",
      "phone": "407-222-4567",
      "email": "bob@example.com"
    },
    {
      "id": 6,
      "firstName": "Alice",
      "lastName": "Smith",
      "phone": "407-123-4567",
      "email": "alice@example.com"
    }
  ]
}


// Failure
{
  "error": "No contacts yet"
}
```

## Update Contact

Endpoint: `/LAMPAPI/UpdateContact.php`  
**Payload:**
```json
{
  "id": 5,
  "firstName": "Robert",
  "lastName": "Jones",
  "phone": "407-222-4567",
  "email": "robert@example.com",
  "userId": 3
}
```

**Response:**
```json
// Success
{}

// Failure
{
  "error": "Invalid contact ID"
}
```

### Delete Contact

Endpoint: `/LAMPAPI/DeleteContact.php`  
**Payload:**
```json
{
  "id": 5,
  "userId": 3
}
```

**Response:**
```json
// Success
{}

// Failure
{
  "error": "Cannot delete contact"
}
```