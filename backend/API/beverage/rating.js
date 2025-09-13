const express = require("express");
const rating = express.Router();
const pool = require("../pool");

rating.get("beverages/:id/rating", async (req, res) => {
  const id = req.params.id;
  const { page = 1, pageSize = 20, sort = "Datum", order = "DESC" } = req.query;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    const [rows] = await pool.query(
      `
      SELECT Bewertung, Kommentar, Datum, Benutzer.Benutzername FROM Bewertung
      JOIN Benutzer ON Bewertung.Benutzer_Id = Benutzer.Benutzer_Id
      JOIN Getraenk ON Bewertung.Getraenk_Id = Getraenk.Getraenk_Id
      WHERE Getraenk_Id = ?
      AND Bewertung.Geloescht = FALSE
      AND Benutzer.Geloescht = FALSE
      AND Benutzer.Verifiziert = TRUE
      AND Benutzer.Rolle IN (1, 2) -- Only show ratings from verified users and brewers
      AND Getreank.Geloescht = FALSE
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
      `,
      [id, Number(pageSize), (Number(page) - 1) * Number(pageSize)]
    );

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = rating;
