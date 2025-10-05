const express = require("express");
const flavor = express.Router();
const pool = require("../pool");

flavor.get("/flavors", async (req, res) => {
  const { page = 1, pageSize = 50 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const [rows] = await pool.query(
      `
      SELECT * FROM Geschmack
      WHERE Geloescht = 0
      LIMIT ?
      OFFSET ?
      `,
      [Number(pageSize), Number(offset)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No flavors found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

flavor.post("/flavors", async (req, res) => {
  const { flavor } = req.body;

  if (!flavor) {
    return res.status(400).json({ error: "Missing flavor in request body" });
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO Geschmack (Bezeichnung, Geloescht)
      VALUES (?, 0)
      `,
      [flavor]
    );
    return res
      .status(201)
      .json({ message: "Flavor added", flavorId: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

flavor.delete("/flavors/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `
      UPDATE Geschmack
      SET Geloescht = 1
      WHERE ID = ?
      `,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Flavor not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = flavor;
