const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const Users = require("../Models/user_model");
const {
  registerValidation,
  loginValidation,
} = require("../Validations/user_validation");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // validation
    const { error } = registerValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // check user already exist
    const emailAlreadyExist = await Users.findOne({ email: req.body.email });
    if (emailAlreadyExist)
      return res
        .status(400)
        .json({ message: "User already exist, Please login" });

    // hash Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create db object
    const user = Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // save in DB
    const savedData = await user.save();
    if (!savedData)
      return res.status(500).json({ message: "Registration failed" });

    res.json({ userId: savedData });
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // validation
    const { error } = loginValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // check email already exist
    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // check for valid password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Please check your password" });

    // generate auth token
    const accesstoken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.json({ accesstoken: accesstoken, userData: user });
  } catch (error) {
    console.log(exception);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
