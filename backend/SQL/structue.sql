-- Active: 1757502370623@@localhost@3306@sipscore
DROP DATABASE IF EXISTS sipscore;

CREATE DATABASE sipscore;

USE sipscore;

CREATE TABLE Typ (
    Typ_Id INT PRIMARY KEY AUTO_INCREMENT,
    Typ VARCHAR(100) NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE
);

CREATE TABLE Getraenk (
    Getraenk_Id INT PRIMARY KEY AUTO_INCREMENT,
    Typ_Id INT NOT NULL,
    Startgravitation DECIMAL(4, 3) NOT NULL,
    BeginnFermentation DATE NOT NULL,
    Abfuellung DATE NOT NULL,
    Beschreibung VARCHAR(500) NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Typ_Id) REFERENCES Typ (Typ_Id)
);

CREATE TABLE Benutzer (
    Benutzer_Id INT PRIMARY KEY AUTO_INCREMENT,
    Vorname VARCHAR(100) NOT NULL,
    Nachname VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Benutzername VARCHAR(100) NOT NULL,
    Passwort VARCHAR(100) NOT NULL,
    Rolle BIT(2) NOT NULL, -- 00 = Admin, 01 = Brauer, 10 = Verifizierter Benutzer, 11 = Benutzer
    Code CHAR(6),
    Verifiziert BOOLEAN DEFAULT FALSE,
    Geloescht BOOLEAN DEFAULT FALSE
);

CREATE TABLE Bewertung (
    Bewertung_Id INT PRIMARY KEY AUTO_INCREMENT,
    Getraenk_Id INT NOT NULL,
    Benutzer_Id INT NOT NULL,
    Bewertung INT NOT NULL,
    Kommentar VARCHAR(500),
    Datum DATE NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Getraenk_Id) REFERENCES Getraenk (Getraenk_Id),
    FOREIGN KEY (Benutzer_Id) REFERENCES Benutzer (Benutzer_Id)
);

CREATE TABLE Zutat (
    Zutat_Id INT PRIMARY KEY AUTO_INCREMENT,
    Zutat VARCHAR(100) NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE
);

CREATE TABLE Rezept (
    Rezept_Id INT PRIMARY KEY AUTO_INCREMENT,
    Getraenk_Id INT NOT NULL,
    Zutat_Id INT NOT NULL,
    Menge VARCHAR(20) NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE
);

CREATE TABLE Geschmack (
    Geschmack_Id INT PRIMARY KEY AUTO_INCREMENT,
    Geschmack VARCHAR(100) NOT NULL,
    Geloescht BOOLEAN DEFAULT FALSE
);

CREATE TABLE Getraenk_Geschmack (
    Getraenk_Geschmack_Id INT PRIMARY KEY AUTO_INCREMENT,
    Getraenk_Id INT NOT NULL,
    Geschmack_Id INT NOT NULL,
    FOREIGN KEY (Getraenk_Id) REFERENCES Getraenk (Getraenk_Id),
    FOREIGN KEY (Geschmack_Id) REFERENCES Geschmack (Geschmack_Id)
);

/*CREATE TABLE Idee (
Idee_Id INT PRIMARY KEY AUTO_INCREMENT,
Benutzer_Id INT NOT NULL,
Typ_Id INT NOT NULL,
Status BIT(2) NOT NULL, -- 00 Neu, 01 Akzeptiert, 10 Gemacht, 11 Abgelehnt
Geloescht BOOLEAN DEFAULT FALSE,
FOREIGN KEY (Benutzer_Id) REFERENCES Benutzer (Benutzer_Id),
FOREIGN KEY (Typ_Id) REFERENCES Typ (Typ_Id)
);

CREATE TABLE Idee_Geschmack (
Idee_Geschmack_Id INT PRIMARY KEY AUTO_INCREMENT,
Idee_Id INT NOT NULL,
Geschmack_Id INT NOT NULL,
FOREIGN KEY (Idee_Id) REFERENCES Idee (Idee_Id),
FOREIGN KEY (Geschmack_Id) REFERENCES Geschmack (Geschmack_Id)
)*/