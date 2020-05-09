const express = require("express");

const middleWares = require("../middlewares/authenticate");

const deliveryAgentRouterController = require("../controllers/deliveryAgent.router.controller");

const deliveryAgentRouter = express.Router(); // initialize express router

deliveryAgentRouter
  .get(
    "/request-phone-otp-register",
    deliveryAgentRouterController.requestPhoneOTPForRegister
  )
  .post("/register", deliveryAgentRouterController.register)
  .get(
    "/request-phone-otp-login",
    deliveryAgentRouterController.requestPhoneOTPForLogin
  )
  .get("/login", deliveryAgentRouterController.login)
  .get(
    "/logout",
    middleWares.verifyUserToken,
    deliveryAgentRouterController.logout
  )
  .get(
    "/get-delivery-agent-profile",
    middleWares.verifyUserToken,
    deliveryAgentRouterController.getDeliveryAgentProfileController
  )
  .put(
    "/update-delivery-agent-profile",
    middleWares.verifyUserToken,
    deliveryAgentRouterController.updateDeliveryAgentProfileController
  );

module.exports = deliveryAgentRouter;
