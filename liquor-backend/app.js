const http = require("http");
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const sellerRouter = require("./routes/seller.router");
const customerRouter = require("./routes/customer.router");
const orderRouter = require("./routes/order.router");
const deliveryAgentRouter = require("./routes/deliveryAgent.router");

// * configure dotenv to access environment variables
dotenv.config();

// * Initialise firebase to the application
const serviceAccount = require("./util/online-grocery-store-1e940-firebase-adminsdk-exp4e-314edbcaac.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// * Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// * create express instance
const app = express();

// * Get port from environment and store in Express.
const PORT = normalizePort(process.env.PORT || "5000");
app.set("port", PORT);

// * Create HTTP server.
const server = http.createServer(app);

// * connect server to mongoDB Atlas
const URI = process.env.ATLAS_DB_URI;
mongoose.connect(URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongoose database connection established successfully");
});

connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// * USE ALL THE DEDICATED ROUTERS HERE...
app.use("/seller", sellerRouter);
app.use("/customer", customerRouter);
app.use("/order", orderRouter);
app.use("/deliveryAgent", deliveryAgentRouter);

// * catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// * error handler
app.use((err, req, res, next) => {
  // console.log("Error- ", err);
  res.statusCode = err.status || 500;
  res.statusText = err.statusText || "Internal Server Error";
  res.setHeader("Content-Type", "application/json");
  res.json({
    errMessage:
      err.message || "Server is unable to process request, Please try again",
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
