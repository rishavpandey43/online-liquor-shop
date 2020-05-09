exports.alertNotificationForCustomer = [
  {
    title: "Order Update",
    body: "Your order is under process by seller.",
    value: "prc",
  },
  {
    title: "Order Update",
    body: "Your order has been successfully processed by seller.",
    value: "prcd",
  },
  {
    title: "Order Update",
    body: "Your order is out for delivery.",
    value: "ofd",
  },
  {
    title: "Order Update",
    body:
      "Your order has been successfully delivered, Thank you for shopping with us.",
    value: "del",
  },
  {
    title: "Order Update",
    body: "We're sorry, your order has been cancelled by seller.",
    value: "can",
  },
];

exports.alertNotificationForSeller = [
  {
    title: "New Order",
    body: "You've received a new order.",
    value: "nwo",
  },
  {
    title: "Order Update",
    body: "Order is out for delivery.",
    value: "ofd",
  },
  {
    title: "Order Update",
    body: "Order has been successfully delivered to the customer.",
    value: "del",
  },
];

exports.alertNotificationForDeliveryAgent = [
  {
    title: "New Order",
    body: "New order is waiting to be delivered in your area.",
    value: "prc",
  },
  {
    title: "Order Update",
    body: "Order has been processed by seller",
    value: "prcd",
  },
];
