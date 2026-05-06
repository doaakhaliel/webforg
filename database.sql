CREATE DATABASE IF NOT EXISTS webforg_db;
USE webforg_db;

CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  duration VARCHAR(50),
  instructor VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  students INT DEFAULT 0,
  lessons_count INT DEFAULT 0,
  price INT DEFAULT 0,
  image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT,
  title VARCHAR(255),
  content TEXT,
  `order` INT,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT INTO courses (title, description, level, duration, instructor, rating, students, lessons_count, price, image_url) VALUES
('React Mastery', 'Master React from basics to advanced concepts with hands-on projects', 'intermediate', '24 hours', 'Ahmed Hassan', 4.9, 15420, 48, 99, 'https://picsum.photos/id/106/300/200'),
('Python for Beginners', 'Start your programming journey with Python fundamentals', 'beginner', '18 hours', 'Sarah Mohamed', 4.8, 28500, 36, 0, 'https://picsum.photos/id/20/300/200'),
('Advanced TypeScript', 'Deep dive into TypeScript advanced patterns and best practices', 'advanced', '20 hours', 'Omar Khalil', 4.9, 8900, 40, 129, 'https://picsum.photos/id/26/300/200'),
('Node.js Backend', 'Build scalable backend applications with Node.js and Express', 'intermediate', '22 hours', 'Fatima Ali', 4.7, 12300, 44, 89, 'https://picsum.photos/id/0/300/200'),
('CSS & Tailwind Mastery', 'Create beautiful responsive designs with modern CSS and Tailwind', 'beginner', '16 hours', 'Mohammed Ibrahim', 4.8, 19800, 32, 0, 'https://picsum.photos/id/1/300/200'),
('Full Stack Development', 'Complete full stack development with React, Node.js, and MongoDB', 'advanced', '40 hours', 'Layla Ahmed', 4.9, 6500, 80, 199, 'https://picsum.photos/id/155/300/200');

INSERT INTO lessons (course_id, title, content, `order`) VALUES
(1, 'Introduction to React', 'What is React and why use it?', 1),
(1, 'Components & Props', 'Understanding components and props', 2),
(1, 'State & Lifecycle', 'Managing state and lifecycle methods', 3);