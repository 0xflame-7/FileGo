function parseUploadOptions(body) {
  let { expiry, password } = body;
  let expiresAt = null;

  if (expiry && expiry !== "never") {
    const now = new Date();
    switch (expiry) {
      case "1h":
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
        break;
      case "1d":
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "7d":
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
    }
  }

  return { password, expiresAt };
}

module.exports = parseUploadOptions;
