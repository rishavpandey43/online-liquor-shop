const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// * configure dotenv to access environment variables
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// * configure and add AUTHY module
const authy = require('authy')(process.env.TWILIO_PROD_API_KEY);

const Customer = require('../models/customer.model');
const Seller = require('../models/seller.model');
const Product = require('../models/product.model');
const Document = require('../models/document.model');

exports.requestPhoneOTPForRegister = (req, res, next) => {
  Customer.findOne({ 'personalDetail.phone': req.query.phone })
    .then((customer) => {
      if (customer) {
        let err = new Error(`You're already registered.`);
        err.status = 409;
        err.statusText = 'Conflict';
        next(err);
      } else {
        authy.register_user(
          'customer@demo.com',
          req.query.phone,
          '91',
          function (error, response) {
            if (error) {
              let err = new Error(`Internal Server Error`);
              err.status = 500;
              err.statusText = 'Internal Server Error';
              next(err);
            } else {
              authy.request_sms(response.user.id, (force = true), function (
                otpError,
                otpResponse
              ) {
                if (otpError) {
                  let err = new Error(`Internal Server Error`);
                  err.status = 500;
                  err.statusText = 'Internal Server Error';
                  next(err);
                } else {
                  res.statusCode = 200;
                  res.statusText = 'OK';
                  res.setHeader('Content-Type', 'application/json');
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
  Customer.findOne({ 'personalDetail.phone': req.query.phone })
    .then((customer) => {
      if (customer) {
        let err = new Error(`You're already registered.`);
        err.status = 409;
        err.statusText = 'Conflict';
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
            err.statusText = 'Bad Request';
            next(err);
          } else {
            Customer.create({
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
              .then((customer) => {
                let userId = customer._id;
                // Issue JWT Token on validation
                const token = jwt.sign({ userId }, JWT_SECRET_KEY, {
                  expiresIn: '30d',
                });
                res.statusCode = 200;
                res.statusText = 'OK';
                res.setHeader('Content-Type', 'application/json');
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
  Customer.findOne({ 'personalDetail.phone': req.query.phone })
    .then((customer) => {
      if (customer) {
        authy.request_sms(
          customer.personalDetail.authyId,
          (force = true),
          function (otpError, otpResponse) {
            if (otpError) {
              console.log(otpError);
              let err = new Error(`Internal Server Error`);
              err.status = 500;
              err.statusText = 'Internal Server Error';
              next(err);
            } else {
              res.statusCode = 200;
              res.statusText = 'OK';
              res.setHeader('Content-Type', 'application/json');
              res.json({
                message: 'OTP sent',
              });
            }
          }
        );
      } else {
        let err = new Error(`You're not registered yet.`);
        err.status = 404;
        err.statusText = 'Not Found';
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  Customer.findOne({ 'personalDetail.phone': req.query.phone })
    .then((customer) => {
      if (customer) {
        authy.verify(customer.personalDetail.authyId, req.query.otp, function (
          otpError,
          otpResponse
        ) {
          if (otpError) {
            let err = new Error(
              `OTP you entered was wrong, please enter correct otp to continue`
            );
            err.status = 400;
            err.statusText = 'Bad Request';
            next(err);
          } else {
            // save FCM Device token to DB with on successfull verification
            customer.fcm = {
              token: req.query.fcmDeviceToken,
              status: true,
            };
            customer
              .save()
              .then((customer) => {
                let userId = customer._id;
                // Issue JWT Token on validation
                const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
                  expiresIn: '30d',
                });
                res.statusCode = 200;
                res.statusText = 'OK';
                res.setHeader('Content-Type', 'application/json');
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
        err.statusText = 'Not Found';
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  Customer.findOne({ _id: req.userId })
    .then((customer) => {
      if (customer) {
        customer.fcm.status = false;
        customer
          .save()
          .then((customer) => {
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.setHeader('Content-Type', 'application/json');
            res.json({
              message: 'Logout successful',
            });
          })
          .catch((err) => next(err));
      } else {
        let err = new Error(`You're not registered yet.`);
        err.status = 404;
        err.statusText = 'Not Found';
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.getCustomerController = (req, res, next) => {
  Customer.findOne({ _id: req.userId })
    .then((customer) => {
      if (customer) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.setHeader('Content-Type', 'application/json');
        res.json({
          customer,
        });
      } else {
        let err = new Error(`Internal Server Error`);
        err.status = 500;
        err.statusText = 'Internal Server Error';
        next(err);
      }
    })
    .catch((err) => next(err));
};

// TODO: Here we can improve to find more nearest store to the customer
exports.getAllSellersController = (req, res, next) => {
  Customer.findOne({ _id: req.userId })
    .then((customer) => {
      Seller.find({
        $and: [
          {
            'storeDetail.address.pincode': customer.address.pincode,
          },
          {
            'profileVerificationDetail.verification': 'ver',
          },
          {
            'storeDetail.verification': 'ver',
          },
          {
            'bankDetail.verification': 'ver',
          },
        ],
      })
        .sort({ 'storeDetail.address.pincode': 1 })
        .populate([{ path: 'products.root', model: Product }])
        .then((sellers) => {
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.setHeader('Content-Type', 'application/json');
          res.json({
            sellers,
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.updateCustomerDetailController = (req, res, next) => {
  if (req.file) {
    Document.create({
      id: req.userId,
      document: {
        name: req.file.originalname,
        data: {
          buffer: new Buffer(
            fs.readFileSync(req.file.path).toString('base64'),
            'base64'
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
          Customer.findOneAndUpdate(
            { _id: req.userId },
            { $set: { [req.body.dataType]: updatedData } },
            { new: true }
          )
            .then((customer) => {
              if (customer) {
                res.statusCode = 200;
                res.statusMessage = 'OK';
                res.setHeader('Content-Type', 'application/json');
                res.json({
                  customer,
                });
              } else {
                let err = new Error(`Unable to update, please try again.`);
                err.status = 501;
                err.statusText = 'Not Implemented';
              }
            })
            .catch((err) => next(err));
        });
      })
      .catch((err) => next(err));
  } else {
    let updatedData = {
      ...JSON.parse(req.body.data),
    };
    Customer.findOneAndUpdate(
      { _id: req.userId },
      { $set: { [req.body.dataType]: updatedData } },
      { new: true }
    )
      .then((customer) => {
        if (customer) {
          res.statusCode = 200;
          res.statusMessage = 'OK';
          res.setHeader('Content-Type', 'application/json');
          res.json({
            customer,
          });
        } else {
          let err = new Error(`Unable to update, please try again.`);
          err.status = 501;
          err.statusText = 'Not Implemented';
        }
      })
      .catch((err) => next(err));
  }
};

exports.getCartController = (req, res, next) => {
  Customer.findOne({ _id: req.userId })
    .then((customer) => {
      if (customer) {
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.setHeader('Content-Type', 'application/json');
        res.json({
          cart: customer.cart,
        });
      } else {
        let err = new Error(`Internal Server Error`);
        err.status = 500;
        err.statusText = 'Internal Server Error';
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.updateCartController = (req, res, next) => {
  Customer.findOne({ _id: req.userId })
    .then((customer) => {
      if (customer) {
        let cartProducts = req.body.products;
        console.log(cartProducts);
        Seller.findById(req.body.storeId)
          .populate([{ path: 'products.root', model: Product }])
          .then((seller) => {
            // * Find all the products of store in the cart, to retrieve all detail
            let storeProducts = [...seller.products];
            cartProducts = cartProducts.map((product) => {
              let currentProduct = storeProducts.filter(
                (storeProduct) => storeProduct._id.toString() === product.id
              )[0];

              let newProduct = {
                id: product.id,
                variantId: product.variantId,
                quantity: product.quantity,
                name: currentProduct.root.name,
                value: currentProduct.variants.filter(
                  (variant) => variant._id.toString() == product.variantId
                )[0].value,
                price: currentProduct.variants.filter(
                  (variant) => variant._id.toString() == product.variantId
                )[0].price,
              };
              return newProduct;
            });
            let newCart = {
              storeId: req.body.storeId,
              products: cartProducts,
              deliveryCharge: 50,
            };
            customer.cart = newCart;
            customer
              .save()
              .then((customer) => {
                res.statusCode = 200;
                res.statusMessage = 'OK';
                res.setHeader('Content-Type', 'application/json');
                res.json({
                  newCart: customer.cart,
                });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        let err = new Error(`Unable to update, please try again.`);
        err.status = 501;
        err.statusText = 'Not Implemented';
        next(err);
      }
    })
    .catch((err) => next(err));
};
