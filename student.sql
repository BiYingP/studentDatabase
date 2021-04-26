CREATE DATABASE IF NOT EXISTS lab;
USE lab;

DROP TABLE IF EXISTS students;
CREATE TABLE students (     
    studentID VARCHAR(20) key,
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    dateOfBirth DATE,
    major VARCHAR(20)
    );
    
DROP TABLE IF EXISTS course;
CREATE TABLE course (
    courseID VARCHAR(20) key,
    courseDescription VARCHAR(100)
    );
    
DROP TABLE IF EXISTS grades;
CREATE TABLE grades (
    studentID VARCHAR(20),
    courseID VARCHAR(20),
    term VARCHAR(20),
    grade VARCHAR(20),
    CONSTRAINT FK_students FOREIGN KEY (studentID)
    REFERENCES students(studentID),
    CONSTRAINT FK_course FOREIGN KEY (courseID)
    REFERENCES course(courseID),
    UNIQUE KEY courseID (courseID, studentID, term) 
    );
    
INSERT INTO students
( studentId, firstName, lastName, dateOfBirth, major)
VALUES
('as32', 'Angel', 'Smith', '1987-03-20', 'CS'),   
('jj90', 'Jay', 'Jou', '1987-03-03', 'CS'), 
('jt18', 'Joe', 'Tyler', '1987-02-14', 'CS'),
('sm18', 'Steve','Miller', '1987-05-18', 'IS'),
('st01', 'Scott', 'Tim', '1987-06-12', 'CE'),
('th51', 'Tina', 'Huan', '1986-09-13', 'IS');

INSERT INTO course
( courseID, courseDescription )
VALUES
('cs260', 'Data Structure'),
('cs265', 'Advanced Progromming Techniques'),
('cs275', 'Web and Mobile app Development');

INSERT INTO grades
( studentID, courseID, term, grade )
VALUES
('st01', 'cs275', 'Su18', 'A'),
('st01', 'cs265', 'Sp17', 'B'),
('st01', 'cs260', 'Su18', 'B'),
('st01', 'cs260', 'Wi17', 'B'),
('st01', 'cs275', 'Wi17', 'B'),
('sm18', 'cs260', 'Su18', 'A'),
('sm18', 'cs275', 'Su18', 'A'),
('sm18', 'cs260', 'Wi17', 'A'), 
('sm18', 'cs265', 'Fa17', 'B'),
('jt18', 'cs275', 'Su18', 'A'),
('jt18', 'cs260', 'Wi17', 'A'),
('jt18', 'cs275', 'Wi17', 'A'),
('jt18', 'cs265', 'Wi17', 'B'),
('as32', 'cs275', 'Wi17', 'A'),
('as32', 'cs260', 'Wi17', 'A'),
('as32', 'cs260', 'Su18', 'A'),
('as32', 'cs265', 'Wi17', 'B'),
('as32', 'cs265', 'Fa17', 'B'),
('jj90', 'cs265', 'Fa17', 'A'),
('jj90', 'cs275', 'Fa17', 'A'), 
('jj90', 'cs260', 'Wi17', 'B');
