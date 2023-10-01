const express = require("express");
const { findOne, create } = require("../api/controller/task.controller");
const { userAuthenticate } = require("../middleware/authenticate");

const taskRouter = express.Router();

// get task by id
taskRouter.get("/:taskId", userAuthenticate, findOne);

// add task in DB
taskRouter.post("/", userAuthenticate, create);

module.exports = { taskRouter };
