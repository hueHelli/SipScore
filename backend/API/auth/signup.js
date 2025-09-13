const express = require("express");
const signup = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

signup.get("/", async (req, res) => {
  try {
    res.send("Welcome to the signup API!");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

signup.post("/newUser", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, 10);
  const code = crypto.randomInt(100000, 999999).toString();

  try {
    const [existingEmail] = await pool.query(
      `
        SELECT * FROM Benutzer
        WHERE Email = ?
        AND Verified = TRUE
      `,
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const [existingUsername] = await pool.query(
      `
        SELECT * FROM Benutzer
        WHERE Username = ?
        AND Verified = TRUE
      `,
      [username]
    );

    if (existingUsername.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const [verification] = await pool.query(
      `
        INSERT INTO Benutzer
        (Vorname, Nachname, Email, Benutzername, Passwort, Rolle, Code, Verifiziert)
        VALUES
        (?, ?, ?, ?, ?, 11, ?, FALSE)
        `,
      [firstName, lastName, email, username, password, code]
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "SipScore Email Verifizierung",
      text: `Dein Code lautet: ${code}`,
    });

    res.status(201).json({ message: "User created temporarily", verification });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal Server Error: " + error });
  }
});

signup.put("/confirm", async (req, res) => {
  const { email, code } = req.body;

  try {
    const [user] = await pool.query(
      `
        SELECT * FROM Benutzer
        WHERE Email = ?
        AND Code = ?
        AND Verified = FALSE
      `,
      [email, code]
    );

    if (user.length === 0) {
      return res.status(400).json({ error: "Invalid code or email" });
    }

    await pool.query(
      `
        UPDATE User
        SET Verified = TRUE, Code = NULL
        WHERE Email = ?
      `,
      [email]
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = signup;
