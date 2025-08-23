const { uploadFile } = require("../controller/file.controller");
const authMiddleware = require("../middleware/auth.Middleware");
const upload = require("../middleware/file.middleware");

const router = require("express").Router();

router.post("/upload", authMiddleware, upload, uploadFile);

module.exports = router;
