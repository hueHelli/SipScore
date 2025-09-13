const express = require("express");
const promote = express.Router();
const pool = require("../pool");

promote.put("/role/:id", async (req, res) => {
  const userId = req.params.id;
  const { newRole } = req.body;
  const currentUser = req.session.user;

  try {
    if (!currentUser || !currentUser.Verifiziert) {
      return res.status(401).json({ error: "I don't know who you are" });
    } else if (currentUser.Rolle.data[0] !== 0) {
      return res.status(403).json({ error: "I know who you are, but no" });
    } else if (newRole < 0 || newRole > 3) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const [result] = await pool.query(
      `
      SELECT * FROM Benutzer
      WHERE Benutzer_Id = ?
      `,
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool.query(
      `
      UPDATE Benutzer
      SET Rolle = ?
      WHERE Benutzer_Id = ?
      `,
      [newRole, userId]
    );

    const [updatedUser] = await pool.query(
      `
      SELECT * FROM Benutzer
      WHERE Benutzer_Id = ?
      `,
      [userId]
    );

    return res
      .status(200)
      .json({ message: "User role updated", body: updatedUser[0] });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = promote;
