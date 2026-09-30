CREATE DATABASE IF NOT EXISTS hershield CHARACTER SET utf8mb4;
USE hershield;

-- Users Clerk me rehte hain; yahan sirf clerk_id (user_xxx) store hota hai.
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  relationship VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (clerk_id)
);

CREATE TABLE IF NOT EXISTS sos_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(64) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  token CHAR(32) NOT NULL UNIQUE,          -- public tracking link ka random token
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  status ENUM('active','ended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  INDEX (clerk_id)
);

CREATE TABLE IF NOT EXISTS area_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clerk_id VARCHAR(64) NOT NULL,
  area_name VARCHAR(150) NOT NULL,
  tag ENUM('safe','unsafe','lighting','crowded','police') NOT NULL,
  rating TINYINT NOT NULL,
  review VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
