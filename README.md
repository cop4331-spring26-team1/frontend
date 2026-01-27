# Contact Manager Small Project

## Summary
A LAMP-based contact management application with user authentication.

## Tech Stack Used
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- API: REST-style PHP endpoints

## Project Structure

- SmallProject/
  - api/
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

UrlBase https://small.liamab.com/api

#### /Login.php 

method: POST  

example response:   
```json
{  
  "id":4,  
  "firstName":"John",  
  "lastName":"Doe",  
  "error":"Login field is required"  
}  
```
  