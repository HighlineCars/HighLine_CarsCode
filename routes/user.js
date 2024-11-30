const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
// // Sign-up
// router.post("/sign-up", async (req, res) => {
//   try {
//     const { username, email, password} = req.body;

//     if (username.length < 3) {
//       return res
//         .status(400)
//         .json({ message: "Username length should be greater than 3" });
//     }
//     const existUsername = await User.findOne({ username: username });
//     if (existUsername) {
//       return res.status(400).json({ message: "Username exists" });
//     }
//     const existEmail = await User.findOne({ email: email });
//     if (existEmail) {
//       return res.status(400).json({ message: "Email exists" });
//     }
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password's length should be greater than 5" });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       username: username,
//       email: email,
//       password: hashPassword,
//     });
//     await newUser.save();
//     return res.status(200).json({ message: "Signup Successfull" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
//Sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    else{
      await bcrypt.compare(password, existUser.password, (err, data) => {
        if (data) {
          const authClaims = [
            { name: existUser.email },
            { role: existUser.role },
          ];
          const token = jwt.sign({ authClaims }, "highlinecar", {
            expiresIn: "90d",
          });
          res.status(200).json({
            message: "Signin Successfull",
            id: existUser._id,
            role: existUser.role,
            token: token,
          });
        } else {
          res.status(400).json({ message: "Wrong Password" });
        }
      });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
//get user info
router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const {id} = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//Update user info
router.put("/update-username", authenticateToken,async (req, res) => {
 

  try {
    const {id} = req.headers;
    const {username} = req.body;
    const newUser = {};
    if(username) {newUser.username = username; }
    let user = await User.findById(id);  
    user = await User.findByIdAndUpdate(id, {$set: newUser}, {new: true});
    res.status(200).json({
      message: "Username updated successfully",
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
});
router.put("/update-password", authenticateToken,async (req, res) => {


  try {
    const {id} = req.headers;
    const {password} = req.body;
    const newUser = {};
    if(password) {newUser.password = await bcrypt.hash(password, 10); }
    let user = await User.findById(id);  
    user = await User.findByIdAndUpdate(id, {$set: newUser}, {new: true});
    res.status(200).json({
      message: "Password updated successfully",
      user: {
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
});
module.exports = router;
