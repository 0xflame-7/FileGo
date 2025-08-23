const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { File, User } = require("../models/file");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../cookie");
const authMiddleware = require("../middleware");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
}).single("myFile");

router.post("/api/files", authMiddleware, (req, res) => {
  // Store File
  upload(req, res, async (err) => {
    // Validate request
    if (!req.file) {
      return res.json({ error: "No file uploaded" });
    }

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid(),
      path: req.file.path,
      size: req.file.size,
      uploader: req.user._id,
    });

    const response = await file.save();
    // Response -> Link
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.get("/files/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // return res.download(file.path, file.filename);
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${file.uuid}` });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error downloading file. Try later." });
  }
});

router.post("/api/auth/register", async (req, res) => {
  console.log("Register");
  console.log(req.body);

  try {
    const { name, email, password, profilePic } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ isAuth: false, error: "User already exists" });
    }

    // if profilePic (Google) is not sent, fallback to using email (jdenticon on frontend)
    const newUser = new User({
      name,
      email,
      password, // TODO: ⚠️ should hash before saving
      profilePic: profilePic || email,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    req.user = savedUser;

    res.cookie("authToken", token, cookieOptions);
    res.json({ isAuth: true, user: savedUser });

    // res.send(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ isAuth: false, error: "Server error" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  console.log("Login");
  try {
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
  } catch (err) {
    console.error("Here", err);
    res.status(500).json({ isAuth: false, error: "Server error" });
  }
});

router.get("/api/auth/logout", (req, res) => {
  console.log("Logout");
  res.clearCookie("authToken");
  res.json({ isAuth: false });
});

router.get("/api/auth/user", authMiddleware, (req, res) => {
  console.log("User", req.user);
  res.json(req.user);
});

module.exports = router;
