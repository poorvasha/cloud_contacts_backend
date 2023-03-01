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
      return res.status(200).json({ message: "Email already exist" });

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
    res.status(200).json({ message: "created an user for id " + user._id });
  } catch (error) {
    res.status(400).json({ message: error });
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
    if (!user) return res.status(200).json({ message: "Email does not exist" });

    // check for valid password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(200).json({ message: "password is incorrect" });

    // generate auth token
    const accesstoken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res
      .header("auth_token", accesstoken)
      .json({ message: "auth_token : " + accesstoken });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
