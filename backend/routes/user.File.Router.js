const {
  getStats,
  downloadFile,
} = require("../controller/user.File.controller");
const authMiddleware = require("../middleware/auth.Middleware");

const router = require("express").Router();

router.get("/stats", authMiddleware, getStats);
router.post("/download/:id", downloadFile);
router.get("/download/:id", downloadFile);

module.exports = router;
