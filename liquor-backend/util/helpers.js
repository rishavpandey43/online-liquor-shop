exports.extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

exports.getNotificationFromValue = (sender, value) => {
  return (
    sender.filter((notification) => notification.value === value)[0] || {
      title: "Order Update",
      body: "You've new update regarding your order",
    }
  );
};
