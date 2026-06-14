-- HOSTELLOOM Database Schema
-- Bapatla Pharmacy Ladies Hostel - BAPATLA_522101

CREATE DATABASE IF NOT EXISTS hostelloom;
USE hostelloom;

-- Admin/Staff users (login: mail id + password)
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student auth (login: regd_no + password)
CREATE TABLE student_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students - full registration details
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  student_phone VARCHAR(20),
  father_phone VARCHAR(20),
  mother_phone VARCHAR(20),
  address TEXT,
  aadhaar_no VARCHAR(20),
  blood_group VARCHAR(10),
  caste VARCHAR(100),
  religion VARCHAR(100),
  branch VARCHAR(50),
  year INT,
  payment_status VARCHAR(20) DEFAULT 'UNPAID',
  dob DATE,
  category VARCHAR(50),
  veg_nonveg VARCHAR(20),
  photo_url VARCHAR(500),
  parent_signature_url VARCHAR(500),
  student_signature_url VARCHAR(500),
  photo_base64 LONGTEXT,
  student_signature_base64 LONGTEXT,
  created_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(20) UNIQUE NOT NULL,
  beds INT DEFAULT 4,
  cots INT,
  fans INT,
  tube_lights INT,
  chairs INT,
  dustbin INT,
  washrooms VARCHAR(20),
  foot_stand INT,
  mirrors INT,
  shelf INT,
  max_sharing INT,
  bed_lights INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room allotment
CREATE TABLE room_allotments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL,
  regd_no VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  bed_number VARCHAR(10),
  allotted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_room_bed (room_number, bed_number),
  FOREIGN KEY (room_number) REFERENCES rooms(room_number) ON DELETE CASCADE
);

-- Outing requests
CREATE TABLE outing_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  room_no VARCHAR(20),
  branch VARCHAR(50),
  year INT,
  outing_type ENUM('home','local') NOT NULL,
  purpose TEXT,
  from_date DATETIME NOT NULL,
  to_date DATETIME NOT NULL,
  phone VARCHAR(20),
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mess bills
CREATE TABLE mess_bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  year_branch VARCHAR(20),
  room_no VARCHAR(20),
  month_year VARCHAR(20),
  staying_days INT,
  mess_amount DECIMAL(10,2),
  old_due DECIMAL(10,2) DEFAULT 0,
  fine DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mess menu - weekly menu by day
CREATE TABLE mess_menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_name VARCHAR(10) NOT NULL,
  breakfast TEXT,
  lunch TEXT,
  snacks TEXT,
  dinner TEXT,
  UNIQUE KEY unique_day (day_name)
);

-- Doctor visits
CREATE TABLE doctor_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) NOT NULL,
  student_name VARCHAR(255),
  room_no VARCHAR(20),
  year_branch VARCHAR(50),
  reason TEXT,
  prescription TEXT,
  visit_date DATE,
  visit_time TIME,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workers
CREATE TABLE workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  designation VARCHAR(100),
  working_timings VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complaints
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regd_no VARCHAR(50) NOT NULL,
  room_no VARCHAR(20),
  student_name VARCHAR(255),
  problem TEXT NOT NULL,
  complaint_date DATE,
  status ENUM('pending','solved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor schedule (availability)
CREATE TABLE doctor_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_name VARCHAR(20) NOT NULL,
  available BOOLEAN DEFAULT true,
  time_slot VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
