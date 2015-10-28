CREATE DATABASE sqlessTest;

USE sqlessTest;

CREATE TABLE IF NOT EXISTS testPeople (
    personID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    age INT
);

INSERT INTO testPeople ("Bob", "Newbie", 32);

CREATE TABLE IF NOT EXISTS testThings (
    thingID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    thing VARCHAR(50),
    color VARCHAR(50)
);

INSERT INTO testThings ("ball", "yellow")