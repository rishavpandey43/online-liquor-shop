const dotenv = require("dotenv");
const admin = require("firebase-admin");

// * configure dotenv to access environment variables
dotenv.config();

const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const Seller = require("../models/seller.model");
const DeliveryAgent = require("../models/deliveryAgent.model");

const helpers = require("../util/helpers");
const constants = require("../util/constant");

exports.getAllOrdersCustomer = (req, res, next) => {
  Order.find({ orderedBy: req.userId })
    .sort({ createdAt: -1 })
    .populate([
      { path: "orderedFrom", model: Seller },
      { path: "deliveryAgent", model: DeliveryAgent },
    ])
    .then((orders) => {
      if (orders) {
        res.statusCode = 200;
        res.statusText = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          orders,
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

// TODO: Needs to improve this
exports.placeOrder = (req, res, next) => {
  let newOrder = req.body;
  newOrder.orderedBy = req.userId;
  // * First check, if there's already 2 pending orders of the customer.
  Order.find({
    $and: [
      {
        orderedBy: req.userId,
      },
      {
        status: { $ne: "del" },
      },
      {
        status: { $ne: "can" },
      },
    ],
  }).then((orders) => {
    if (orders.length >= 2) {
      // * here, rejects the request placing new order by customer
      let err = new Error(
        `This order can't be placed right now, since you've already 2 undelivered orders. Please try again`
      );
      err.status = 400;
      err.statusText = "Bad Request";
      next(err);
    } else {
      Order.create(newOrder).then((order) => {
        Order.findById(order._id)
          .populate([
            { path: "orderedBy", model: Customer },
            { path: "orderedFrom", model: Seller },
            { path: "deliveryAgent", model: DeliveryAgent },
          ])
          .then((order) => {
            if (order) {
              Customer.findById(order.orderedBy._id)
                .then((customer) => {
                  // * When order is placed, then delete the cart from customer DB.
                  customer.cart = {
                    storeId: null,
                    products: [],
                    deliveryCharge: null,
                  };
                  customer
                    .save()
                    .then((customer) => {
                      // * NOW ALERT TO SELLER
                      admin.messaging().sendToDevice(
                        order.orderedFrom.fcm.token,
                        {
                          data: {
                            orderId: JSON.stringify(order._id),
                          },
                          notification: {
                            title: helpers.getNotificationFromValue(
                              constants.alertNotificationForSeller,
                              "nwo"
                            ).title,
                            body: helpers.getNotificationFromValue(
                              constants.alertNotificationForSeller,
                              "nwo"
                            ).body,
                          },
                        },
                        {
                          // Required for background/quit data-only messages on iOS
                          contentAvailable: true,
                          // Required for background/quit data-only messages on Android
                          priority: "high",
                        }
                      );
                      res.statusCode = 200;
                      res.statusText = "OK";
                      res.setHeader("Content-Type", "application/json");
                      res.json({
                        order,
                        updatedCart: customer.cart,
                        message: "Order placed successfully",
                      });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            } else {
              let err = new Error(`Internal Server Error`);
              err.status = 500;
              err.statusText = "Internal Server Error";
              next(err);
            }
          });
      });
    }
  });
};

exports.getAllOrdersSeller = (req, res, next) => {
  Order.find({ orderedFrom: req.userId })
    .sort({ createdAt: -1 })
    .populate([
      { path: "orderedBy", model: Customer },
      { path: "deliveryAgent", model: DeliveryAgent },
    ])
    .then((orders) => {
      if (orders) {
        res.statusCode = 200;
        res.statusText = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          orders,
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

exports.processOrderSeller = (req, res, next) => {
  Order.findById(req.body.orderId)
    .populate([
      { path: "orderedBy", model: Customer },
      { path: "orderedFrom", model: Seller },
      { path: "deliveryAgent", model: DeliveryAgent },
    ])
    .then((order) => {
      // * handle when first time seller is processing the order.
      if (order.status === "pen") {
        if (req.body.processType === "can") {
          // * seller rejects to process the order, then update the order status and alert to customer.
          order.status = req.body.processType;
          order
            .save()
            .then((order) => {
              admin.messaging().sendToDevice(
                order.orderedBy.fcm.token,
                {
                  data: {
                    orderId: JSON.stringify(order._id),
                  },
                  notification: {
                    title: helpers.getNotificationFromValue(
                      constants.alertNotificationForCustomer,
                      req.body.processType
                    ).title,
                    body: helpers.getNotificationFromValue(
                      constants.alertNotificationForCustomer,
                      req.body.processType
                    ).body,
                  },
                },
                {
                  // Required for background/quit data-only messages on iOS
                  contentAvailable: true,
                  // Required for background/quit data-only messages on Android
                  priority: "high",
                }
              );
              res.statusCode = 200;
              res.statusText = "OK";
              res.setHeader("Content-Type", "application/json");
              res.json({
                order,
                message: "Order updated by seller",
              });
            })
            .catch((err) => next(err));
        } else {
          // * seller accepts to process the order, then find all the delivery agents nereby and send them push notifications to acccept the delivery and also inform to the customer that order has been processed.
          order.status = req.body.processType;
          order
            .save()
            .then((order) => {
              // * Find the verified deliveryAgents available nereby
              DeliveryAgent.find({
                $and: [
                  {
                    preferredPinCode:
                      order.orderedFrom.storeDetail.address.pincode,
                  },
                  {
                    preferredPinCode: order.orderedBy.address.pincode,
                  },
                  {
                    "profileVerificationDetail.verified": true,
                  },
                  {
                    "vehicleDetail.verified": true,
                  },
                  {
                    "bankDetail.verified": true,
                  },
                ],
              })
                .then((deliveryAgents) => {
                  console.log(deliveryAgents);
                  let allDeliveryAgentsFCMToken = deliveryAgents.map(
                    (deliveryAgent) => deliveryAgent.fcm.token
                  );
                  // * send the push notification to all delivery agents
                  admin.messaging().sendToDevice(
                    allDeliveryAgentsFCMToken,
                    {
                      data: {
                        orderId: JSON.stringify(order._id),
                      },
                      notification: {
                        title: helpers.getNotificationFromValue(
                          constants.alertNotificationForDeliveryAgent,
                          req.body.processType
                        ).title,
                        body: helpers.getNotificationFromValue(
                          constants.alertNotificationForDeliveryAgent,
                          req.body.processType
                        ).body,
                      },
                    },
                    {
                      // Required for background/quit data-only messages on iOS
                      contentAvailable: true,
                      // Required for background/quit data-only messages on Android
                      priority: "high",
                    }
                  );

                  // * Now update the customer too.
                  admin.messaging().sendToDevice(
                    order.orderedBy.fcm.token,
                    {
                      data: {
                        orderId: JSON.stringify(order._id),
                      },
                      notification: {
                        title: helpers.getNotificationFromValue(
                          constants.alertNotificationForCustomer,
                          req.body.processType
                        ).title,
                        body: helpers.getNotificationFromValue(
                          constants.alertNotificationForCustomer,
                          req.body.processType
                        ).body,
                      },
                    },
                    {
                      // Required for background/quit data-only messages on iOS
                      contentAvailable: true,
                      // Required for background/quit data-only messages on Android
                      priority: "high",
                    }
                  );
                  res.statusCode = 200;
                  res.statusText = "OK";
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    order,
                    message: "Order updated by seller",
                  });
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      } else {
        // * handle when seller updates the order which is under process by him/her.
        order.status = req.body.processType;
        order
          .save()
          .then((order) => {
            if (order.deliveryAgent) {
              admin.messaging().sendToDevice(
                order.deliveryAgent.fcm.token,
                {
                  data: {
                    orderId: JSON.stringify(order._id),
                  },
                  notification: {
                    title: helpers.getNotificationFromValue(
                      constants.alertNotificationForDeliveryAgent,
                      req.body.processType
                    ).title,
                    body: helpers.getNotificationFromValue(
                      constants.alertNotificationForDeliveryAgent,
                      req.body.processType
                    ).body,
                  },
                },
                {
                  // Required for background/quit data-only messages on iOS
                  contentAvailable: true,
                  // Required for background/quit data-only messages on Android
                  priority: "high",
                }
              );
            }
            admin.messaging().sendToDevice(
              order.orderedBy.fcm.token,
              {
                data: {
                  orderId: JSON.stringify(order._id),
                },
                notification: {
                  title: helpers.getNotificationFromValue(
                    constants.alertNotificationForCustomer,
                    req.body.processType
                  ).title,
                  body: helpers.getNotificationFromValue(
                    constants.alertNotificationForCustomer,
                    req.body.processType
                  ).body,
                },
              },
              {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: "high",
              }
            );
            res.statusCode = 200;
            res.statusText = "OK";
            res.setHeader("Content-Type", "application/json");
            res.json({
              order,
              message: "Order updated by seller",
            });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

exports.getAllOrdersDeliveryAgent = (req, res, next) => {
  Order.find({ deliveryAgent: req.userId })
    .sort({ createdAt: -1 })
    .populate([
      { path: "orderedBy", model: Customer },
      { path: "orderedFrom", model: Seller },
    ])
    .then((orders) => {
      if (orders) {
        res.statusCode = 200;
        res.statusText = "OK";
        res.setHeader("Content-Type", "application/json");
        res.json({
          orders,
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

exports.getDeliveryNotAssignedOrders = (req, res, next) => {
  Order.find({
    $and: [
      {
        $or: [
          {
            status: "prc",
          },
          {
            status: "prcd",
          },
        ],
      },
      {
        deliveryAgent: null,
      },
    ],
  })
    .sort({ createdAt: -1 })
    .populate([
      { path: "orderedBy", model: Customer },
      { path: "orderedFrom", model: Seller },
    ])
    .then((orders) => {
      res.statusCode = 200;
      res.statusText = "OK";
      res.setHeader("Content-Type", "application/json");
      res.json({
        orders,
      });
    })
    .catch((err) => next(err));
};

exports.processOrderDeliveryAgent = (req, res, next) => {
  Order.findById(req.body.orderId)
    .populate([
      { path: "orderedBy", model: Customer },
      { path: "orderedFrom", model: Seller },
    ])
    .then((order) => {
      if (!order.deliveryAgent) {
        // * handle when first time delivery agent is processing the order.
        if (req.body.processType === "no") {
          // * here, delivery agent has rejected to deliver current order
          res.statusCode = 200;
          res.statusText = "OK";
          res.setHeader("Content-Type", "application/json");
          res.json({
            message: "You've successfully rejected to deliver this order.",
          });
        } else if (req.body.processType === "yes") {
          // * we'll check if already more than 2 orders are pending with particular delivery agent
          Order.find({
            $and: [
              {
                $or: [
                  {
                    status: "prc",
                  },
                  {
                    status: "prcd",
                  },
                  {
                    status: "ofd",
                  },
                ],
              },
              {
                deliveryAgent: req.userId,
              },
            ],
          })
            .then((orders) => {
              let totalUndeliveredOrders = orders.filter(
                (order) => order.status !== "del"
              );
              if (totalUndeliveredOrders.length >= 2) {
                // * here, rejects the request of delivery agent to deliver the order
                let err = new Error(
                  `You cannot accept more orders to deliver for now. You already have 2 pending orders for delivery`
                );
                err.status = 400;
                err.statusText = "Bad Request";
                next(err);
              } else {
                // * here, delivery agent has accepted to deliver current order
                order.deliveryAgent = req.userId;
                order
                  .save()
                  .then((order) => {
                    // * NOW ALERT TO CUSTOMER
                    admin.messaging().sendToDevice(
                      order.orderedBy.fcm.token,
                      {
                        data: {
                          orderId: JSON.stringify(order._id),
                        },
                        notification: {
                          title: "Order Update",
                          body:
                            "Delivery agent has been successfully assigned to the order.",
                        },
                      },
                      {
                        // Required for background/quit data-only messages on iOS
                        contentAvailable: true,
                        // Required for background/quit data-only messages on Android
                        priority: "high",
                      }
                    );
                    // * NOW ALERT TO SELLER
                    admin.messaging().sendToDevice(
                      order.orderedFrom.fcm.token,
                      {
                        data: {
                          orderId: JSON.stringify(order._id),
                        },
                        notification: {
                          title: "Order Update",
                          body:
                            "Delivery agent has been successfully assigned to the order.",
                        },
                      },
                      {
                        // Required for background/quit data-only messages on iOS
                        contentAvailable: true,
                        // Required for background/quit data-only messages on Android
                        priority: "high",
                      }
                    );
                    res.statusCode = 200;
                    res.statusText = "OK";
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                      order,
                      message:
                        "Current order has been successfully assigned to you for delivery",
                    });
                  })
                  .catch((err) => next(err));
              }
            })
            .catch((err) => next(err));
        }
      } else {
        order.status = req.body.processType;
        order
          .save()
          .then((order) => {
            // * NOW ALERT TO CUSTOMER
            admin.messaging().sendToDevice(
              order.orderedBy.fcm.token,
              {
                data: {
                  orderId: JSON.stringify(order._id),
                },
                notification: {
                  title: helpers.getNotificationFromValue(
                    constants.alertNotificationForCustomer,
                    req.body.processType
                  ).title,
                  body: helpers.getNotificationFromValue(
                    constants.alertNotificationForCustomer,
                    req.body.processType
                  ).body,
                },
              },
              {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: "high",
              }
            );
            // * NOW ALERT TO SELLER
            admin.messaging().sendToDevice(
              order.orderedFrom.fcm.token,
              {
                data: {
                  orderId: JSON.stringify(order._id),
                },
                notification: {
                  title: helpers.getNotificationFromValue(
                    constants.alertNotificationForSeller,
                    req.body.processType
                  ).title,
                  body: helpers.getNotificationFromValue(
                    constants.alertNotificationForSeller,
                    req.body.processType
                  ).body,
                },
              },
              {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: "high",
              }
            );
            res.statusCode = 200;
            res.statusText = "OK";
            res.setHeader("Content-Type", "application/json");
            res.json({
              order,
              message: "Order updated by seller",
            });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};
