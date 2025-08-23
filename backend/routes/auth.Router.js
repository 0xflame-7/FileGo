const router = require("express").Router();
const {
  login_user,
  logout_user,
  get_user,
  register_user,
} = require("../controller/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  res.send("Hello from backend!");
});

router.post("/login", login_user);
router.post("/register", register_user);
router.get("/logout", logout_user);
router.get("/user", authMiddleware, get_user);

module.exports = router;
