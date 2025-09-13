const express = require("express");
const best = express.Router();
const pool = require("../pool");

best.get("/beverages/best", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    const [rows] = await pool.query(
      `
      SELECT
      t.Typ_Id,
      t.Typ,
      g.Getraenk_Id,
      g.Beschreibung,
      AVG(b.Bewertung) AS Durchschnittsbewertung
      FROM
        Typ t
      JOIN
        Getraenk g ON t.Typ_Id = g.Typ_Id
      LEFT JOIN
        Bewertung b ON g.Getraenk_Id = b.Getraenk_Id AND b.Geloescht = FALSE
      WHERE
        g.Geloescht = FALSE
      GROUP BY
        t.Typ_Id, g.Getraenk_Id
      HAVING
        AVG(b.Bewertung) IS NOT NULL
      ORDER BY
        t.Typ_Id, Durchschnittsbewertung DESC
      `
    );

    return res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = best;
