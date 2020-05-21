const express = require('express');

const authenticate = require('../middlewares/authenticate');
const fileUpload = require('../middlewares/fileUpload');

const sellerRouterController = require('../controllers/seller.router.controller');

const sellerRouter = express.Router(); // initialize express router

sellerRouter
  .get(
    '/request-phone-otp-register',
    sellerRouterController.requestPhoneOTPForRegister
  )
  .post('/register', sellerRouterController.register)
  .get(
    '/request-phone-otp-login',
    sellerRouterController.requestPhoneOTPForLogin
  )
  .get('/login', sellerRouterController.login)
  .get('/logout', authenticate.verifyUserToken, sellerRouterController.logout)
  .get(
    '/get-seller',
    authenticate.verifyUserToken,
    sellerRouterController.getSellerController
  )
  .put(
    '/update-seller',
    authenticate.verifyUserToken,
    fileUpload.upload.single('file'),
    sellerRouterController.updateSellerDetailController
  )
  .post(
    '/add-new-product',
    authenticate.verifyUserToken,
    sellerRouterController.addNewProductController
  )
  .get(
    '/get-all-products',
    authenticate.verifyUserToken,
    sellerRouterController.getAllProductsController
  );

module.exports = sellerRouter;
