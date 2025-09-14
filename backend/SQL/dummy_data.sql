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

-- Bewertungen für Getränk 1 (Helles Bier, süß und fruchtig) - Durchschnitt: 4.0
INSERT INTO
    Bewertung (
        Getraenk_Id,
        Benutzer_Id,
        Bewertung,
        Kommentar,
        Datum
    )
VALUES (
        1,
        1,
        5,
        'Sehr erfrischend und lecker!',
        '2024-03-10'
    ),
    (
        1,
        2,
        4,
        'Guter Geschmack, könnte etwas herber sein.',
        '2024-03-12'
    ),
    (
        1,
        1,
        3,
        'Nicht ganz mein Fall, aber ok.',
        '2024-03-15'
    );

-- Bewertungen für Getränk 2 (Dunkles Bier, herb) - Durchschnitt: 3.0
INSERT INTO
    Bewertung (
        Getraenk_Id,
        Benutzer_Id,
        Bewertung,
        Kommentar,
        Datum
    )
VALUES (
        2,
        2,
        4,
        'Gutes Bier, aber etwas zu stark.',
        '2024-08-07'
    ),
    (
        2,
        1,
        3,
        'Zu bitter für mich.',
        '2024-08-10'
    ),
    (
        2,
        2,
        2,
        'Nicht mein Favorit.',
        '2024-08-12'
    );

-- Bewertungen für Getränk 3 (Weißwein, süß) - Durchschnitt: 5.0
INSERT INTO
    Bewertung (
        Getraenk_Id,
        Benutzer_Id,
        Bewertung,
        Kommentar,
        Datum
    )
VALUES (
        3,
        1,
        5,
        'Sehr süß und angenehm.',
        '2024-07-20'
    ),
    (
        3,
        2,
        5,
        'Leckerer Wein, passt zu Dessert.',
        '2024-07-22'
    ),
    (
        3,
        1,
        5,
        'Mein Lieblingswein!',
        '2024-07-25'
    );

-- Bewertungen für Getränk 4 (Rotwein, sauer und fruchtig) - Durchschnitt: 4.33
INSERT INTO
    Bewertung (
        Getraenk_Id,
        Benutzer_Id,
        Bewertung,
        Kommentar,
        Datum
    )
VALUES (
        4,
        2,
        5,
        'Fruchtig und sauer, sehr gut!',
        '2024-04-10'
    ),
    (
        4,
        1,
        4,
        'Interessanter Geschmack, gefällt mir.',
        '2024-04-12'
    ),
    (
        4,
        2,
        4,
        'Nicht schlecht, aber nicht mein Favorit.',
        '2024-04-15'
    );

-- Bewertungen für Getränk 5 (Cider, fruchtig und süß) - Durchschnitt: 2.67
INSERT INTO
    Bewertung (
        Getraenk_Id,
        Benutzer_Id,
        Bewertung,
        Kommentar,
        Datum
    )
VALUES (
        5,
        1,
        3,
        'Ganz ok, aber etwas zu mild.',
        '2024-11-10'
    ),
    (
        5,
        2,
        2,
        'Zu süß für meinen Geschmack.',
        '2024-11-12'
    ),
    (
        5,
        1,
        3,
        'Erfrischend, aber nicht besonders.',
        '2024-11-15'
    );