# Contact Manager Small Project

## Summary
A LAMP-based contact management application with user authentication.

## Website Details

Production: http://smallproject.liamab.com/

Gasper Test: http://129.212.176.193/

Kyle Test: http://134.199.207.149

## Project Details

### Tools

Project Managment: Gantt Chart | Trello  
https://trello.com/b/fkqLTEpM/smallproject

Database: MySQL | Entity Relation Diagram  
Server: Apache
API Dev Documentation: Swaggerhub | README   

### Roles

Kyle Russell - Database Developer  
Liam Abernathy - Project Manager  
Gaspar Dantas - Frontend Developer  
Kamden Hayes - Backend Developer  
Dominic Valerio - DevSecOps   
  
Group Number: 1

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
├── test/            # Unit Testing files
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

## User Authentication & Account

### Register User

`POST /Register.php`
Registers a new account. The password is automatically secured using `PASSWORD_BCRYPT`.

**Request Body:**

```json
{
  "firstName": "Fred",
  "lastName": "Flintstone",
  "login": "fred123",
  "password": "secretPassword"
}

```

**Response (Success):**

```json
{
  "error": "",
  "success": true,
  "msg": ""
}

```

---

### Login

`POST /Login.php`
Validates credentials using `password_verify()`.

**Request Body:**

```json
{
  "login": "fred123",
  "password": "secretPassword"
}

```

**Response (Success):**

```json
{
  "id": 1,
  "firstName": "Fred",
  "lastName": "Flintstone",
  "error": "",
  "success": true
}

```

---

## Contact Management

### Add Contact

`POST /AddContact.php`
Creates a new entry in the `Contacts` table.

**Request Body:**

```json
{
  "firstName": "Barney",
  "lastName": "Rubble",
  "phone": "555-1234",
  "email": "barney@bedrock.com",
  "userId": 1
}

```

---

### Get All Contacts

`POST /GetAllContacts.php`
Retrieves the full list of contacts for a specific user, sorted by name.

**Request Body:**

```json
{
  "userId": 1
}

```

**Response (Success):**

```json
{
  "results": [
    {
      "id": 10,
      "firstName": "Barney",
      "lastName": "Rubble",
      "phone": "555-1234",
      "email": "barney@bedrock.com",
      "lastModified": "2026-02-16 12:00:00",
      "dateCreated": "2026-02-16 12:00:00"
    }
  ],
  "error": ""
}

```

---

### Search Contacts

`POST /SearchContacts.php`
Performs a fuzzy search across Name, Phone, and Email. Results are prioritized by matches in `FirstName` first, then `LastName`.

**Request Body:**

```json
{
  "userId": 1,
  "search": "Barney"
}

```

---

### Update Contact

`POST /UpdateContact.php`
Modifies an existing contact. Requires both `id` (the contact) and `userId` (the owner) for security.

**Request Body:**

```json
{
  "id": 10,
  "userId": 1,
  "firstName": "Barney",
  "lastName": "Rubble",
  "phone": "555-9999",
  "email": "barney.new@bedrock.com"
}

```

---

### Delete Contact

`POST /DeleteContact.php`
Permanently removes a contact record.

**Request Body:**

```json
{
  "id": 10,
  "userId": 1
}

```

---

### Error Handling

All endpoints return `success` and `error` fields:

```json
{
  "success": false,
  "error": "error message here"
}

```
## AI Credits

Google Gemini and ChatGPT used to help with improving security and generating documentation.