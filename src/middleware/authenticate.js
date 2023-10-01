const { User } = require("../api/model/user.model");

const userAuthenticate = (req, res, next) => {
    var token = req.header("rx-u");
    if (!token) {
      return res.status(401).send({
        error: "No token, authorization denied",
      });
    }
    User.findByToken(token)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        }
        next();
      })
      .catch((err) => {
        res.status(401).send({
          error: "Unauthorized",
        });
        return;
      });
  };
  module.exports={userAuthenticate}