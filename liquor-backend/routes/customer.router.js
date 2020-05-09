const express = require("express");

const middleWares = require("../middlewares/authenticate");

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
  .get("/logout", middleWares.verifyUserToken, customerRouterController.logout)
  .get(
    "/get-customer",
    middleWares.verifyUserToken,
    customerRouterController.getCustomerController
  )
  .get(
    "/get-all-sellers",
    middleWares.verifyUserToken,
    customerRouterController.getAllSellersController
  )
  .put(
    "/update-customer",
    middleWares.verifyUserToken,
    customerRouterController.updateCustomerDetailController
  )
  .get(
    "/get-cart",
    middleWares.verifyUserToken,
    customerRouterController.getCartController
  )
  .put(
    "/update-cart",
    middleWares.verifyUserToken,
    customerRouterController.updateCartController
  );

module.exports = customerRouter;
