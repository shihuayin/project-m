# Learning Notes System

This is a web-based application that helps users efficiently manage their study notes. Users can create, edit, delete, and search for notes, track their study progress, and even check the weather for specific locations. The application is built using Node.js, Express.js, MySQL, and EJS.

---

## Features

- Users can register and log in.
- Once logged in, users can add, edit, delete, and search for notes.
- Track notes by category and week.
- Geolocation: Add location data to notes.
- Check the weather for specific cities.

---

## Setup Instructions

### 1. Install Dependencies

Run the following command to install the required dependencies:

npm install

### 2. Set Up the MySQL Database

Install MySQL and start the MySQL service.
Use the following SQL script to create the database and tables:

USE daw_learn_notes;

CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(50) UNIQUE NOT NULL,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
hashed_password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
category VARCHAR(100) NOT NULL,
week VARCHAR(20) NOT NULL,
latitude FLOAT,
longitude FLOAT,
location_name VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

### 3. Start the Server

Run the following command to start the application:
node index.js

---

Enjoy using the Learning Notes System！
