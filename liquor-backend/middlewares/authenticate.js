const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const helpers = require("../util/helpers");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.verifyUserToken = (req, res, next) => {
  const token = helpers.extractToken(req);
  if (!token) {
    let err = new Error();
    err.status = 401;
    err.message = `No token provided`;
    next(err);
  } else {
    jwt.verify(token, JWT_SECRET_KEY, (err, data) => {
      if (err) {
        let err = new Error();
        err.status = 401;
        err.message = `Token is invalid`;
        next(err);
      } else {
        req.userId = data.userId;
        next();
      }
    });
  }
};
