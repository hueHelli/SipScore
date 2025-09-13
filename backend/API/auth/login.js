const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../pool");
const cookie = require("../session");

login.use(cookie);

login.post("/loginUser", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user;

    if (email) {
      [user] = await pool.query(
        `
      SELECT * FROM Benutzer WHERE Email = ?
      `,
        [email]
      );
    } else if (username) {
      [user] = await pool.query(
        `
        SELECT * FROM Benutzer WHERE Benutzername = ?
        `,
        [username]
      );
    }

    if (user.length === 0) {
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
    req.session.user = user[0];
    res.json({ message: "Login successful", user: user[0] });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

login.get("/session", async (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

login.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error occurred during logout:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Logout successful" });
  });
});

module.exports = login;
