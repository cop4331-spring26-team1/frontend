# Contact Manager Small Project

## Summary
A LAMP-based contact management application with user authentication.

## Website Details

Production: https://small.liamab.com/

Test/Development: http://129.212.176.193/

## Project Details

### Tools

Project Managment: Gantt Chart | Trello  
Database: MySQL | Entity Relation Diagram   
API Dev Documentation: Swagger   

### Roles

Kyle Russell - Database Developer  
Liam Abernathy - Project Manager  
Gaspar Dantas - Frontend Developer  
Kamden Hayes - Backend Developer  
Dominic Valerio - DevSecOps  

## Tech Stack Used
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- API: REST-style PHP endpoints
- Server: Apache

## Project Structure

```text
SmallProject/
├── public/          # HTML, JS, and CSS files (Frontend)
├── LAMPAPI/         # PHP files (Backend API)
└── database/        # SQL schema used to create the DB
```

## Setup & Configuration

### Connection Strings

* **API Base URL**: Edit `/public/js/util.js` to point to your server.
* **DB Credentials**: Edit `/LAMPAPI/Util.php` with your local/server MySQL credentials.

### Local Environment (XAMPP)

* Clone the repository into `C:\xampp\htdocs\SmallProject`.
* Start **Apache** and **MySQL** via the XAMPP Control Panel.
* Import the database:
    * Open `localhost/phpmyadmin`.
    * Create a new database.
    * Go to the **Import** tab and upload `database/schema.sql`.

Once configured, you can access the user interface by navigating to:
`http://localhost/SmallProject/public/index.html`



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