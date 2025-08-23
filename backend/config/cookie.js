const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production" ? true : false,
  maxAge: 1000 * 60 * 60, // 1 hours
};

module.exports = cookieOptions;
