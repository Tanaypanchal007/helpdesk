const express = require("express");
const userRouters = require("./router/user.routes")

const app = express();
app.use(express.json());

app.use("/api/auth", userRouters);

module.exports = app;