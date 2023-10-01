const { PORT } = process.env;
const express = require("express");
const path = require("path");
const moment = require("moment-timezone");
const { initDB } = require("./config/db.config");
const { DEFAULT_TIME_ZONE } = require("./utils/constants");
const { initAPIs } = require("./api");

// initialize db
initDB();

const app = express();

// json parser middleware
app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: "50mb" })
);
app.use(
  express.json({
    parameterLimit: 100000,
    limit: "50mb",
    type: "application/json",
  })
);

// setting default time zone as India
moment.tz.setDefault(DEFAULT_TIME_ZONE);

// initialize all APIs
initAPIs(app);

app.get("/", (req, res) => {
  res.status(200).send("base url hit");
  return;
});

//global error handler
app.use((req, res, next) => {
  const err = new Error("Route Not found");
  err.status = 404;
  next(err);
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    err: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Node js server started on ${PORT}`);
});

module.exports = { app };
