INSERT INTO
    benutzer (
        Vorname,
        Nachname,
        Email,
        Benutzername,
        Passwort,
        Rolle,
        Verifiziert
    )
VALUES (
        'Aaron',
        'Hellmüller',
        'hellmulleraaron@gmail.com',
        'ueHelli',
        '$2b$10$y7dSWw6ZMdRAh380vdM3XebK6M0OJ3q9TgyicMnci4AHptq5QSjZi',
        b'00',
        TRUE
    ),
    (
        'Max',
        'Mustermann',
        'max.mustermann@gmail.com',
        'maxi',
        '$2b$10$yaASNFWU1UpPqSMZH9Rw4.CF5eaB5k/MN/G0DbCjniuQUYZ8TlnLS',
        b'11',
        TRUE
    );

-- Typen
INSERT INTO Typ (Typ) VALUES ('Bier'), ('Wein'), ('Cider');

-- Geschmäcker
INSERT INTO
    Geschmack (Geschmack)
VALUES ('Süß'),
    ('Herb'),
    ('Fruchtig'),
    ('Sauer');

-- Getränke
INSERT INTO
    Getraenk (
        Typ_Id,
        Startgravitation,
        BeginnFermentation,
        Abfuellung,
        Alkoholgehalt,
        Lager,
        Beschreibung
    )
VALUES (
        1,
        1.050,
        '2024-01-01',
        '2024-03-01',
        5.2,
        10,
        'Helles Bier, süß und fruchtig'
    ),
    (
        1,
        1.060,
        '2023-06-01',
        '2023-08-01',
        6.5,
        0,
        'Dunkles Bier, herb'
    ),
    (
        2,
        1.090,
        '2022-05-01',
        '2022-07-01',
        12.0,
        5,
        'Weißwein, süß'
    ),
    (
        2,
        1.085,
        '2024-02-01',
        '2024-04-01',
        11.5,
        20,
        'Rotwein, sauer und fruchtig'
    ),
    (
        3,
        1.040,
        '2023-09-01',
        '2023-11-01',
        4.8,
        15,
        'Cider, fruchtig und süß'
    );

-- Getränke-Geschmack-Zuordnung
INSERT INTO
    Getraenk_Geschmack (Getraenk_Id, Geschmack_Id)
VALUES (1, 1), -- Bier, süß
    (1, 3), -- Bier, fruchtig
    (2, 2), -- Bier, herb
    (3, 1), -- Wein, süß
    (4, 4), -- Wein, sauer
    (4, 3), -- Wein, fruchtig
    (5, 3), -- Cider, fruchtig
    (5, 1);
-- Cider, süß