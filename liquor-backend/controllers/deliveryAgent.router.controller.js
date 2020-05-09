const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// * configure dotenv to access environment variables
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// * configure and add AUTHY module
const authy = require("authy")(process.env.TWILIO_PROD_API_KEY);

const DeliveryAgent = require("../models/deliveryAgent.model");

exports.requestPhoneOTPForRegister = (req, res, next) => {
  DeliveryAgent.findOne({ "personalDetail.phone": req.query.phone })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        let err = new Error(`You're already registered.`);
        err.status = 409;
        err.statusText = "Conflict";
        next(err);
      } else {
        authy.register_user(
          "deliveryAgent@demo.com",
          req.query.phone,
          "91",
          function (error, response) {
            if (error) {
              let err = new Error(`Internal Server Error`);
              err.status = 500;
              err.statusText = "Internal Server Error";
              next(err);
            } else {
              authy.request_sms(response.user.id, (force = true), function (
                otpError,
                otpResponse
              ) {
                if (otpError) {
                  let err = new Error(`Internal Server Error`);
                  err.status = 500;
                  err.statusText = "Internal Server Error";
                  next(err);
                } else {
                  res.statusCode = 200;
                  res.statusText = "OK";
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    authyId: response.user.id,
                  });
                }
              });
            }
          }
        );
      }
    })
    .catch((err) => next(err));
};

exports.register = (req, res, next) => {
  DeliveryAgent.findOne({ "personalDetail.phone": req.query.phone })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        let err = new Error(`You're already registered.`);
        err.status = 409;
        err.statusText = "Conflict";
        next(err);
      } else {
        authy.verify(req.body.authyId, req.body.otp, function (
          error,
          response
        ) {
          if (error) {
            let err = new Error(
              `OTP you entered was wrong, please enter correct otp to continue`
            );
            err.status = 400;
            err.statusText = "Bad Request";
            next(err);
          } else {
            DeliveryAgent.create({
              fcm: {
                token: req.query.fcmDeviceToken,
                status: true,
              },
              personalDetail: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                authyId: req.body.authyId,
                verified: false,
              },
            })
              .then((deliveryAgent) => {
                let userId = deliveryAgent._id;
                // Issue JWT Token on validation
                const token = jwt.sign({ userId }, JWT_SECRET_KEY, {
                  expiresIn: "30d",
                });
                res.statusCode = 200;
                res.statusText = "OK";
                res.setHeader("Content-Type", "application/json");
                res.json({
                  token,
                  message: "You're logged in Successfully",
                });
              })
              .catch((err) => next(err));
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.requestPhoneOTPForLogin = (req, res, next) => {
  DeliveryAgent.findOne({ "personalDetail.phone": req.query.phone })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        authy.request_sms(
          deliveryAgent.personalDetail.authyId,
          (force = true),
          function (otpError, otpResponse) {
            if (otpError) {
              console.log(otpError);
              let err = new Error(`Internal Server Error`);
              err.status = 500;
              err.statusText = "Internal Server Error";
              next(err);
            } else {
              res.statusCode = 200;
              res.statusText = "OK";
              res.setHeader("Content-Type", "application/json");
              res.json({
                message: "OTP sent",
              });
            }
          }
        );
      } else {
        let err = new Error(`You're not registered yet.`);
        err.status = 404;
        err.statusText = "Not Found";
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  DeliveryAgent.findOne({ "personalDetail.phone": req.query.phone })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        authy.verify(
          deliveryAgent.personalDetail.authyId,
          req.query.otp,
          function (otpError, otpResponse) {
            if (otpError) {
              let err = new Error(
                `OTP you entered was wrong, please enter correct otp to continue`
              );
              err.status = 400;
              err.statusText = "Bad Request";
              next(err);
            } else {
              // save FCM Device token to DB with on successfull verification
              deliveryAgent.fcm = {
                token: req.query.fcmDeviceToken,
                status: true,
              };
              deliveryAgent
                .save()
                .then((deliveryAgent) => {
                  let userId = deliveryAgent._id;
                  // Issue JWT Token on validation
                  const token = jwt.sign({ userId }, JWT_SECRET_KEY, {
                    expiresIn: "30d",
                  });
                  res.statusCode = 200;
                  res.statusText = "OK";
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    token,
                    message: "You're logged in Successfully",
                  });
                })
                .catch((err) => next(err));
            }
          }
        );
      } else {
        let err = new Error(`You're not registered yet.`);
        err.status = 404;
        err.statusText = "Not Found";
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  DeliveryAgent.findOne({ _id: req.userId })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        deliveryAgent.fcm.status = false;
        deliveryAgent
          .save()
          .then((deliveryAgent) => {
            res.statusCode = 200;
            res.statusMessage = "OK";
            res.setHeader("Content-Type", "application/json");
            res.json({
              message: "Logout successful",
            });
          })
          .catch((err) => next(err));
      } else {
        let err = new Error(`You're not registered yet.`);
        err.status = 404;
        err.statusText = "Not Found";
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.getDeliveryAgentProfileController = (req, res, next) => {
  DeliveryAgent.findOne({ _id: req.userId })
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          deliveryAgent,
        });
      } else {
        let err = new Error(`Internal Server Error`);
        err.status = 500;
        err.statusText = "Internal Server Error";
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.updateDeliveryAgentProfileController = (req, res, next) => {
  console.log(req.body.dataType);
  DeliveryAgent.findOneAndUpdate(
    { _id: req.userId },
    { $set: { [req.body.dataType]: req.body.data } },
    { new: true }
  )
    .then((deliveryAgent) => {
      if (deliveryAgent) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          deliveryAgent,
        });
      } else {
        let err = new Error(`Unable to update, please try again.`);
        err.status = 501;
        err.statusText = "Not Implemented";
        next(err);
      }
    })
    .catch((err) => next(err));
};
