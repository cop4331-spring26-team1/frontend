# Contact Manager Small Project

## Summary
A LAMP-based contact management application with user authentication.

## Website Details

test: http://129.212.176.193/

website: https://small.liamab.com/

## Project Details

PM: Gantt Chart | Trello  
Database: MySQL | Entity Relation Diagram   
API Dev Documentation: Swagger   

## Tech Stack Used
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- API: REST-style PHP endpoints

## Project Structure

- SmallProject/
  - public/
  - LAMPAPI/
  - database/

explanation:   
public - html/js/css files  
LAMPAPI - php files for backend  
database - schema used to create DB

## Important Setup Files

Config the API urlbase

`/public/js/util.js`

Config the Database Credentials 

`/LAMPAPI/Util.php`

## Testing On Local Machine Example

1. Install XAMPP 
2. Move project to `C:\xampp\htdocs\SmallProject`
- Open **XAMPP Control Panel**  
- Click **Start** for **Apache** and **MySQL**  

1. Open phpMyAdmin in your browser:  
`http://localhost/phpmyadmin`

Create a new database

Import the schema:  
- Go to the **Import** tab  
- Upload `database/schema.sql` from the repo  
- Click **Go**  



## API

**Base URL:** `http://134.199.207.149/LAMPAPI`  
**Protocol:** All requests use `POST` with `Content-Type: application/json`.  
**Format:** All responses are returned as JSON objects.



---

## Login
`POST /Login.php`

**Payload:**
```json
{
  "login": "username",
  "password": "password"
}
```
**Response:**

Success: 
```json
{ "id": 3, "firstName": "Alice", "lastName": "Smith" }
```

Failure: 
```json
{ "id": 0 }
```

## Register   
`POST /Register.php`  
Used to create a new user account.

**Payload:**

```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "login": "username",
  "password": "password"
}
```
**Response:**

Success: {}

Failure: { "error": "Username already exists" }

## Add Contact
`POST /AddContact.php`

**Payload:**

```json
{
  "firstName": "Bob",
  "lastName": "Jones",
  "phone": "407-222-4567",
  "email": "bob@example.com",
  "userId": 3
}
```

**Response:**

Success: 
```json 
{}
```

Failure: 
```json
{ "error": "Invalid phone number" }
```

## Search Contacts
`POST /SearchContact.php`

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
```

## Get All Contacts
`POST /GetAllContact.php`

**Payload:**

```json
{
  "userId": 3
}
```
**Response:**

```json
{
  "results": [
    { "id": 5, "firstName": "Bob", "lastName": "Jones", "phone": "407-222-4567", "email": "bob@example.com" },
    { "id": 6, "firstName": "Alice", "lastName": "Smith", "phone": "407-123-4567", "email": "alice@example.com" }
  ]
}
``` 

## Update Contact
`POST /UpdateContact.php`

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

Success: 
```json
{}
```

Failure: 
```json
{ "error": "Invalid contact ID" }
```

## Delete Contact
`POST /DeleteContact.php`

**Payload:**

```json
{
  "id": 5,
  "userId": 3
}
```
**Response:**

Success: 
```json
{}
```

Failure: 
```json
{ "error": "Cannot delete contact" }
```