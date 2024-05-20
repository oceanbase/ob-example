CREATE DATABASE IF NOT EXISTS test;
USE test;
DROP TABLE IF EXISTS user;
CREATE TABLE user
(
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

INSERT INTO user (name)
VALUES ('Bruce');
INSERT INTO user (name)
VALUES ('Jack');
INSERT INTO user (name)
VALUES ('Tom');
