const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const cookie = require("../session");

login.use(cookie);

login.post("/sessions", async (req, res) => {
  const { credential, password } = req.body;

  let email = null;
  let username = null;
  if (credential && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential)) {
    email = credential;
  } else {
    username = credential;
  }

  try {
    let user;

    if (email) {
      [user] = await pool.query(
        `
        SELECT * FROM Benutzer
        WHERE Email = ?
        AND Geloescht = 0
        `,
        [email]
      );
    } else if (username) {
      [user] = await pool.query(
        `
        SELECT * FROM Benutzer
        WHERE Benutzername = ?
        AND Geloescht = 0
        `,
        [username]
      );
    }

    if (!user || user.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid email, username or password" });
    } else if (!user[0].Verifiziert) {
      return res.status(403).json({ error: "Email not verified" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user[0].Passwort);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    delete user[0].Passwort;
    req.session.user = user[0];
    res.json({ message: "Login successful", user: user[0] });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

login.get("/sessions", async (req, res) => {
  if (req.session.user && !req.session.user.Geloescht) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "There is no Session currently active" });
  }
});

login.delete("/sessions", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error occurred during logout:", err);
      return res.status(500).json({ error: `We fucked up: ${error.message}` });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = login;
