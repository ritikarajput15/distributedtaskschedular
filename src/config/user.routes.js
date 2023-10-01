const express = require("express");
const { findOne, create } = require("../api/controller/user.controller");
const { userAuthenticate } = require("../middleware/authenticate");

const userRouter = express.Router();

// get user by id
userRouter.get("/:userId", userAuthenticate, findOne);

// add user in DB
userRouter.post("/", create);

module.exports = { userRouter };
