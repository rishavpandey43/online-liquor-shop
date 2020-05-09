const express = require("express");

const middleWares = require("../middlewares/authenticate");

const sellerRouterController = require("../controllers/seller.router.controller");

const sellerRouter = express.Router(); // initialize express router

sellerRouter
  .get(
    "/request-phone-otp-register",
    sellerRouterController.requestPhoneOTPForRegister
  )
  .post("/register", sellerRouterController.register)
  .get(
    "/request-phone-otp-login",
    sellerRouterController.requestPhoneOTPForLogin
  )
  .get("/login", sellerRouterController.login)
  .get("/logout", middleWares.verifyUserToken, sellerRouterController.logout)
  .get(
    "/get-seller",
    middleWares.verifyUserToken,
    sellerRouterController.getSellerController
  )
  .put(
    "/update-seller",
    middleWares.verifyUserToken,
    sellerRouterController.updateSellerDetailController
  )
  .post(
    "/add-new-product",
    middleWares.verifyUserToken,
    sellerRouterController.addNewProductController
  )
  .get(
    "/get-all-products",
    middleWares.verifyUserToken,
    sellerRouterController.getAllProductsController
  );

module.exports = sellerRouter;
