const File = require("../models/file.model");
const wrapAsync = require("../utils/tryCatchWrapper");
const parseUploadOptions = require("../utils/uploadOptions");
const { randomUUID } = require("crypto");

// Upload File
const uploadFile = wrapAsync(async (req, res) => {
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
    uploader: req.user._id, // authMiddleware attaches user
    mimeType: req.file.mimetype,
    password,
    expiresAt,
  };

  const file = new File(fileData);
  await file.save();

  res.json({
    id: file.uuid,
    file: {
      name: file.originalName,
      size: file.size,
      expiry: file.expiresAt,
      hasPassword: !!file.password,
    },
  });
});

// Get all files (only user's files)
const getAllFiles = wrapAsync(async (req, res) => {
  console.log("getFiles");
  const files = await File.find({ uploader: req.user._id }).sort({
    uploadedAt: -1,
  });

  res.json(
    files.map((file) => ({
      id: file.uuid,
      name: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      downloadCount: file.downloadCount || 0,
      uploadedAt: file.createdAt,
      expiresAt: file.expiresAt,
      hasPassword: !!file.password,
    }))
  );
});

const deleteFile = wrapAsync(async (req, res) => {
  console.log("deleteFile");
  const { id } = req.params;

  const file = await File.findOne({ uuid: id });
  console.log(file);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  console.log("deleteFile: file.uploader", file.uploader);
  console.log("deleteFile: req.user._id", req.user._id);

  if (!file.uploader.equals(req.user._id)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await File.findByIdAndDelete(file._id);
  res.json({ message: "File deleted successfully" });
});

const getFile = wrapAsync(async (req, res) => {
  console.log("getFile");

  const { id } = req.params;

  const file = await File.findOne({ uuid: id });
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  res.json({
    id: file.uuid,
    name: file.originalName,
    size: file.size,
    mimeType: file.mimeType,
    downloadCount: file.downloadCount || 0,
    uploadedAt: file.createdAt,
    expiresAt: file.expiresAt,
    hasPassword: !!file.password,
  });
});

module.exports = { uploadFile, getAllFiles, deleteFile, getFile };
