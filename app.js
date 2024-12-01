const express = require("express");
const app = express();
const cors = require("cors");
const path=require('path')
require("dotenv").config();
require("./conn/conn");

const user = require("./routes/user");
const car = require("./routes/car");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect unknown routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Routes
app.use("/api/v1/user", user);
app.use("/api/v1/car", car);

app.get("/", (req, res) => {
  res.send("Hello there: Backend!");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
