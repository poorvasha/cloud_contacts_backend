const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv/config");

const usersRoute = require("./src/Routes/users");
const constactsRoute = require("./src/Routes/contacts");
const verifytoken = require("./src/verify_token");

const app = express();

app.use(bodyParser.json());
app.use("/api/users", usersRoute);
app.use("/api/contacts", verifytoken);
app.use("/api/contacts", constactsRoute);

mongoose.set("strictQuery", false);
// connect to DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log(error + " failed to connect");
  });

app.listen(5000);
