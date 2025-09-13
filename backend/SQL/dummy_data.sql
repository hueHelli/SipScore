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