const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

const user = require("./routes/user");
const car = require("./routes/car");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/user", user);
app.use("/api/v1/car", car);

app.get("/", (req, res) => {
  res.send("Hello there: Backend!");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
