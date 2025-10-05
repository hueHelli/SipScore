const express = require("express");
const user = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cookie = require("../session");

user.use(cookie);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

user.get("/users", async (req, res) => {
  try {
    const [users] = await pool.query(
      `
      SELECT Benutzer_Id, Vorname, Nachname, Email, Benutzername, Rolle
      FROM Benutzer
      WHERE Verifiziert = TRUE
      AND Geloescht = FALSE
      `
    );

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up:  ${error.message}` });
  }
});

user.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await pool.query(
      `
      SELECTBenutzer_Id, Vorname, Nachname, Email, Benutzername, Rolle
      FROM Benutzer
      WHERE Benutzer_Id = ?
      AND Verifiziert = TRUE
      AND Geloescht = FALSE
      `,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up:  ${error.message}` });
  }
});

user.post("/users", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);
  const code = crypto.randomInt(100000, 999999).toString();

  try {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ error: "You fucked up: Invalid Email Format" });
    }

    const [existingEmail] = await pool.query(
      `
        SELECT * FROM Benutzer
        WHERE Email = ?
        AND Verifiziert = TRUE
      `,
      [email]
    );

    if (existingEmail.length > 0) {
      if (existingEmail[0].Geloescht) {
        return res.status(403).json({
          error:
            "This account has been banned or deleted. Please contact support if you think this is a mistake.",
        });
      }
      return res.status(409).json({ error: "Email already in use" });
    }

    const [existingUsername] = await pool.query(
      `
        SELECT * FROM Benutzer
        WHERE Benutzername = ?
        AND Verifiziert = TRUE
      `,
      [username]
    );

    if (existingUsername.length > 0) {
      if (existingEmail[0].Geloescht) {
        return res.status(403).json({
          error:
            "This account has been banned or deleted. Please contact support if you think this is a mistake.",
        });
      }
      return res.status(409).json({ error: "Username already exists" });
    }

    const [verification] = await pool.query(
      `
        INSERT INTO Benutzer
        (Vorname, Nachname, Email, Benutzername, Passwort, Rolle, Code, Verifiziert)
        VALUES
        (?, ?, ?, ?, ?, b'11', ?, FALSE)
        `,
      [firstName, lastName, email, username, passwordHash, code]
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "SipScore Email Verifizierung",
      text: `Dein Code lautet: ${code}`,
    });

    return res
      .status(201)
      .json({ message: `User created temporarily`, id: verification.insertId });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up:  ${error.message}` });
  }
});

user.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { request, action = "update" } = req.body;

  try {
    if (action === "verify") {
      const { code } = request;
      const [user] = await pool.query(
        `
        SELECT * FROM Benutzer
        WHERE Benutzer_Id = ?
      `,
        [id]
      );

      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      if (Number(user[0].Code) !== Number(code)) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      await pool.query(
        `
        UPDATE Benutzer
        SET Verifiziert = TRUE, Code = NULL
        WHERE Benutzer_Id = ?
      `,
        [id]
      );

      req.session.user = user[0];
      return res.status(200).json({ message: "Email verified successfully" });
    } else if (action === "update") {
      const { firstName, lastName, email, username } = request;

      const [existingUser] = await pool.query(
        `
        SELECT * FROM Benutzer
        WHERE Benutzer_Id = ?
        `,
        [id]
      );

      if (!existingUser || existingUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      await pool.query(
        `
        UPDATE Benutzer
        SET Vorname = ?, Nachname = ?, Email = ?, Benutzername = ?
        WHERE Benutzer_Id = ?
      `,
        [firstName, lastName, email, username, id]
      );

      return res.status(200).json({ message: "User updated" });
    } else if (action === "password") {
      const { oldPassword, newPassword } = req.body;

      const [existingUser] = await pool.query(
        `
        SELECT * FROM Benutzer
        WHERE Benutzer_Id = ?
        `,
        [id]
      );

      if (!existingUser || existingUser.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!bcrypt.compareSync(oldPassword, existingUser[0].Passwort)) {
        return res.status(403).json({ error: "Old password is incorrect" });
      }

      const newPasswordHash = bcrypt.hashSync(newPassword, 10);

      await pool.query(
        `
        UPDATE Benutzer
        SET Passwort = ?
        WHERE Benutzer_Id = ?
        `,
        [newPasswordHash, id]
      );
      return res.status(200).json({ message: "Password updated" });
    }
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

user.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query(
      `
      UPDATE Benutzer
      SET Geloescht = TRUE
      WHERE Benutzer_Id = ?
      `,
      [userId]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = user;
