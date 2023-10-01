const mongoose = require("mongoose");
const { User } = require("../model/user.model");
const {
  findOneModel,
  handleBadRequest,
  handleInternalServerError,
} = require("../../utils/api.utils");
const _ = require("lodash");
const { isEmpty, pick } = require("lodash");

const findOne = (req, res) => {
  const id = req.params.userId;
  findOneModel(User, id, res);
};

const create = async (req, res) => {
 try{
  var body = getBody(req);
  if (isEmpty(body)) {
    handleBadRequest(res);
    return;
  }
  const existingUserDoc = await User.findOne({
    userEmail: body.userEmail,
  })
    .select({})
    .lean({});
  if (isEmpty(existingUserDoc) === false) {
    res.status(409).json({
      error: "user already exists",
    });
    return;
  }

  body = { ...body, _id: new mongoose.Types.ObjectId() };
  const userDoc = await User.create(body);
  await userDoc.generateAuthToken();
  return res.status(200).json(userDoc);
 }catch(error){
  return handleInternalServerError(res,error.message);
 }
};

var getBody = (req) => {
  var body = pick(req.body, [
    "userName",
    "userEmail",
  ]);
  return body;
};
module.exports = {
  findOne,
  create,
};
