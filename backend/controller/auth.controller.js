const wrapAsync = require("../utils/tryCatchWrapper");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../config/cookie");
const bcrypt = require("bcrypt");

const login_user = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .json({ isAuth: false, error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ isAuth: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("authToken", token, { ...cookieOptions, maxAge: 1000 * 60 * 60 });
  const { password: _, ...userData } = user.toObject();

  res.json({ isAuth: true, user: userData });
});

const register_user = wrapAsync(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ isAuth: false, error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profilePic,
  });

  const savedUser = await newUser.save();

  const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("authToken", token, { ...cookieOptions, maxAge: 1000 * 60 * 60 });
  const { password: _, ...userData } = savedUser.toObject();

  res.json({ isAuth: true, user: userData });
});

const logout_user = wrapAsync(async (req, res) => {
  res.clearCookie("authToken", cookieOptions);
  res.json({ isAuth: false });
});

const get_user = wrapAsync(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ isAuth: false, error: "Unauthorized" });
  }

  res.json({ isAuth: true, user: req.user });
});

module.exports = {
  login_user,
  logout_user,
  get_user,
  register_user,
};
