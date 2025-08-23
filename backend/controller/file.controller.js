const File = require("../models/file.model");
const wrapAsync = require("../utils/tryCatchWrapper");
const parseUploadOptions = require("../utils/uploadOptions");
const { randomUUID } = require("crypto");

const uploadFile = wrapAsync(async (req, res) => {
  console.log("Upload");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { password, expiresAt } = parseUploadOptions(req.body);

  const uuid = randomUUID();

  const fileData = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    uuid,
    uploader: req.user._id, // assuming authMiddleware attaches `req.user`
    mimeType: req.file.mimetype,
    password,
    expiresAt,
  };

  const file = new File(fileData);
  await file.save();

  const shareUrl = `${req.protocol}://${req.get("host")}/download/${file.uuid}`;

  res.json({
    id: file.uuid,
    shareUrl,
    file: {
      name: file.originalName,
      size: file.size,
      expiry: file.expiresAt,
      hasPassword: !!file.password,
    },
  });
});

module.exports = { uploadFile };
