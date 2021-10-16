const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

const Port = process.env.PORT || 5000;

mongoose
  .connect(process.env.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" mongoose connected ");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded());
app.use("/api", require("./router"));
app.listen(Port, () => {
  console.log(`listening on port ${Port}`);
});
