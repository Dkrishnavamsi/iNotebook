const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "vamsiisnice";
// Route1:Create a User using: "/api/auth/user". Does't require Auth
router.post(
  "/user",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password must be atleast 5 chars").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad requests and th errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // check weather the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please enter a unique value for email",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      //console.log(jwtData);
      //   .then((user) => res.json(user))
      //   .catch((err) => {
      //     console.log(err);
      //     res.status(400).json({
      //       error: "Please enter a unique value for email",
      //       message: err.message,
      //     });
      //   });
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// Route2:Authenticate a user using post "/api/auth/login". No login requires

router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password can not be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad requests and th errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with valid Email,Password",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with valid Email,Password",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// Route 3: Get loggedIn user details: post "/api/auth/getuser".Login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
});
module.exports = router;
