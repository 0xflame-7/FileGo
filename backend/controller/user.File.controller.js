const File = require("../models/file.model");
const wrapAsync = require("../utils/tryCatchWrapper");
const path = require("path");
const fs = require("fs");

// Get stats (user-specific)
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const getStats = wrapAsync(async (req, res) => {
  const userId = req.user._id;

  // Total uploads
  const totalUploads = await File.countDocuments({ uploader: userId });

  // Total downloads
  const downloadAgg = await File.aggregate([
    { $match: { uploader: userId } },
    { $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } },
  ]);
  const totalDownloads = downloadAgg[0]?.totalDownloads || 0;

  // Active files count
  const activeFiles = await File.countDocuments({
    uploader: userId,
    isActive: true,
  });

  // Storage used (only active files)
  const sizeAgg = await File.aggregate([
    { $match: { uploader: userId, isActive: true } },
    { $group: { _id: null, totalSize: { $sum: "$size" } } },
  ]);
  const totalBytes = sizeAgg[0]?.totalSize || 0;
  const storageUsed = formatBytes(totalBytes);

  res.json({
    totalUploads,
    totalDownloads,
    activeFiles,
    storageUsed,
  });
});

const downloadFile = wrapAsync(async (req, res) => {
  console.log("downloadFile");

  const { id } = req.params;

  const file = await File.findOne({ uuid: id });
  console.log(file);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  if (file.password) {
    const { password } = req.body;
    console.log(password);
    console.log(file.password);
    if (!password) {
      return res.status(401).json({ message: "Password required" });
    }

    if (file.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
  }

  console.log("ok");
  const filePath = path.resolve(file.path);
  console.log("filePath", filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File data not found" });
  }

  // Increment download count
  file.downloadCount = (file.downloadCount || 0) + 1;
  await file.save();

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.originalName}"`
  );
  res.setHeader("Content-Type", file.mimeType);
  res.setHeader("Content-Length", file.size);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

module.exports = { getStats, downloadFile };
