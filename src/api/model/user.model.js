const { AUTH_ONE } = process.env;
const mongoose = require("mongoose");
const validator = require("validator");
const { USER } = require("../../utils/constants");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const UserSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Entered userEmail is not a valid email",
    },
  },
  token: { type: String },
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();
  return _.pick(userObj, ["_id", "userName", "userEmail"]);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var dataToSign = { _id: user._id.toHexString() };
  var token = jwt.sign(dataToSign, AUTH_ONE).toString();
  user.token = token;
  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findAuthToken = function (id) {
  return User.findById(id).then((userDoc) => {
    if (!userDoc) {
      return Promise.reject();
    } else {
      if (!userDoc.token) {
        var dataToSign = { _id: id.toHexString() };
        var token = jwt.sign(dataToSign, AUTH_ONE).toString();
        return User.findByIdAndUpdate(id, { $set: { token } }).then(() => {
          return token;
        });
      } else {
        return userDoc.token;
      }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var decoded;
  try {
    decoded = jwt.verify(token, AUTH_ONE);
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    token,
  });
};


const User = mongoose.model(USER, UserSchema);
module.exports = { User };
