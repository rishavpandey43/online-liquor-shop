const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// * configure dotenv to access environment variables
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// * configure and add AUTHY module
const authy = require("authy")(process.env.TWILIO_PROD_API_KEY);

const Seller = require("../models/seller.model");
const Product = require("../models/product.model");
const Document = require("../models/document.model");

exports.requestPhoneOTPForRegister = (req, res, next) => {
  Seller.findOne({ "personalDetail.phone": req.query.phone })
    .then((seller) => {
      if (seller) {
        let err = new Error(`You're already registered.`);
        err.status = 409;
        err.statusText = "Conflict";
        next(err);
      } else {
        authy.register_user("seller@demo.com", req.query.phone, "91", function (
          error,
          response
        ) {
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
        });
      }
    })
    .catch((err) => next(err));
};

exports.register = (req, res, next) => {
  Seller.findOne({ "personalDetail.phone": req.query.phone })
    .then((seller) => {
      if (seller) {
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
            Seller.create({
              fcm: {
                token: req.query.fcmDeviceToken,
                status: true,
              },
              personalDetail: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                authyId: req.body.authyId,
              },
            })
              .then((seller) => {
                let userId = seller._id;
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
  Seller.findOne({ "personalDetail.phone": req.query.phone })
    .then((seller) => {
      if (seller) {
        authy.request_sms(
          seller.personalDetail.authyId,
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
  Seller.findOne({ "personalDetail.phone": req.query.phone })
    .then((seller) => {
      if (seller) {
        authy.verify(seller.personalDetail.authyId, req.query.otp, function (
          otpError,
          otpResponse
        ) {
          if (otpError) {
            let err = new Error(
              `OTP you entered was wrong, please enter correct otp to continue`
            );
            err.status = 400;
            err.statusText = "Bad Request";
            next(err);
          } else {
            // save FCM Device token to DB with on successfull verification
            seller.fcm = {
              token: req.query.fcmDeviceToken,
              status: true,
            };
            seller
              .save()
              .then((seller) => {
                let userId = seller._id;
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
  Seller.findOne({ _id: req.userId })
    .then((seller) => {
      if (seller) {
        seller.fcm.status = false;
        seller
          .save()
          .then((seller) => {
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

exports.getSellerController = (req, res, next) => {
  Seller.findOne({ _id: req.userId })
    .then((seller) => {
      if (seller) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          seller,
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

exports.updateSellerDetailController = (req, res, next) => {
  Document.create({
    id: req.userId,
    document: {
      name: req.file.originalname,
      data: {
        buffer: new Buffer(
          fs.readFileSync(req.file.path).toString("base64"),
          "base64"
        ),
        contentType: req.file.mimetype,
      },
    },
  })
    .then((document) => {
      let updatedData = {
        ...JSON.parse(req.body.data),
        documentId: document._id,
      };
      // ! Now Delete the file stored in local disk Storage.
      fs.unlink(req.file.path, (err) => {
        if (err) next(err);
        Seller.findOneAndUpdate(
          { _id: req.userId },
          { $set: { [req.body.dataType]: updatedData } }
        )
          .then((seller) => {
            if (seller) {
              res.statusCode = 200;
              res.statusMessage = "OK";
              res.setHeader("Content-Type", "application/json");
              res.json({
                seller,
              });
            } else {
              let err = new Error(`Unable to update, please try again.`);
              err.status = 501;
              err.statusText = "Not Implemented";
            }
          })
          .catch((err) => next(err));
      });
    })
    .catch((err) => next(err));
};

exports.addNewProductController = (req, res, next) => {
  Product.findOne({ name: req.body.general.name })
    .then((product) => {
      if (product) {
        // * If product exist in DB, then only add it to particular seller
        Seller.findOne({
          $and: [
            { _id: req.userId },
            { products: { $elemMatch: { root: product._id } } },
          ],
        })
          .then((seller) => {
            if (seller) {
              let err = new Error(`Product already exist to your store`);
              err.status = 409;
              err.statusText = "Conflict";
              next(err);
            } else {
              // * If seller with duplicate product is not found, find that seller again and update products to it's DB
              Seller.findOne({ _id: req.userId })
                .then((seller) => {
                  seller.products.push({
                    ...req.body.sellerSpecific,
                    root: product._id,
                  });
                  seller
                    .save()
                    .then((seller) => {
                      res.statusCode = 200;
                      res.statusMessage = "OK";
                      res.setHeader("Content-Type", "application/json");
                      res.json({
                        successMessage: "Product has been added successfull",
                      });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            }
          })
          .catch((err) => next(err));
      } else {
        // * If product doesn't exist, create a new one, and add to respective seller
        Product.create({ ...req.body.general })
          .then((product) => {
            Seller.findOne({
              $and: [
                { _id: req.userId },
                { products: { $elemMatch: { root: product._id } } },
              ],
            })
              .then((seller) => {
                if (seller) {
                  let err = new Error(`Product already added to your store`);
                  err.status = 409;
                  err.statusText = "Conflict";
                  next(err);
                } else {
                  // * If seller with duplicate product is not found, find that seller again and update products to it's DB
                  Seller.findOne({ _id: req.userId })
                    .then((seller) => {
                      seller.products.push({
                        ...req.body.sellerSpecific,
                        root: product._id,
                      });
                      seller
                        .save()
                        .then((seller) => {
                          res.statusCode = 200;
                          res.statusMessage = "OK";
                          res.setHeader("Content-Type", "application/json");
                          res.json({
                            successMessage:
                              "Product has been added successfull",
                          });
                        })
                        .catch((err) => next(err));
                    })
                    .catch((err) => next(err));
                }
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

exports.getAllProductsController = (req, res, next) => {
  Seller.findOne({ _id: req.userId })
    .populate([{ path: "products.root", model: Product }])
    .then((seller) => {
      if (!seller) {
        let err = new Error(`Seller not found with this ID`);
        err.status = 404;
        err.statusText = "Not Found";
        next(err);
      }
      res.statusCode = 200;
      res.statusMessage = "OK";
      res.setHeader("Content-Type", "application/json");
      res.json({
        products: seller.products,
      });
    })
    .catch((err) => next(err));
};
