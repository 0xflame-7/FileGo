const {
  uploadFile,
  getAllFiles,
  deleteFile,
  getFile,
} = require("../controller/file.controller");
const authMiddleware = require("../middleware/auth.Middleware");
const upload = require("../middleware/file.middleware");

const router = require("express").Router();

router.post("/upload", authMiddleware, upload, uploadFile);
router.get("/", authMiddleware, getAllFiles);
router.get("/:id", getFile);
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;
