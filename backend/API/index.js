const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const login = require("./auth/session");
const signup = require("./auth/user");
const promote = require("./auth/role");
const beverage = require("./beverage/beverage");
const best = require("./beverage/best");
const rating = require("./beverage/rating");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use("/api", login);
app.use("/api", signup);
app.use("/api", promote);
app.use("/api", best);
app.use("/api", beverage);
app.use("/api", rating);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
