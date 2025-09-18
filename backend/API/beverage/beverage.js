const express = require("express");
const beverage = express.Router();
const pool = require("../pool");

beverage.get("/beverages", async (req, res) => {
  // Example-URL: /beverages?Typ_Id=1,2&Geschmack_Id=3&Min_Alter=5&Max_Alter=24&Min_Alkohol=5&Max_Alkohol=10&Auf_Lager=true&page=1&pageSize=5&sort=Alkoholgehalt&order=DESC
  const {
    Typ_Id,
    Geschmack_Id,
    Min_Alter,
    Max_Alter,
    Min_Alkohol,
    Max_Alkohol,
    Auf_Lager,
    Page = 1,
    PageSize = 20,
    sort = "Getraenk_Id",
    order = "ASC",
  } = req.query;

  let whereClauses = [];
  let params = [];

  // Typ Filter
  if (Typ_Id) {
    const typArr = Typ_Id.split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (typArr.length > 0) {
      whereClauses.push(`g.Typ_Id IN (${typArr.map(() => "?").join(",")})`);
      params.push(...typArr);
    }
  }

  // Geschmack Filter
  if (Geschmack_Id) {
    const geschmackArr = Geschmack_Id.split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (geschmackArr.length > 0) {
      whereClauses.push(
        `gg.Geschmack_Id IN (${geschmackArr.map(() => "?").join(",")})`
      );
      params.push(...geschmackArr);
    }
  }

  // Alter Filter (Monate)
  if (Min_Alter != null) {
    whereClauses.push(`TIMESTAMPDIFF(MONTH, g.Abfuellung, CURDATE()) >= ?`);
    params.push(Number(Min_Alter));
  }
  if (Max_Alter != null) {
    whereClauses.push(`TIMESTAMPDIFF(MONTH, g.Abfuellung, CURDATE()) <= ?`);
    params.push(Number(Max_Alter));
  }

  // Alkohol Filter
  if (Min_Alkohol != null) {
    whereClauses.push(`g.Alkoholgehalt >= ?`);
    params.push(Number(Min_Alkohol));
  }
  if (Max_Alkohol != null) {
    whereClauses.push(`g.Alkoholgehalt <= ?`);
    params.push(Number(Max_Alkohol));
  }

  // Lager Filter
  if (Auf_Lager != null) {
    whereClauses.push(`g.Lager ${Auf_Lager === "true" ? ">" : "="} 0`);
  }

  // Nicht gelöschte Getränke
  whereClauses.push(`g.Geloescht = FALSE`);

  // SQL Query
  const whereSQL = whereClauses.length
    ? "WHERE " + whereClauses.join(" AND ")
    : "";
  const offset = (Number(Page) - 1) * Number(PageSize);

  const sql = `
    SELECT g.*, t.Typ, GROUP_CONCAT(DISTINCT gs.Geschmack) AS Geschmaecker
    FROM Getraenk g
    JOIN Typ t ON g.Typ_Id = t.Typ_Id
    LEFT JOIN Getraenk_Geschmack gg ON g.Getraenk_Id = gg.Getraenk_Id
    LEFT JOIN Geschmack gs ON gg.Geschmack_Id = gs.Geschmack_Id
    ${whereSQL}
    GROUP BY g.Getraenk_Id
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;

  params.push(Number(PageSize), offset);

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

beverage.get("/beverages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    const [rows] = await pool.query(
      `
      SELECT Getraenk.Getraenk_Id, Typ.Typ, Startgravitation, BeginnFermentation, Abfuellung, Alkoholgehalt, Lager, Beschreibung, GROUP_CONCAT(Geschmack.Geschmack) AS Geschmaecker
      FROM Getraenk
      JOIN Typ ON Getraenk.Typ_Id = Typ.Typ_Id
      LEFT JOIN Getraenk_Geschmack ON Getraenk.Getraenk_Id = Getraenk_Geschmack.Getraenk_Id
      LEFT JOIN Geschmack ON Getraenk_Geschmack.Geschmack_Id = Geschmack.Geschmack_Id
      WHERE Getraenk.Getraenk_Id = ?
      AND Getraenk.Geloescht = FALSE
      `,
      [id]
    );

    if (!rows) {
      return res.status(404).json({ error: "Beverage not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

beverage.post("/beverages", async (req, res) => {
  const {
    Typ_Id,
    Startgravitation,
    BeginnFermentation,
    Abfuellung,
    Alkoholgehalt,
    Lager,
    Beschreibung,
    Geschmack_Ids, // Array of numbers
    Rezept, // Array of {Zutat_Id: number, Menge: string}
  } = req.body;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (req.session.user.Rolle.data[0] !== 1) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    const [type] = await pool.query(
      `
      SELECT * FROM Typ
      WHERE Typ_Id = ?
      AND Geloescht = FALSE
      `,
      [Typ_Id]
    );

    if (!type) {
      return res.status(404).json({ error: "Type not found" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO Getraenk
      (Typ_Id, Startgravitation, BeginnFermentation, Abfuellung, Alkoholgehalt, Lager, Beschreibung)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Typ_Id,
        Startgravitation,
        BeginnFermentation,
        Abfuellung,
        Alkoholgehalt,
        Lager,
        Beschreibung,
      ]
    );

    for (const geschmack_Id of Geschmack_Ids) {
      const [flavor] = await pool.query(
        `
        SELECT * FROM Geschmack
        WHERE Geschmack_Id = ?
        AND Geloescht = FALSE
        `,
        [geschmack_Id]
      );

      if (!flavor) {
        await pool.query(
          `
          DELETE FROM Getraenk 
          WHERE Getraenk_Id = ?
          `,
          [result.insertId]
        );
        return res.status(404).json({
          error: `
            Flavor not found, seriously how tf did you do this, this should not be possible,
            like I am genuinely curious
            `,
        });
      } else {
        await pool.query(
          `
          INSERT INTO Getraenk_Geschmack
          (Getraenk_Id, Geschmack_Id)
          VALUES
          (?, ?)
          `,
          [result.insertId, geschmack_Id]
        );
      }
    }

    for (const { Zutat_Id, Menge } of Rezept) {
      const [ingredient] = await pool.query(
        `
        SELECT * FROM Zutat
        WHERE Zutat_Id = ?
        AND Geloescht = FALSE
        `,
        [Zutat_Id]
      );

      if (!ingredient) {
        await pool.query(
          `
          DELETE FROM Getraenk
          WHERE Getreank_Id = ?
          `,
          [result.insertId]
        );

        return res.status(404).json({ error: "Ingredient not found" });
      } else {
        await pool.query(
          `
          INSERT INTO Rezept
          (Getraenk_Id, Zutat_Id, Menge)
          VALUES
          (?, ?, ?)
          `,
          [result.insertId, Zutat_Id, Menge]
        );
      }
    }

    return res
      .status(201)
      .json({ message: "Beverage created", id: result.insertId });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

beverage.put("/beverages/:id", async (req, res) => {
  const { id } = req.params;
  const {
    Typ_Id,
    Startgravitation,
    BeginnFermentation,
    Abfuellung,
    Alkoholgehalt,
    Lager,
    Beschreibung,
    Geschmack_Ids, // Array of numbers
    Rezept, // Array of {Zutat_Id: number, Menge: string}d
  } = req.body;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (req.session.user.Rolle.data[0] !== 1) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    const [beverage] = await pool.query(
      `
      SELECT * FROM Getraenk
      WHERE Getraenk_Id = ?
      AND Geloescht = FALSE
      `,
      [id]
    );

    if (!beverage) {
      return res.status(404).json({ error: "Beverage not found" });
    }

    const [type] = await pool.query(
      `
      SELECT * FROM Typ
      WHERE Typ_Id = ?
      AND Geloescht = FALSE
      `,
      [Typ_Id]
    );

    if (!type) {
      return res.status(404).json({ error: "Type not found" });
    }

    await pool.query(
      `
      UPDATE Getraenk
      SET
      Typ_Id = ?,
      Startgravitation = ?,
      BeginnFermentation = ?,
      Abfuellung = ?,
      Alkoholgehalt = ?,
      Lager = ?,
      Beschreibung = ?
      WHERE Getraenk_Id = ?
      `,
      [
        Typ_Id,
        Startgravitation,
        BeginnFermentation,
        Abfuellung,
        Alkoholgehalt,
        Lager,
        Beschreibung,
        id,
      ]
    );

    await pool.query(
      `
      DELETE FROM Getraenk_Geschmack
      WHERE Getraenk_Id = ?
      `,
      [id]
    );

    for (const geschmack_Id of Geschmack_Ids) {
      const [flavor] = await pool.query(
        `
        SELECT * FROM Geschmack
        WHERE Geschmack_Id = ?
        AND Geloescht = FALSE
        `,
        [geschmack_Id]
      );

      if (!flavor) {
        return res.status(404).json({
          error: `Flavor not found, seriously how tf did you do this, this should not be possible, like I am genuinely curious`,
        });
      } else {
        await pool.query(
          `
          INSERT INTO Getraenk_Geschmack
          (Getraenk_Id, Geschmack_Id)
          VALUES
          (?, ?)
          `,
          [id, geschmack_Id]
        );
      }
    }

    await pool.query(
      `
      DELETE FROM Rezept
      WHERE Getraenk_Id = ?
      `,
      [id]
    );

    for (const { Zutat_Id, Menge } of Rezept) {
      const [ingredient] = await pool.query(
        `
        SELECT * FROM Zutat
        WHERE Zutat_Id = ?
        AND Geloescht = FALSE
        `,
        [Zutat_Id]
      );

      if (!ingredient) {
        return res.status(404).json({ error: "Ingredient not found" });
      } else {
        await pool.query(
          `
          INSERT INTO Rezept
          (Getraenk_Id, Zutat_Id, Menge)
          VALUES
          (?, ?, ?)
          `,
          [result.insertId, Zutat_Id, Menge]
        );
      }
    }

    return res.status(200).json({ message: "Beverage updated", id: id });
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

beverage.delete("/beverages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.user || req.session.user.Geloescht) {
      return res.status(401).json({ error: "I don't know who you are" });
    }

    if (req.session.user.Rolle.data[0] !== 1) {
      return res.status(403).json({ error: "I know who you are, but no" });
    }

    const [beverage] = await pool.query(
      `
      SELECT * FROM Getraenk
      WHERE Getraenk_Id = ?
      AND Geloescht = FALSE
      `,
      [id]
    );

    if (!beverage) {
      return res.status(404).json({ error: "Beverage not found" });
    }

    await pool.query(
      `
      UPDATE Getraenk
      SET Geloescht = TRUE
      WHERE Getraenk_Id = ?
      `,
      [id]
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: `We fucked up: ${error.message}` });
  }
});

module.exports = beverage;
