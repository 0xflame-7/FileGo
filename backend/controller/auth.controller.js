const wrapAsync = require("../utils/tryCatchWrapper");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../config/cookie");

const login_user = wrapAsync(async (req, res) => {
  console.log("Login", req.body);
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });

  // TODO: ⚠️ should hash Check password
  if (!user || user.password !== password) {
    return res
      .status(400)
      .json({ isAuth: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  req.user = user;

  res.cookie("authToken", token, cookieOptions);
  res.json({ isAuth: true, user });
});

const register_user = wrapAsync(async (req, res) => {
  console.log("Register", req.body);

  const { name, email, password, profilePic } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ isAuth: false, error: "User already exists" });
  }

  // ⚠️ Hash password before saving
  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password, // replace with hashedPassword
    profilePic: profilePic || email, // fallback to identicon
  });

  const savedUser = await newUser.save();

  const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("authToken", token, cookieOptions);
  res.json({ isAuth: true, user: savedUser });
});

const logout_user = wrapAsync(async (req, res) => {
  res.clearCookie("authToken");
  res.json({ isAuth: false });
});

const get_user = wrapAsync(async (req, res) => {
  // Check if req.user exists
  if (!req.user) {
    return res.status(401).json({ isAuth: false, error: "Unauthorized" });
  }
  res.json(req.user);
});

module.exports = {
  login_user,
  logout_user,
  get_user,
  register_user,
};
