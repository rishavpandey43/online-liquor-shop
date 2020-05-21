const express = require('express');

const authenticate = require('../middlewares/authenticate');
const fileUpload = require('../middlewares/fileUpload');

const deliveryAgentRouterController = require('../controllers/deliveryAgent.router.controller');

const deliveryAgentRouter = express.Router(); // initialize express router

deliveryAgentRouter
  .get(
    '/request-phone-otp-register',
    deliveryAgentRouterController.requestPhoneOTPForRegister
  )
  .post('/register', deliveryAgentRouterController.register)
  .get(
    '/request-phone-otp-login',
    deliveryAgentRouterController.requestPhoneOTPForLogin
  )
  .get('/login', deliveryAgentRouterController.login)
  .get(
    '/logout',
    authenticate.verifyUserToken,
    deliveryAgentRouterController.logout
  )
  .get(
    '/get-deliveryAgent',
    authenticate.verifyUserToken,
    deliveryAgentRouterController.getDeliveryAgentController
  )
  .put(
    '/update-deliveryAgent',
    authenticate.verifyUserToken,
    fileUpload.upload.single('file'),
    deliveryAgentRouterController.updateDeliveryAgentController
  );

module.exports = deliveryAgentRouter;
