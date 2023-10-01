const express = require("express");
const { findAll, create } = require("../api/controller/priority.task.controller");
const { userAuthenticate } = require("../middleware/authenticate");

const PriorityTaskRouter = express.Router();

// get priority task list
PriorityTaskRouter.get("/", userAuthenticate, findAll);

// add task in priority task list
PriorityTaskRouter.post("/", userAuthenticate, create);

module.exports = { PriorityTaskRouter };
