const session = require("express-session");

const currentSession = session({
  secret: "sldkfjaojef487598u",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});

module.exports = currentSession;
