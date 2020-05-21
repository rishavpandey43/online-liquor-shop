const express = require("express");

const authenticate = require("../middlewares/authenticate");
const fileUpload = require("../middlewares/fileUpload");

const customerRouterController = require("../controllers/customer.router.controller");

const customerRouter = express.Router(); // initialize express router

customerRouter
  .get(
    "/request-phone-otp-register",
    customerRouterController.requestPhoneOTPForRegister
  )
  .post("/register", customerRouterController.register)
  .get(
    "/request-phone-otp-login",
    customerRouterController.requestPhoneOTPForLogin
  )
  .get("/login", customerRouterController.login)
  .get("/logout", authenticate.verifyUserToken, customerRouterController.logout)
  .get(
    "/get-customer",
    authenticate.verifyUserToken,
    customerRouterController.getCustomerController
  )
  .get(
    "/get-all-sellers",
    authenticate.verifyUserToken,
    customerRouterController.getAllSellersController
  )
  .put(
    "/update-customer",
    authenticate.verifyUserToken,
    fileUpload.upload.single("file"),
    customerRouterController.updateCustomerDetailController
  )
  .get(
    "/get-cart",
    authenticate.verifyUserToken,
    customerRouterController.getCartController
  )
  .put(
    "/update-cart",
    authenticate.verifyUserToken,
    customerRouterController.updateCartController
  );

module.exports = customerRouter;
