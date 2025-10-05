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
        x.Typ_Id,
        x.Typ,
        x.Getraenk_Id,
        x.Beschreibung,
        x.Durchschnittsbewertung
      FROM (
        SELECT
          t.Typ_Id,
          t.Typ,
          g.Getraenk_Id,
          g.Beschreibung,
          AVG(b.Bewertung) AS Durchschnittsbewertung,
          ROW_NUMBER() OVER (PARTITION BY t.Typ_Id ORDER BY AVG(b.Bewertung) DESC) AS rn
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
      ) x
      WHERE x.rn = 1
      `
    );

    // Filter im JS: Nur Getränke mit Bewertung > 0 und nicht null
    const filteredRows = rows.filter(
      (row) =>
        row.Durchschnittsbewertung !== null && row.Durchschnittsbewertung > 0
    );

    // Geschmäcker für jedes Getränk holen
    for (const row of filteredRows) {
      const [geschmackRows] = await pool.query(
        `
        SELECT gs.Geschmack
        FROM Getraenk_Geschmack gg
        JOIN Geschmack gs ON gg.Geschmack_Id = gs.Geschmack_Id
        WHERE gg.Getraenk_Id = ?
        `,
        [row.Getraenk_Id]
      );
      row.Geschmaecker = geschmackRows.map((g) => g.Geschmack);
    }

    return res.status(200).json(filteredRows);
  } catch (error) {
    res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = best;
