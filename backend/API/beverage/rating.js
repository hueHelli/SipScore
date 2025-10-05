const express = require("express");
const rating = express.Router();
const pool = require("../pool");

rating.get("beverages/:id/ratings", async (req, res) => {
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

rating.post("/beverages/:id/ratings", async (req, res) => {
  const beverageId = req.params.id;
  const { rating, comment } = req.body;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (
      req.session.user.Rolle.data[0] !== 1 &&
      req.session.user.Rolle.data[0] !== 2
    ) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "You fucked up: Rating must be between 1 and 5" });
    }

    const [beverage] = await pool.query(
      `
      SELECT * FROM Getraenk
      WHERE Getraenk_Id = ?
      AND Geloescht = FALSE
      `,
      [beverageId]
    );

    if (!beverage || beverage.length === 0) {
      return res.status(404).json({ error: "Beverage not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Bewertung
      (Getreank_Id, Benutzer_Id, Bewwertung, Kommentar, Datum)
      VALUES
      (?, ?, ?, ?, NOW())
      `,
      [
        beverageId,
        req.session.user.Benutzer_Id,
        rating,
        comment ? comment : null,
      ]
    );

    return res
      .status(201)
      .json({ message: "Rating created", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

rating.put("/rating/:id", async (req, res) => {
  const ratingId = req.params.id;
  const { rating, comment } = req.body;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (
      req.session.user.Rolle.data[0] !== 1 &&
      req.session.user.Rolle.data[0] !== 2
    ) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "You fucked up: Rating must be between 1 and 5" });
    }

    const [rating] = await pool.query(
      `
      SELECT * FROM Bewertung
      WHERE Bewertung_Id = ?
      AND Geloescht = FALSE
      `,
      [ratingId]
    );

    if (!rating || rating.length === 0) {
      return res.status(404).json({ error: "Rating not found" });
    }

    if (rating.Benutzer_Id !== req.session.user.Benutzer_Id) {
      return res.status(403).json({
        error: "I know who you are but no (You can only edit your own ratings)",
      });
    }

    await pool.query(
      `
      UPDATE Bewertung
      SET Bewertung = ?, Kommentar = ?
      WHERE Bewertung_Id = ?
      `,
      [rating, comment ? comment : null, ratingId]
    );

    return res.status(200).json({ message: `Rating updated: ${ratingId}` });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

rating.delete("/rating/:id", async (req, res) => {
  const ratingId = req.params.id;
  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (req.session.user.Rolle.data[0] > 2) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "You fucked up: Rating must be between 1 and 5" });
    }

    const [beverage] = await pool.query(
      `
      SELECT * FROM Getraenk
      WHERE Getraenk_Id = ?
      AND Geloescht = FALSE
      `,
      [beverageId]
    );

    if (!beverage || beverage.length === 0) {
      return res.status(404).json({ error: "Beverage not found" });
    }

    if (
      rating.Benutzer_Id !== req.session.user.Benutzer_Id &&
      req.session.user.Rolle.data[0] !== 0
    ) {
      return res.status(403).json({
        error:
          "I know who you are but no (You can only delete your own ratings)",
      });
    }

    await pool.query(
      `
      UPDATE Bewertung
      SET Geloescht = TRUE
      WHERE Bewertung_Id = ?
      `,
      [ratingId]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = rating;
