const express = require("express");
const ingredient = express.Router();
const pool = require("../pool");

ingredient.get("/ingredients", async (req, res) => {
  const { page = 1, pageSize = 50 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const [rows] = await pool.query(
      `
      SELECT * FROM Zutat
      WHERE Geloescht = 0
      LIMIT ?
      OFFSET ?
      `,
      [Number(pageSize), Number(offset)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No ingredients found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

ingredient.post("/ingredients", async (req, res) => {
  const { ingredient } = req.body;

  if (!ingredient) {
    return res.status(400).json({ error: "Missing ingredient in request body" });
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO Zutat (Bezeichnung, Geloescht)
      VALUES (?, 0)
      `,
      [ingredient]
    );
    return res
      .status(201)
      .json({ message: "Ingredient added", ingredientId: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

ingredient.delete("/ingredients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `
      UPDATE Zutat
      SET Geloescht = 1
      WHERE ID = ?
      `,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = ingredient;
