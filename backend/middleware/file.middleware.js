const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file.middleware.js: destination");
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    console.log("file.middleware.js: filename");
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100 MB
  },
}).single("myFile");

module.exports = upload;
