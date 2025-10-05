const express = require("express");
const type = express.Router();
const pool = require("../pool");

type.get("/types", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }
    const [types] = await pool.query(
      `
      SELECT Typ_Id, Typ FROM Typ
      WHERE Geloescht = FALSE
      `
    );
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

/*type.get("/types/:id", async (req, res) => {

})*/

module.exports = type;
